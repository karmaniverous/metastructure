/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

###############################################################################
# Import global config.
###############################################################################
module "globals" {
  source = "../../modules/globals"
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
  for_each  = module.globals.accounts
  name      = each.value.name
  parent_id = aws_organizations_organization.org.roots[0].id
}

###############################################################################
# Create accounts.
###############################################################################
resource "aws_organizations_account" "accounts" {
  for_each = module.globals.accounts
  email    = each.value.email
  name     = each.value.name
  lifecycle {
    prevent_destroy = true
  }
  parent_id = aws_organizations_organizational_unit.organizational_units[each.value.organizational_unit].id
}




