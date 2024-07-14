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
# Import master account.
###############################################################################
import {
  to = aws_organizations_account.accounts["master"]
  id = data.aws_caller_identity.current.account_id
}


###############################################################################
# Create a Terraform deployment role on the Core Development Account
# and allow it to be assumed from the Terraform deployment delegator role at
# the Terraform state account.
###############################################################################
module "dev_terraform_deployment_role" {
  source = "../../modules/delegated-role"
  providers = {
    aws = aws.dev
  }
  delegated_policy_arns = ["arn:aws:iam::aws:policy/AdministratorAccess"]
  delegator_principals  = ["${aws_organizations_account.accounts["shared_services"].id}"]
  delegated_role_name   = module.global.config.terraform.deployment_role
}


###############################################################################
# Create a Terraform deployment role on the Second Development Account
# and allow it to be assumed from the Terraform deployment delegator role at
# the Terraform state account.
###############################################################################
module "dev2_terraform_deployment_role" {
  source = "../../modules/delegated-role"
  providers = {
    aws = aws.dev2
  }
  delegated_policy_arns = ["arn:aws:iam::aws:policy/AdministratorAccess"]
  delegator_principals  = ["${aws_organizations_account.accounts["shared_services"].id}"]
  delegated_role_name   = module.global.config.terraform.deployment_role
}


###############################################################################
# Create a Terraform deployment role on the Identity Account
# and allow it to be assumed from the Terraform deployment delegator role at
# the Terraform state account.
###############################################################################
module "identity_terraform_deployment_role" {
  source = "../../modules/delegated-role"
  providers = {
    aws = aws.identity
  }
  delegated_policy_arns = ["arn:aws:iam::aws:policy/AdministratorAccess"]
  delegator_principals  = ["${aws_organizations_account.accounts["shared_services"].id}"]
  delegated_role_name   = module.global.config.terraform.deployment_role
}


###############################################################################
# Create a Terraform deployment role on the Log Archive Account
# and allow it to be assumed from the Terraform deployment delegator role at
# the Terraform state account.
###############################################################################
module "log_archive_terraform_deployment_role" {
  source = "../../modules/delegated-role"
  providers = {
    aws = aws.log_archive
  }
  delegated_policy_arns = ["arn:aws:iam::aws:policy/AdministratorAccess"]
  delegator_principals  = ["${aws_organizations_account.accounts["shared_services"].id}"]
  delegated_role_name   = module.global.config.terraform.deployment_role
}


###############################################################################
# Create a Terraform deployment role on the Master Account
# and allow it to be assumed from the Terraform deployment delegator role at
# the Terraform state account.
###############################################################################
module "master_terraform_deployment_role" {
  source = "../../modules/delegated-role"
  providers = {
    aws = aws.master
  }
  delegated_policy_arns = ["arn:aws:iam::aws:policy/AdministratorAccess"]
  delegator_principals  = ["${aws_organizations_account.accounts["shared_services"].id}"]
  delegated_role_name   = module.global.config.terraform.deployment_role
}


###############################################################################
# Create a Terraform deployment role on the Core Production Account
# and allow it to be assumed from the Terraform deployment delegator role at
# the Terraform state account.
###############################################################################
module "prod_terraform_deployment_role" {
  source = "../../modules/delegated-role"
  providers = {
    aws = aws.prod
  }
  delegated_policy_arns = ["arn:aws:iam::aws:policy/AdministratorAccess"]
  delegator_principals  = ["${aws_organizations_account.accounts["shared_services"].id}"]
  delegated_role_name   = module.global.config.terraform.deployment_role
}


###############################################################################
# Create a Terraform deployment role on the Core Shared Services Account
# and allow it to be assumed from the Terraform deployment delegator role at
# the Terraform state account.
###############################################################################
module "shared_services_terraform_deployment_role" {
  source = "../../modules/delegated-role"
  providers = {
    aws = aws.shared_services
  }
  delegated_policy_arns = ["arn:aws:iam::aws:policy/AdministratorAccess"]
  delegator_principals  = ["${aws_organizations_account.accounts["shared_services"].id}"]
  delegated_role_name   = module.global.config.terraform.deployment_role
}


###############################################################################
# Create a Terraform deployment role on the Core Test Account
# and allow it to be assumed from the Terraform deployment delegator role at
# the Terraform state account.
###############################################################################
module "test_terraform_deployment_role" {
  source = "../../modules/delegated-role"
  providers = {
    aws = aws.test
  }
  delegated_policy_arns = ["arn:aws:iam::aws:policy/AdministratorAccess"]
  delegator_principals  = ["${aws_organizations_account.accounts["shared_services"].id}"]
  delegated_role_name   = module.global.config.terraform.deployment_role
}


