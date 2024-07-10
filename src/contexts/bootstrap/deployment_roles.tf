/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

###############################################################################
# This file is generated via `nr cli config`. Do not edit it manually!
###############################################################################

###############################################################################
# Create a provider to assume the OrganizationAccountAccessRole role on the 
# Core Development Account.
###############################################################################
provider "aws" {
  alias = "assume_dev"

  assume_role {
    role_arn = "arn:aws:iam::${aws_organizations_account.accounts.dev.id}:role/OrganizationAccountAccessRole"
  }

  region = module.global.config.organization.aws_region
}

###############################################################################
# Create a Terraform deployment role based on the Core Development Account
# and allow it to be assumed by the Terraform state account.
###############################################################################
module "shared_services_assume_dev_terraform_deployment_role" {
  source = "../../modules/cross-account-role"
  providers = {
    aws = aws.assume_dev
  }
  assume_role_policy_json = data.aws_iam_policy_document.crossaccount_assume_from_terraform_state_account.json
  role_name               = module.global.config.terraform.deployment_role
  role_policy_arn         = "arn:aws:iam::aws:policy/AdministratorAccess"
}

###############################################################################
# Create a provider to assume the OrganizationAccountAccessRole role on the 
# Identity Account.
###############################################################################
provider "aws" {
  alias = "assume_identity"

  assume_role {
    role_arn = "arn:aws:iam::${aws_organizations_account.accounts.identity.id}:role/OrganizationAccountAccessRole"
  }

  region = module.global.config.organization.aws_region
}

###############################################################################
# Create a Terraform deployment role based on the Identity Account
# and allow it to be assumed by the Terraform state account.
###############################################################################
module "shared_services_assume_identity_terraform_deployment_role" {
  source = "../../modules/cross-account-role"
  providers = {
    aws = aws.assume_identity
  }
  assume_role_policy_json = data.aws_iam_policy_document.crossaccount_assume_from_terraform_state_account.json
  role_name               = module.global.config.terraform.deployment_role
  role_policy_arn         = "arn:aws:iam::aws:policy/AdministratorAccess"
}

###############################################################################
# Create a provider to assume the OrganizationAccountAccessRole role on the 
# Log Archive Account.
###############################################################################
provider "aws" {
  alias = "assume_log_archive"

  assume_role {
    role_arn = "arn:aws:iam::${aws_organizations_account.accounts.log_archive.id}:role/OrganizationAccountAccessRole"
  }

  region = module.global.config.organization.aws_region
}

###############################################################################
# Create a Terraform deployment role based on the Log Archive Account
# and allow it to be assumed by the Terraform state account.
###############################################################################
module "shared_services_assume_log_archive_terraform_deployment_role" {
  source = "../../modules/cross-account-role"
  providers = {
    aws = aws.assume_log_archive
  }
  assume_role_policy_json = data.aws_iam_policy_document.crossaccount_assume_from_terraform_state_account.json
  role_name               = module.global.config.terraform.deployment_role
  role_policy_arn         = "arn:aws:iam::aws:policy/AdministratorAccess"
}

###############################################################################
# Create a provider to assume the OrganizationAccountAccessRole role on the 
# Core Production Account.
###############################################################################
provider "aws" {
  alias = "assume_prod"

  assume_role {
    role_arn = "arn:aws:iam::${aws_organizations_account.accounts.prod.id}:role/OrganizationAccountAccessRole"
  }

  region = module.global.config.organization.aws_region
}

###############################################################################
# Create a Terraform deployment role based on the Core Production Account
# and allow it to be assumed by the Terraform state account.
###############################################################################
module "shared_services_assume_prod_terraform_deployment_role" {
  source = "../../modules/cross-account-role"
  providers = {
    aws = aws.assume_prod
  }
  assume_role_policy_json = data.aws_iam_policy_document.crossaccount_assume_from_terraform_state_account.json
  role_name               = module.global.config.terraform.deployment_role
  role_policy_arn         = "arn:aws:iam::aws:policy/AdministratorAccess"
}

###############################################################################
# Create a provider to assume the OrganizationAccountAccessRole role on the 
# Core Shared Services Account.
###############################################################################
provider "aws" {
  alias = "assume_shared_services"

  assume_role {
    role_arn = "arn:aws:iam::${aws_organizations_account.accounts.shared_services.id}:role/OrganizationAccountAccessRole"
  }

  region = module.global.config.organization.aws_region
}

###############################################################################
# Create a Terraform deployment role based on the Core Shared Services Account
# and allow it to be assumed by the Terraform state account.
###############################################################################
module "shared_services_assume_shared_services_terraform_deployment_role" {
  source = "../../modules/cross-account-role"
  providers = {
    aws = aws.assume_shared_services
  }
  assume_role_policy_json = data.aws_iam_policy_document.crossaccount_assume_from_terraform_state_account.json
  role_name               = module.global.config.terraform.deployment_role
  role_policy_arn         = "arn:aws:iam::aws:policy/AdministratorAccess"
}

###############################################################################
# Create a provider to assume the OrganizationAccountAccessRole role on the 
# Core Test Account.
###############################################################################
provider "aws" {
  alias = "assume_test"

  assume_role {
    role_arn = "arn:aws:iam::${aws_organizations_account.accounts.test.id}:role/OrganizationAccountAccessRole"
  }

  region = module.global.config.organization.aws_region
}

###############################################################################
# Create a Terraform deployment role based on the Core Test Account
# and allow it to be assumed by the Terraform state account.
###############################################################################
module "shared_services_assume_test_terraform_deployment_role" {
  source = "../../modules/cross-account-role"
  providers = {
    aws = aws.assume_test
  }
  assume_role_policy_json = data.aws_iam_policy_document.crossaccount_assume_from_terraform_state_account.json
  role_name               = module.global.config.terraform.deployment_role
  role_policy_arn         = "arn:aws:iam::aws:policy/AdministratorAccess"
}

