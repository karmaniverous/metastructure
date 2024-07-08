/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

output "namespace" {
  description = "Organization token prefixed to resource names."
  value       = "karma"
}

output "terraform_delegate_role_token" {
  description = "Combined with namespace to form terraform delegate role name."
  value       = "terraform-delegate"
}

output "acct_ids" {
  description = "Maps AWS account tokens to account ids."
  value = {
    dev    = "000000000000"
    master = "000000000001"
    prod   = "000000000002"
    test   = "000000000003"
  }
}