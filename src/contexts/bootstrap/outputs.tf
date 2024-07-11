/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

output "account_ids" {
  description = "Map of organization account ids."
  value = {
    for account in keys(module.global.config.accounts) : account => aws_organizations_account.accounts[account].id
  }
}
