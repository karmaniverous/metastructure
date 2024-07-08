import { z } from 'zod';

export const ConfigSchema = z
  .object({
    app_environments: z.record(
      z.object({
        aws_account: z.string(),
        gha_on_push_branches: z.string().optional(),
      }),
    ),
    aws_accounts: z.record(
      z.object({
        id: z.string(),
      }),
    ),
    github_org: z.string(),
    master_aws_account: z.string(),
    terraform: z.object({
      aws_profile: z.string(),
      aws_region: z.string(),
      backend_bucket: z.string(),
      backend_table: z.string(),
      namespace: z.string().optional(),
    }),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (!(data.master_aws_account in data.aws_accounts))
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_enum_value,
        message: `invalid aws account key`,
        options: Object.keys(data.aws_accounts),
        path: ['master_aws_account'],
        received: data.master_aws_account,
      });
  })
  .superRefine((data, ctx) => {
    for (const env in data.app_environments)
      if (!(data.app_environments[env].aws_account in data.aws_accounts))
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_enum_value,
          message: `invalid aws account key`,
          options: Object.keys(data.aws_accounts),
          path: ['app_environments', env, 'aws_account'],
          received: data.master_aws_account,
        });
  });

export type Config = z.infer<typeof ConfigSchema>;
