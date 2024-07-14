/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

output "account_ids" {
  description = "Map of account ids."
  value = {
    for k, v in aws_organizations_account.accounts : k => v.id
  }
}

output "organizational_unit_ids" {
  description = "Map of organizational unit ids."
  value = {
    for k, v in aws_organizations_organizational_unit.organizational_units : k => v.id
  }
}
