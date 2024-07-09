export interface TemplateConfig {
  context?: string;
  path: string;
  template: string;
}

const templateConfigs: TemplateConfig[] = [
  {
    context: 'acct',
    path: 'iac/contexts/acct/backend_override.tf',
    template: 'terraform_backend_override.hbs',
  },
  {
    context: 'env',
    path: 'iac/contexts/env/backend_override.tf',
    template: 'terraform_backend_override.hbs',
  },
  {
    context: 'acct',
    path: 'iac/contexts/acct/providers_override.tf',
    template: 'terraform_providers_override.hbs',
  },
  {
    context: 'env',
    path: 'iac/contexts/env/providers_override.tf',
    template: 'terraform_providers_override.hbs',
  },
  {
    path: 'iac/modules/globals/outputs.tf',
    template: 'terraform_globals_outputs.hbs',
  },
];

export default templateConfigs;
