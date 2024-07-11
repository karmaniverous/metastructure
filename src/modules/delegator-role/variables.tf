/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

variable "delegate_account_id" {
  type        = string
  description = "The id of the delegate account where the delegator role will assume the delegated role."
}

variable "delegate_account_name" {
  type        = string
  description = "The name of the delegate account where the delegator role will assume the delegated role."
}

variable "delegated_role_name" {
  type        = string
  description = "The name of the delegated role that the delegator role will assume at the delegate account."
}

variable "delegator_role_name" {
  type        = string
  description = "The name of the delegator role that will assume the delegated role at the delegate account."
}

