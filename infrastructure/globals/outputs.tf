/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

output "namespace" {
  description = "Organization token prefixed to resource names."
  value       = "vcr"
}

output "terraform_delegate_role_token" {
  description = "Combined with namespace to form terraform delegate role name."
  value       = "terraform-delegate"
}

output "acct_ids" {
  description = "Maps AWS account tokens to account ids."
  value = {
    dev    = "546652796775"
    master = "945442616899"
    prod   = "349507567318"
    test   = "537756955768"
  }
}

