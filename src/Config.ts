import { isPlainObject } from 'is-what';
import _ from 'lodash';
import { z } from 'zod';

import { validateObjectPropertyUnique } from './validationHelpers';

const actionEnum = z.enum(['destroy', 'remove']);
type Action = z.infer<typeof actionEnum>;

const actionableSchema = z.object({
  action: actionEnum.optional(),
  id: z.string().optional(),
});

const cliParamsSchema = z
  .object({
    assume_role: z.string().nullable().optional(),
    aws_profile: z.string().nullable().optional(),
    permission_set: z.string().nullable().optional(),
    use_local_state: z.boolean().nullable().optional(),
  })
  .catchall(z.any());

export type Actionable = z.infer<typeof actionableSchema>;

const filterValid = <T extends Actionable = Actionable>(
  collection: Record<string, T> = {},
) =>
  _.entries(collection)
    .filter(([, v]) => !v.action || !['destroy', 'remove'].includes(v.action))
    .map(([k]) => k);

const actionErrorModifier = (action?: Action) =>
  action === 'destroy'
    ? 'destroyed'
    : action === 'remove'
      ? 'removed'
      : 'invalid';

export const configSchema = z
  .object({
    accounts: z.record(
      actionableSchema
        .extend({
          email: z.string(),
          name: z.string(),
          organizational_unit: z.string().nullable().optional(),
        })
        .catchall(z.any()),
    ),
    applications: z
      .record(
        z.object({
          environments: z
            .record(
              z
                .object({
                  account: z.string(),
                })
                .catchall(z.any())
                .nullable()
                .optional(),
            )
            .nullable()
            .optional(),
        }),
      )
      .nullable()
      .optional(),
    cli_params: cliParamsSchema.optional(),
    configPath: z.string().nullable().optional(),
    organization: z
      .object({
        id: z.string().nullable().optional(),
        key_accounts: z
          .object({
            master: z.string(),
            terraform_state: z.string(),
          })
          .catchall(z.string()),
      })
      .catchall(z.any()),
    organizational_units: z
      .record(
        z
          .object({
            name: z.string(),
            id: z.string().nullable().optional(),
            parent: z.string().nullable().optional(),
          })
          .catchall(z.any()),
      )
      .nullable()
      .optional(),
    sso: z
      .object({
        groups: z
          .record(
            z
              .object({
                account_permission_sets: z
                  .string()
                  .or(z.string().array())
                  .or(z.record(z.string().or(z.string().array())))
                  .nullable()
                  .optional(),
                name: z.string(),
              })
              .catchall(z.any()),
          )
          .nullable()
          .optional(),
        permission_sets: z
          .record(
            z
              .object({
                name: z.string(),
                policies: z
                  .string()
                  .or(z.string().array())
                  .nullable()
                  .optional(),
              })
              .catchall(z.any()),
          )
          .nullable()
          .optional(),
        policies: z.record(z.string()).nullable().optional(),
        reference: z
          .object({
            account_permission_sets: z.record(z.string().array()),
            account_policies: z.record(z.string().array()),
            group_account_permission_set_policies: z.record(
              z.record(z.record(z.string().array())),
            ),
            permission_set_accounts: z.record(z.string().array()),
            policy_accounts: z.record(z.string().array()),
          })
          .strict()
          .optional(),
        start_url: z.string(),
      })
      .nullable()
      .optional(),
    terraform: z
      .object({
        aws_version: z.string(),
        paths: z.string().or(z.string().array()),
        state: z
          .object({
            bucket: z.string(),
            key: z.string(),
            lock_table: z.string(),
          })
          .catchall(z.any()),
        terraform_version: z.string(),
      })
      .catchall(z.any()),
    workspaces: z
      .record(
        z
          .object({
            cli_defaults: cliParamsSchema.nullable().optional(),
            cli_defaults_path: z.string().nullable().optional(),
            generators: z.record(z.string()).nullable().optional(),
            path: z.string(),
            shared_config_path: z.string(),
          })
          .catchall(z.any())
          .nullable()
          .optional(),
      )
      .nullable()
      .optional(),
  })
  .superRefine((data, ctx) => {
    const validAccounts = filterValid(data.accounts);
    const validOus = _.keys(data.organizational_units);

    // validate email uniqueness across accounts
    validateObjectPropertyUnique(data, ctx, 'accounts', 'account', 'email');

    // validate name uniqueness across accounts
    validateObjectPropertyUnique(data, ctx, 'accounts', 'account', 'name');

    // validate accounts
    for (const [
      accountKey,
      { action, id, organizational_unit: ou },
    ] of _.entries(data.accounts)) {
      // validate id
      if (action && !id)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `id required when action populated`,
          path: ['accounts', accountKey, 'id'],
        });

      // validate action
      if (
        action &&
        [
          data.organization.master_account,
          data.terraform.state.account,
        ].includes(accountKey)
      )
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `no action allowed on account`,
          path: ['accounts', accountKey, 'action'],
        });

      // validate organizational_unit
      if (ou && !validOus.includes(ou)) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_enum_value,
          message: `invalid organizational_unit`,
          options: validOus,
          path: ['accounts', accountKey, 'organizational_unit'],
          received: ou,
        });
      }
    }

    // validate workspaces
    if (data.workspaces)
      for (const workspace of _.values(data.workspaces)) {
        // validate permission_set
        if (
          workspace?.cli_defaults?.permission_set &&
          !(
            data.sso?.permission_sets &&
            workspace.cli_defaults.permission_set in data.sso.permission_sets
          )
        )
          ctx.addIssue({
            code: z.ZodIssueCode.invalid_enum_value,
            message: `invalid permission set`,
            options: _.keys(data.sso?.permission_sets),
            received: workspace.cli_defaults.permission_set,
          });
      }

    // validate cli_params
    if (
      !(
        (data.cli_params?.assume_role && data.cli_params.aws_profile) ??
        data.cli_params?.permission_set
      )
    )
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Either both assume_role & aws_profile or permission_set alone must be specified.`,
        path: ['cli_params'],
      });

    // validate application environments
    for (const applicationKey in data.applications) {
      const application = data.applications[applicationKey];

      for (const environmentKey in application.environments) {
        const environment = application.environments[environmentKey];

        // validate account
        const account = environment?.account;
        if (account && !validAccounts.includes(account)) {
          const action = data.accounts[account].action;

          ctx.addIssue({
            code: z.ZodIssueCode.invalid_enum_value,
            message: `${actionErrorModifier(action)} account`,
            options: validAccounts,
            path: [
              'applications',
              applicationKey,
              'environments',
              environmentKey,
              'account',
            ],
            received: account,
          });
        }
      }
    }

    // validate organization.key_accounts
    for (const account of _.values(data.organization.key_accounts))
      if (!validAccounts.includes(account)) {
        const action = data.accounts[account].action;

        ctx.addIssue({
          code: z.ZodIssueCode.invalid_enum_value,
          message: `${actionErrorModifier(action)} account`,
          options: validAccounts,
          path: ['organization', 'key_accounts', account],
          received: account,
        });
      }

    // validate name uniqueness across organizational_units
    validateObjectPropertyUnique(
      data,
      ctx,
      'organizational_units',
      'organizational_unit',
      'name',
    );

    // validate organizational_units
    for (const ou in data.organizational_units) {
      // TODO: validate circular parent dependencies

      // validate parent
      const parent = data.organizational_units[ou].parent;
      if (parent && !validOus.includes(parent)) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_enum_value,
          message: `invalid parent`,
          options: validOus,
          path: ['organizational_units', ou, 'parent'],
          received: parent,
        });
      }
    }

    // validate name uniqueness across sso groups
    validateObjectPropertyUnique(data, ctx, 'sso.groups', 'group', 'name');

    // validate name uniqueness across sso permission sets
    validateObjectPropertyUnique(
      data,
      ctx,
      'sso.permission_sets',
      'permission_set',
      'name',
    );

    // validate sso groups
    if (data.sso?.groups)
      for (const [groupKey, group] of _.entries(data.sso.groups)) {
        if (isPlainObject(group.account_permission_sets)) {
          // validate account permission sets
          for (const [accountKey, permissionSets] of _.entries(
            group.account_permission_sets,
          )) {
            // validate account key
            if (!validAccounts.includes(accountKey)) {
              const action = data.accounts[accountKey].action;

              ctx.addIssue({
                code: z.ZodIssueCode.invalid_enum_value,
                message: `${actionErrorModifier(action)} account`,
                options: validAccounts,
                path: [
                  'sso',
                  'groups',
                  groupKey,
                  'account_permisison_sets',
                  accountKey,
                ],
                received: accountKey,
              });
            }

            // validate permission sets
            const diff = _.difference(
              _.castArray(permissionSets),
              _.keys(data.sso.permission_sets),
            );

            if (_.size(diff))
              ctx.addIssue({
                code: z.ZodIssueCode.invalid_enum_value,
                message: `invalid permission set(s)`,
                options: _.keys(data.sso.permission_sets),
                path: [
                  'sso',
                  'groups',
                  groupKey,
                  'account_permisison_sets',
                  accountKey,
                ],
                received: diff.join(', '),
              });
          }
        } else {
          // validate global permission sets
          const diff = _.difference(
            _.castArray(group.account_permission_sets),
            _.keys(data.sso.permission_sets),
          );

          if (_.size(diff))
            ctx.addIssue({
              code: z.ZodIssueCode.invalid_enum_value,
              message: `invalid permission set(s)`,
              options: _.keys(data.sso.permission_sets),
              path: ['sso', 'groups', groupKey, 'account_permisison_sets'],
              received: diff.join(', '),
            });
        }
      }
  })
  .transform((data) => {
    const validAccounts = filterValid(data.accounts);

    // expand account_permission_sets
    if (data.sso?.groups) {
      for (const group of _.values(data.sso.groups)) {
        if (group.account_permission_sets)
          if (isPlainObject(group.account_permission_sets))
            group.account_permission_sets = _.mapValues(
              group.account_permission_sets,
              (permissionSets) => _.castArray(permissionSets),
            );
          else
            group.account_permission_sets = _.fromPairs(
              validAccounts.map((account) => [
                account,
                _.castArray(group.account_permission_sets as string | string[]),
              ]),
            );
      }

      // add reference
      const accountPolicies: Record<string, string[]> = {};
      const accountPermissionSets: Record<string, string[]> = {};
      const groupAccountPermissionSetPolicies: Record<
        string,
        Record<string, Record<string, string[]>>
      > = {};
      const permissionSetAccounts: Record<string, string[]> = {};

      for (const [group, { account_permission_sets }] of _.entries(
        data.sso.groups,
      ))
        if (account_permission_sets)
          for (const [account, permissionSets] of _.entries(
            account_permission_sets as Record<string, string[]>,
          ))
            for (const permissionSet of permissionSets)
              for (const policy of _.values(
                data.sso.permission_sets?.[permissionSet].policies,
              ))
                if (_.keys(data.sso.policies).includes(policy)) {
                  _.set(accountPolicies, account, [
                    ...new Set([
                      ...((_.get(accountPolicies, account) as
                        | string[]
                        | undefined) ?? []),
                      policy,
                    ]),
                  ]);

                  _.set(accountPermissionSets, account, [
                    ...new Set([
                      ...((_.get(accountPermissionSets, account) as
                        | string[]
                        | undefined) ?? []),
                      permissionSet,
                    ]),
                  ]);

                  _.set(
                    groupAccountPermissionSetPolicies,
                    [group, account, permissionSet],
                    [
                      ...new Set([
                        ...((_.get(accountPolicies, [
                          group,
                          account,
                          permissionSet,
                        ]) as string[] | undefined) ?? []),
                        policy,
                      ]),
                    ],
                  );

                  _.set(permissionSetAccounts, permissionSet, [
                    ...new Set([
                      ...((_.get(permissionSetAccounts, permissionSet) as
                        | string[]
                        | undefined) ?? []),
                      account,
                    ]),
                  ]);
                }

      // add policy_accounts
      const policyAccounts: Record<string, string[]> = {};

      for (const [account, policies] of _.entries(accountPolicies))
        for (const policy of policies)
          policyAccounts[policy] = [
            ...new Set([...(policyAccounts[policy] ?? []), account]),
          ];

      data.sso.reference = {
        account_permission_sets: accountPermissionSets,
        account_policies: accountPolicies,
        group_account_permission_set_policies:
          groupAccountPermissionSetPolicies,
        permission_set_accounts: permissionSetAccounts,
        policy_accounts: policyAccounts,
      };
    }

    // expand terraform.paths
    data.terraform.paths = _.castArray(data.terraform.paths);

    return data;
  });

export type Config = z.infer<typeof configSchema>;
