/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

###############################################################################
###############################################################################
####                                                                       ####
####              THIS FILE WAS GENERATED WITH METASTRUCTURE               ####
####                       DO NOT EDIT IT MANUALLY!                        ####
####                                                                       ####
###############################################################################
###############################################################################

###############################################################################
# Create a Terraform deployment role at account "Development Account"
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
# Create a Terraform deployment role at account "Production Account"
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
# Create a Terraform deployment role at account "Testing Account"
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
###############################################################################
# Create a Terraform deployment role at account "Shared Services Account"
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

