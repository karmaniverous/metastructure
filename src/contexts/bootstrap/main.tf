/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

###############################################################################
# Import global config.
###############################################################################
module "global" {
  source = "../../modules/global"
}

###############################################################################
# Get the currently running identity context.
###############################################################################
data "aws_caller_identity" "current" {}

###############################################################################
# Create a new organization.
###############################################################################
resource "aws_organizations_organization" "org" {
  aws_service_access_principals = [
    "cloudtrail.amazonaws.com",
    "sso.amazonaws.com"
  ]
  enabled_policy_types = ["SERVICE_CONTROL_POLICY"]
  feature_set          = "ALL"
  lifecycle {
    prevent_destroy = true
  }
}

###############################################################################
# Import organization.
###############################################################################
import {
  to = aws_organizations_organization.org
  id = module.global.config.organization.id
}

###############################################################################
# Create organizational units. 
###############################################################################
resource "aws_organizations_organizational_unit" "organizational_units" {
  for_each = local.organizational_units
  name     = each.value.name

  # Keeping the hierarchy flat for now. We'll connect them with their parents 
  # later.
  parent_id = aws_organizations_organization.org.roots[0].id
}

###############################################################################
# Import organizational units.
###############################################################################
import {
  for_each = local.organizational_units_to_import
  to       = aws_organizations_organizational_unit.organizational_units[each.key]
  id       = module.global.config.organizational_units[each.key].id
}

###############################################################################
# Create accounts.
###############################################################################
resource "aws_organizations_account" "accounts" {
  for_each = local.accounts
  email    = each.value.email
  lifecycle {
    ignore_changes = [email, name]
  }
  name      = each.value.name
  parent_id = contains(keys(each.value), "organizational_unit") ? aws_organizations_organizational_unit.organizational_units[each.value.organizational_unit].id : null
}

###############################################################################
# Import accounts.
###############################################################################
import {
  for_each = local.accounts_to_import
  to       = aws_organizations_account.accounts[each.key]
  id       = each.key == module.global.config.organization.master_account ? data.aws_caller_identity.current.account_id : module.global.config.accounts[each.key].id
}

###############################################################################
# Create a Terraform deployment policy at the master account to permit 
# assumption of the Terraform deployment role at all accounts.
###############################################################################
module "terraform_deployment_policy" {
  source = "../../modules/delegator-policy"
  delegated_roles = [for account in keys(local.accounts) : {
    delegate_account_id = aws_organizations_account.accounts[account].id
    delegated_role_name = module.global.config.terraform.roles.deployment
  }]
  delegator_policy_name = module.global.config.terraform.roles.deployment
}

###############################################################################
# Create a Terraform admin role at the Terraform state account and permit it to 
# be assumed from the master account and the init admin user.
###############################################################################
module "terraform_admin_role" {
  source = "../../modules/delegated-role"
  providers = {
    aws = aws.terraform_state_account
  }
  delegated_policy_arns = [aws_iam_policy.terraform_admin.arn]
  delegator_principals = [
    aws_organizations_account.accounts[module.global.config.organization.master_account].id,
    data.aws_caller_identity.current.arn
  ]
  delegated_role_name = module.global.config.terraform.roles.admin
}

###############################################################################
# Create a Terraform admin policy at the master account to permit 
# assumption of the Terraform admin role at the Terraform state account.
###############################################################################
module "terraform_admin_policy" {
  source = "../../modules/delegator-policy"
  delegated_roles = [{
    delegate_account_id = aws_organizations_account.accounts[module.global.config.terraform.state_account].id
    delegated_role_name = module.global.config.terraform.roles.admin
  }]
  delegator_policy_name = module.global.config.terraform.roles.admin
}

###############################################################################
# Create a Terraform Reader role on the Terraform state account and permit it 
# to be assumed from the master account and the init admin user.
###############################################################################
module "terraform_reader_role" {
  source = "../../modules/delegated-role"
  providers = {
    aws = aws.terraform_state_account
  }
  delegated_policy_arns = [aws_iam_policy.terraform_reader.arn]
  delegator_principals  = [aws_organizations_account.accounts[module.global.config.organization.master_account].id]
  delegated_role_name   = module.global.config.terraform.roles.reader
}

###############################################################################
# Create a Terraform reader policy at the master account to permit 
# assumption of the Terraform reader role at the Terraform state account.
###############################################################################
module "terraform_reader_policy" {
  source = "../../modules/delegator-policy"
  delegated_roles = [{
    delegate_account_id = aws_organizations_account.accounts[module.global.config.terraform.state_account].id
    delegated_role_name = module.global.config.terraform.roles.reader
  }]
  delegator_policy_name = module.global.config.terraform.roles.reader
}

###############################################################################
# Create S3 state bucket on the Terraform state account.
###############################################################################
resource "aws_s3_bucket" "terraform_state" {
  provider = aws.terraform_state_account
  bucket   = module.global.config.terraform.state_bucket
}

###############################################################################
# Create DynamoDB state lock table on the Terraform state account.
###############################################################################
resource "aws_dynamodb_table" "terraform_state_lock" {
  provider     = aws.terraform_state_account
  name         = module.global.config.terraform.state_lock_table
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"
  attribute {
    name = "LockID"
    type = "S"
  }
}
