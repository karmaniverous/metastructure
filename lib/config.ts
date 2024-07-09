import { z } from 'zod';

export const ConfigSchema = z
  .object({
    accounts: z.record(
      z
        .object({
          name: z.string(),
          email: z.string(),
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
        aws_profile: z.string(),
        aws_region: z.string(),
        backend_bucket: z.string(),
        backend_key: z.string(),
        backend_table: z.string(),
        github_org: z.string(),
        master_account: z.string(),
        namespace: z.string(),
      })
      .strict(),
    organizational_units: z.record(
      z
        .object({
          name: z.string(),
        })
        .strict(),
    ),
  })
  .strict()
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
          options: Object.keys(data.organizational_units),
          path: ['accounts', account, 'organizational_unit'],
          received: data.accounts[account].organizational_unit,
        });
  })
  // validate environment.account
  .superRefine((data, ctx) => {
    for (const environment in data.environments)
      if (!(data.environments[environment].account in data.accounts))
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_enum_value,
          message: `invalid account`,
          options: Object.keys(data.accounts),
          path: ['environments', environment, 'account'],
          received: data.environments[environment].account,
        });
  })
  // validate organization.master_account
  .superRefine((data, ctx) => {
    if (!(data.organization.master_account in data.accounts))
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_enum_value,
        message: `invalid account`,
        options: Object.keys(data.accounts),
        path: ['organization', 'master_account'],
        received: data.organization.master_account,
      });
  });

export type Config = z.infer<typeof ConfigSchema>;
