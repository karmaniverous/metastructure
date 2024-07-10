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
# Create organizational units. 
###############################################################################
resource "aws_organizations_organizational_unit" "organizational_units" {
  for_each = module.global.config.organizational_units
  name     = each.value.name

  # Keeping the hierarchy flat for now. We'll connect them with their parents 
  # later.
  parent_id = aws_organizations_organization.org.roots[0].id
}

###############################################################################
# Create accounts.
###############################################################################
resource "aws_organizations_account" "accounts" {
  for_each = module.global.config.accounts
  email    = each.value.email
  lifecycle {
    prevent_destroy = true
  }
  name      = each.value.name
  parent_id = contains(keys(each.value), "organizational_unit") ? aws_organizations_organizational_unit.organizational_units[each.value.organizational_unit].id : null
}

