import _ from 'lodash';
import { z } from 'zod';

export const ConfigSchema = z
  .object({
    accounts: z.record(
      z
        .object({
          destroy: z.boolean().optional(),
          email: z.string(),
          id: z.string().optional(),
          name: z.string(),
          organizational_unit: z.string().optional(),
        })
        .strict(),
    ),
    environments: z.record(
      z
        .object({
          account: z.string(),
          cognito_user_pool_name: z.string(),
          gha_on_push_branches: z.string().optional(),
        })
        .strict(),
    ),
    organization: z
      .object({
        aws_region: z.string(),
        github_org: z.string(),
        id: z.string().optional(),
        master_account: z.string(),
        namespace: z.string().optional(),
      })
      .strict(),
    organizational_units: z.record(
      z
        .object({
          id: z.string().optional(),
          name: z.string(),
          parent: z.string().optional(),
        })
        .strict(),
    ),
    targets: z
      .record(
        z
          .object({
            config: z.record(z.unknown()).optional(),
            template: z.string(),
          })
          .strict(),
      )
      .optional(),
    templates_path: z.string().optional(),
    terraform: z
      .object({
        admin_role: z.string(),
        aws_profile: z.string().optional(),
        aws_version: z.string(),
        deployment_role: z.string(),
        deployment_delegator_role: z.string(),
        reader_role: z.string(),
        state_account: z.string(),
        state_bucket: z.string(),
        state_key: z.string(),
        state_table: z.string(),
        terraform_version: z.string(),
      })
      .strict(),
  })
  .strict()
  // TODO: validate account email uniqueness
  // validate account.organizational_unit
  .superRefine((data, ctx) => {
    for (const account in data.accounts)
      if (
        data.accounts[account].organizational_unit &&
        !(
          data.accounts[account].organizational_unit in
          data.organizational_units
        )
      )
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_enum_value,
          message: `invalid organizational_unit`,
          options: _.keys(data.organizational_units),
          path: ['accounts', account, 'organizational_unit'],
          received: data.accounts[account].organizational_unit,
        });
  })
  // validate environment.account
  // TODO: can't be a destroyed account
  .superRefine((data, ctx) => {
    for (const environment in data.environments)
      if (!(data.environments[environment].account in data.accounts))
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_enum_value,
          message: `invalid account`,
          options: _.keys(data.accounts),
          path: ['environments', environment, 'account'],
          received: data.environments[environment].account,
        });
  })
  // validate organization.master_account
  // TODO: can't be a destroyed account
  .superRefine((data, ctx) => {
    if (!(data.organization.master_account in data.accounts))
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_enum_value,
        message: `invalid account`,
        options: _.keys(data.accounts),
        path: ['organization', 'master_account'],
        received: data.organization.master_account,
      });
  })
  // validate organizational_unit.parent
  // TODO: validate circular dependencies
  // TODO: validate name uniqueness within parent
  .superRefine((data, ctx) => {
    for (const organizational_unit in data.organizational_units) {
      const parent = data.organizational_units[organizational_unit].parent;

      if (
        parent &&
        (parent === organizational_unit ||
          !(parent in data.organizational_units))
      )
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_enum_value,
          message: `invalid organizational_unit parent`,
          options: _.without(
            _.keys(data.organizational_units),
            organizational_unit,
          ),
          path: ['organizational_units', organizational_unit, 'parent'],
          received: parent,
        });
    }
  })
  // validate terraform.state_account
  // TODO: can't be a destroyed account
  .superRefine((data, ctx) => {
    if (!(data.terraform.state_account in data.accounts))
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_enum_value,
        message: `invalid account`,
        options: _.keys(data.accounts),
        path: ['terraform', 'state_account'],
        received: data.terraform.state_account,
      });
  })
  // validate templates_path
  .superRefine((data, ctx) => {
    if (data.targets && !data.templates_path)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `targets defined but missing templates_path`,
        path: ['templates_path'],
      });
  });

export type Config = z.infer<typeof ConfigSchema>;
