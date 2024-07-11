/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

variable "delegated_roles" {
  description = "A list of maps containing the delegate account id and the delegated role name"
  type = list(object({
    delegate_account_id = string
    delegated_role_name = string
  }))
}

variable "delegator_role_name" {
  description = "The name of the delegator role that will assume the delegated roles at the delegate accounts."
  type        = string
}

