import _ from 'lodash';
import { z } from 'zod';

const actionEnum = z.enum(['destroy', 'import', 'remove']);
type Action = z.infer<typeof actionEnum>;

const actionableSchema = z.object({
  action: actionEnum.optional(),
  id: z.string().optional(),
});

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
    accounts: z
      .record(
        actionableSchema
          .extend({
            email: z.string(),
            name: z.string(),
            organizational_unit: z.string().optional(),
          })
          .strict(),
      )
      .optional(),
    batches: z
      .record(
        z
          .object({
            generators: z.record(z.string()).optional(),
            path: z.string(),
          })
          .strict(),
      )
      .optional(),
    configPath: z.string().optional(),
    environments: z
      .record(
        z
          .object({
            account: z.string(),
            cognito_user_pool_name: z.string(),
            gha_on_push_branches: z.string().optional(),
          })
          .strict(),
      )
      .optional(),
    organization: z
      .object({
        aws_region: z.string(),
        github_org: z.string(),
        id: z.string(),
        master_account: z.string(),
        namespace: z.string().optional(),
      })
      .strict(),
    organizational_units: z
      .record(
        actionableSchema
          .extend({
            name: z.string(),
            parent: z.string().optional(),
          })
          .strict(),
      )
      .optional(),
    sso: z
      .object({
        groups: z
          .record(
            z.object({
              description: z.string().optional(),
              account_permission_sets: z
                .string()
                .or(z.string().array())
                .or(z.record(z.string().or(z.string().array())))
                .optional(),
            }),
          )
          .optional(),
        permission_sets: z
          .record(
            z.object({
              description: z.string().optional(),
              policies: z.string().or(z.string().array()).optional(),
            }),
          )
          .optional(),
        policy_documents: z.record(z.string()).optional(),
      })
      .optional(),
    terraform: z
      .object({
        aws_profile: z.string().optional(),
        aws_version: z.string(),
        paths: z.string().or(z.string().array()),
        roles: z.object({
          admin: z.string(),
          deployment: z.string(),
          reader: z.string(),
        }),
        state_account: z.string(),
        state_bucket: z.string(),
        state_key: z.string(),
        state_lock_table: z.string(),
        terraform_version: z.string(),
      })
      .strict(),
  })
  .strict()
  .superRefine((data, ctx) => {
    const validAccounts = filterValid(data.accounts);
    const validOus = filterValid(data.organizational_units);

    // validate accounts
    for (const account in data.accounts) {
      // TODO: validate email uniqueness within account

      // validate account
      const { action, id } = data.accounts[account];
      if (action && !id)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `id required when action populated`,
          path: ['accounts', account, 'id'],
        });

      // validate organizational_unit
      const ou = data.accounts[account].organizational_unit;

      if (ou && !validOus.includes(ou)) {
        const action = data.organizational_units?.[ou]?.action;

        ctx.addIssue({
          code: z.ZodIssueCode.invalid_enum_value,
          message: `${actionErrorModifier(action)} organizational_unit`,
          options: validOus,
          path: ['accounts', account, 'organizational_unit'],
          received: ou,
        });
      }
    }

    // validate environments
    for (const environment in data.environments) {
      // validate account
      const account = data.environments[environment].account;
      if (data.accounts && !validAccounts.includes(account)) {
        const action = data.accounts[account]?.action; // eslint-disable-line @typescript-eslint/no-unnecessary-condition

        ctx.addIssue({
          code: z.ZodIssueCode.invalid_enum_value,
          message: `${actionErrorModifier(action)} account`,
          options: validAccounts,
          path: ['environments', environment, 'account'],
          received: account,
        });
      }
    }

    // validate organization.master_account
    if (
      data.accounts &&
      !validAccounts.includes(data.organization.master_account)
    ) {
      const action = data.accounts[data.organization.master_account]?.action; // eslint-disable-line @typescript-eslint/no-unnecessary-condition

      ctx.addIssue({
        code: z.ZodIssueCode.invalid_enum_value,
        message: `${actionErrorModifier(action)} account`,
        options: validAccounts,
        path: ['organization', 'master_account'],
        received: data.organization.master_account,
      });
    }

    // validate organizational_units
    for (const ou in data.organizational_units) {
      // TODO: validate circular dependencies
      // TODO: validate name uniqueness within parent

      // validate organizational_unit
      const { action, id } = data.organizational_units[ou];
      if (action && !id)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `id required when action populated`,
          path: ['organizational_units', ou, 'id'],
        });

      // validate parent
      const parent = data.organizational_units[ou].parent;
      if (parent && !validOus.includes(parent)) {
        const action = data.organizational_units[parent]?.action; // eslint-disable-line @typescript-eslint/no-unnecessary-condition

        ctx.addIssue({
          code: z.ZodIssueCode.invalid_enum_value,
          message: `${actionErrorModifier(action)} parent`,
          options: validOus,
          path: ['organizational_units', ou, 'parent'],
          received: parent,
        });
      }
    }

    // validate terraform.state_account
    if (
      data.accounts &&
      !validAccounts.includes(data.terraform.state_account)
    ) {
      const action = data.accounts[data.terraform.state_account]?.action; // eslint-disable-line @typescript-eslint/no-unnecessary-condition

      ctx.addIssue({
        code: z.ZodIssueCode.invalid_enum_value,
        message: `${actionErrorModifier(action)} account`,
        options: validAccounts,
        path: ['terraform', 'state_account'],
        received: data.terraform.state_account,
      });
    }
  });

export type Config = z.infer<typeof configSchema>;
