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
# Create a Terraform deployment role at account "Core Development Account"
# and allow it to be assumed from the master account.
###############################################################################
module "terraform_deployment_role_dev" {
  source = "../modules/delegated-role"
  providers = {
    aws = aws.dev
  }
  delegated_policy_arns = ["arn:aws:iam::aws:policy/AdministratorAccess"]
  delegator_principals  = ["${aws_organizations_account.accounts["master"].id}"]
  delegated_role_name   = module.global.config.terraform.roles.deployment
}
###############################################################################
# Create a Terraform deployment role at account "Second Development Account"
# and allow it to be assumed from the master account.
###############################################################################
module "terraform_deployment_role_dev2" {
  source = "../modules/delegated-role"
  providers = {
    aws = aws.dev2
  }
  delegated_policy_arns = ["arn:aws:iam::aws:policy/AdministratorAccess"]
  delegator_principals  = ["${aws_organizations_account.accounts["master"].id}"]
  delegated_role_name   = module.global.config.terraform.roles.deployment
}
###############################################################################
# Create a Terraform deployment role at account "Identity Account"
# and allow it to be assumed from the master account.
###############################################################################
module "terraform_deployment_role_identity" {
  source = "../modules/delegated-role"
  providers = {
    aws = aws.identity
  }
  delegated_policy_arns = ["arn:aws:iam::aws:policy/AdministratorAccess"]
  delegator_principals  = ["${aws_organizations_account.accounts["master"].id}"]
  delegated_role_name   = module.global.config.terraform.roles.deployment
}
###############################################################################
# Create a Terraform deployment role at account "Log Archive Account"
# and allow it to be assumed from the master account.
###############################################################################
module "terraform_deployment_role_log_archive" {
  source = "../modules/delegated-role"
  providers = {
    aws = aws.log_archive
  }
  delegated_policy_arns = ["arn:aws:iam::aws:policy/AdministratorAccess"]
  delegator_principals  = ["${aws_organizations_account.accounts["master"].id}"]
  delegated_role_name   = module.global.config.terraform.roles.deployment
}
###############################################################################
# Create a Terraform deployment role at account "Master Account"
# and allow it to be assumed from the master account.
###############################################################################
module "terraform_deployment_role_master" {
  source = "../modules/delegated-role"
  providers = {
    aws = aws.master
  }
  delegated_policy_arns = ["arn:aws:iam::aws:policy/AdministratorAccess"]
  delegator_principals  = ["${aws_organizations_account.accounts["master"].id}"]
  delegated_role_name   = module.global.config.terraform.roles.deployment
}
###############################################################################
# Create a Terraform deployment role at account "Core Production Account"
# and allow it to be assumed from the master account.
###############################################################################
module "terraform_deployment_role_prod" {
  source = "../modules/delegated-role"
  providers = {
    aws = aws.prod
  }
  delegated_policy_arns = ["arn:aws:iam::aws:policy/AdministratorAccess"]
  delegator_principals  = ["${aws_organizations_account.accounts["master"].id}"]
  delegated_role_name   = module.global.config.terraform.roles.deployment
}
###############################################################################
# Create a Terraform deployment role at account "Core Shared Services Account"
# and allow it to be assumed from the master account.
###############################################################################
module "terraform_deployment_role_shared_services" {
  source = "../modules/delegated-role"
  providers = {
    aws = aws.shared_services
  }
  delegated_policy_arns = ["arn:aws:iam::aws:policy/AdministratorAccess"]
  delegator_principals  = ["${aws_organizations_account.accounts["master"].id}"]
  delegated_role_name   = module.global.config.terraform.roles.deployment
}
###############################################################################
# Create a Terraform deployment role at account "Core Test Account"
# and allow it to be assumed from the master account.
###############################################################################
module "terraform_deployment_role_test" {
  source = "../modules/delegated-role"
  providers = {
    aws = aws.test
  }
  delegated_policy_arns = ["arn:aws:iam::aws:policy/AdministratorAccess"]
  delegator_principals  = ["${aws_organizations_account.accounts["master"].id}"]
  delegated_role_name   = module.global.config.terraform.roles.deployment
}

