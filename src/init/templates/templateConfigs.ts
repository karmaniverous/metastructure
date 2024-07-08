export interface TemplateConfig {
  context?: string;
  path: string;
  template: string;
}

const templateConfigs: TemplateConfig[] = [
  {
    context: 'acct',
    path: 'infrastructure/acct/backend_override.tf',
    template: 'terraform_backend_override.hbs',
  },
  {
    context: 'env',
    path: 'infrastructure/env/backend_override.tf',
    template: 'terraform_backend_override.hbs',
  },
  {
    context: 'acct',
    path: 'infrastructure/acct/providers_override.tf',
    template: 'terraform_providers_override.hbs',
  },
  {
    context: 'env',
    path: 'infrastructure/env/providers_override.tf',
    template: 'terraform_providers_override.hbs',
  },
  {
    path: 'infrastructure/globals/outputs.tf',
    template: 'terraform_globals_outputs.hbs',
  },
  {
    path: '.github/workflows/scan.yml',
    template: 'github_workflow_scan.hbs',
  },
];

export default templateConfigs;
