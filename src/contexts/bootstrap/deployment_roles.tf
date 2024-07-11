/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

###############################################################################
###############################################################################
####                                                                       ####
####              THIS FILE WAS GENERATED WITH nr cli config               ####
####                       DO NOT EDIT IT MANUALLY!                        ####
####                                                                       ####
###############################################################################
###############################################################################

###############################################################################
# Create a provider to assume the OrganizationAccountAccessRole role on the 
# Core Development Account.
###############################################################################
provider "aws" {
  alias = "dev"
  assume_role {
    role_arn = "arn:aws:iam::${aws_organizations_account.accounts["dev"].id}:role/OrganizationAccountAccessRole"
  }
  profile = "KARMA-INIT"
  region  = module.global.config.organization.aws_region
}

###############################################################################
# Create a delegated role for Terraform deployment on the Core Development Account
# and allow it to be assumed from the Terraform state account.
###############################################################################
module "dev_terraform_deployment_delegated_role" {
  source = "../../modules/delegated-role"
  providers = {
    aws = aws.dev
  }
  delegated_policy_arns  = ["arn:aws:iam::aws:policy/AdministratorAccess"]
  delegator_account_id   = aws_organizations_account.accounts["shared_services"].id
  delegator_account_name = "shared_services"
  delegated_role_name    = module.global.config.terraform.deployment_delegated_role
}

###############################################################################
# Create a delegator role on the Terraform state account and allow it to assume 
# the Terraform deployment role on the Core Development Account.
###############################################################################
module "dev_terraform_deployment_delegator_role" {
  source = "../../modules/delegator-role"
  providers = {
    aws = aws.shared_services
  }
  delegate_account_id   = aws_organizations_account.accounts["dev"].id
  delegate_account_name = aws_organizations_account.accounts["dev"].name
  delegated_role_name   = module.global.config.terraform.deployment_delegated_role
  delegator_role_name   = module.global.config.terraform.deployment_delegator_role
}

###############################################################################
# Create a provider to assume the OrganizationAccountAccessRole role on the 
# Identity Account.
###############################################################################
provider "aws" {
  alias = "identity"
  assume_role {
    role_arn = "arn:aws:iam::${aws_organizations_account.accounts["identity"].id}:role/OrganizationAccountAccessRole"
  }
  profile = "KARMA-INIT"
  region  = module.global.config.organization.aws_region
}

###############################################################################
# Create a delegated role for Terraform deployment on the Identity Account
# and allow it to be assumed from the Terraform state account.
###############################################################################
module "identity_terraform_deployment_delegated_role" {
  source = "../../modules/delegated-role"
  providers = {
    aws = aws.identity
  }
  delegated_policy_arns  = ["arn:aws:iam::aws:policy/AdministratorAccess"]
  delegator_account_id   = aws_organizations_account.accounts["shared_services"].id
  delegator_account_name = "shared_services"
  delegated_role_name    = module.global.config.terraform.deployment_delegated_role
}

###############################################################################
# Create a delegator role on the Terraform state account and allow it to assume 
# the Terraform deployment role on the Identity Account.
###############################################################################
module "identity_terraform_deployment_delegator_role" {
  source = "../../modules/delegator-role"
  providers = {
    aws = aws.shared_services
  }
  delegate_account_id   = aws_organizations_account.accounts["identity"].id
  delegate_account_name = aws_organizations_account.accounts["identity"].name
  delegated_role_name   = module.global.config.terraform.deployment_delegated_role
  delegator_role_name   = module.global.config.terraform.deployment_delegator_role
}

###############################################################################
# Create a provider to assume the OrganizationAccountAccessRole role on the 
# Log Archive Account.
###############################################################################
provider "aws" {
  alias = "log_archive"
  assume_role {
    role_arn = "arn:aws:iam::${aws_organizations_account.accounts["log_archive"].id}:role/OrganizationAccountAccessRole"
  }
  profile = "KARMA-INIT"
  region  = module.global.config.organization.aws_region
}

###############################################################################
# Create a delegated role for Terraform deployment on the Log Archive Account
# and allow it to be assumed from the Terraform state account.
###############################################################################
module "log_archive_terraform_deployment_delegated_role" {
  source = "../../modules/delegated-role"
  providers = {
    aws = aws.log_archive
  }
  delegated_policy_arns  = ["arn:aws:iam::aws:policy/AdministratorAccess"]
  delegator_account_id   = aws_organizations_account.accounts["shared_services"].id
  delegator_account_name = "shared_services"
  delegated_role_name    = module.global.config.terraform.deployment_delegated_role
}

###############################################################################
# Create a delegator role on the Terraform state account and allow it to assume 
# the Terraform deployment role on the Log Archive Account.
###############################################################################
module "log_archive_terraform_deployment_delegator_role" {
  source = "../../modules/delegator-role"
  providers = {
    aws = aws.shared_services
  }
  delegate_account_id   = aws_organizations_account.accounts["log_archive"].id
  delegate_account_name = aws_organizations_account.accounts["log_archive"].name
  delegated_role_name   = module.global.config.terraform.deployment_delegated_role
  delegator_role_name   = module.global.config.terraform.deployment_delegator_role
}

###############################################################################
# Create a provider to assume the OrganizationAccountAccessRole role on the 
# Core Production Account.
###############################################################################
provider "aws" {
  alias = "prod"
  assume_role {
    role_arn = "arn:aws:iam::${aws_organizations_account.accounts["prod"].id}:role/OrganizationAccountAccessRole"
  }
  profile = "KARMA-INIT"
  region  = module.global.config.organization.aws_region
}

###############################################################################
# Create a delegated role for Terraform deployment on the Core Production Account
# and allow it to be assumed from the Terraform state account.
###############################################################################
module "prod_terraform_deployment_delegated_role" {
  source = "../../modules/delegated-role"
  providers = {
    aws = aws.prod
  }
  delegated_policy_arns  = ["arn:aws:iam::aws:policy/AdministratorAccess"]
  delegator_account_id   = aws_organizations_account.accounts["shared_services"].id
  delegator_account_name = "shared_services"
  delegated_role_name    = module.global.config.terraform.deployment_delegated_role
}

###############################################################################
# Create a delegator role on the Terraform state account and allow it to assume 
# the Terraform deployment role on the Core Production Account.
###############################################################################
module "prod_terraform_deployment_delegator_role" {
  source = "../../modules/delegator-role"
  providers = {
    aws = aws.shared_services
  }
  delegate_account_id   = aws_organizations_account.accounts["prod"].id
  delegate_account_name = aws_organizations_account.accounts["prod"].name
  delegated_role_name   = module.global.config.terraform.deployment_delegated_role
  delegator_role_name   = module.global.config.terraform.deployment_delegator_role
}

###############################################################################
# Create a provider to assume the OrganizationAccountAccessRole role on the 
# Core Shared Services Account.
###############################################################################
provider "aws" {
  alias = "shared_services"
  assume_role {
    role_arn = "arn:aws:iam::${aws_organizations_account.accounts["shared_services"].id}:role/OrganizationAccountAccessRole"
  }
  profile = "KARMA-INIT"
  region  = module.global.config.organization.aws_region
}

###############################################################################
# Create a delegated role for Terraform deployment on the Core Shared Services Account
# and allow it to be assumed from the Terraform state account.
###############################################################################
module "shared_services_terraform_deployment_delegated_role" {
  source = "../../modules/delegated-role"
  providers = {
    aws = aws.shared_services
  }
  delegated_policy_arns  = ["arn:aws:iam::aws:policy/AdministratorAccess"]
  delegator_account_id   = aws_organizations_account.accounts["shared_services"].id
  delegator_account_name = "shared_services"
  delegated_role_name    = module.global.config.terraform.deployment_delegated_role
}

###############################################################################
# Create a delegator role on the Terraform state account and allow it to assume 
# the Terraform deployment role on the Core Shared Services Account.
###############################################################################
module "shared_services_terraform_deployment_delegator_role" {
  source = "../../modules/delegator-role"
  providers = {
    aws = aws.shared_services
  }
  delegate_account_id   = aws_organizations_account.accounts["shared_services"].id
  delegate_account_name = aws_organizations_account.accounts["shared_services"].name
  delegated_role_name   = module.global.config.terraform.deployment_delegated_role
  delegator_role_name   = module.global.config.terraform.deployment_delegator_role
}

###############################################################################
# Create a provider to assume the OrganizationAccountAccessRole role on the 
# Core Test Account.
###############################################################################
provider "aws" {
  alias = "test"
  assume_role {
    role_arn = "arn:aws:iam::${aws_organizations_account.accounts["test"].id}:role/OrganizationAccountAccessRole"
  }
  profile = "KARMA-INIT"
  region  = module.global.config.organization.aws_region
}

###############################################################################
# Create a delegated role for Terraform deployment on the Core Test Account
# and allow it to be assumed from the Terraform state account.
###############################################################################
module "test_terraform_deployment_delegated_role" {
  source = "../../modules/delegated-role"
  providers = {
    aws = aws.test
  }
  delegated_policy_arns  = ["arn:aws:iam::aws:policy/AdministratorAccess"]
  delegator_account_id   = aws_organizations_account.accounts["shared_services"].id
  delegator_account_name = "shared_services"
  delegated_role_name    = module.global.config.terraform.deployment_delegated_role
}

###############################################################################
# Create a delegator role on the Terraform state account and allow it to assume 
# the Terraform deployment role on the Core Test Account.
###############################################################################
module "test_terraform_deployment_delegator_role" {
  source = "../../modules/delegator-role"
  providers = {
    aws = aws.shared_services
  }
  delegate_account_id   = aws_organizations_account.accounts["test"].id
  delegate_account_name = aws_organizations_account.accounts["test"].name
  delegated_role_name   = module.global.config.terraform.deployment_delegated_role
  delegator_role_name   = module.global.config.terraform.deployment_delegator_role
}

