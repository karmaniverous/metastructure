/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

# Get the data object that represents the currently running identity context
data "aws_caller_identity" "current" {}

# Create a new organization.
resource "aws_organizations_organization" "org" {
  enabled_policy_types = ["SERVICE_CONTROL_POLICY"]
  feature_set          = "ALL"

  aws_service_access_principals = [
    "cloudtrail.amazonaws.com",
    "sso.amazonaws.com"
  ]

  lifecycle {
    prevent_destroy = true
  }
}
