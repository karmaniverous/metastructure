/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

variable "delegated_role_name" {
  type        = string
  description = "The name of the delegated role at the delegate account that the delegator role will assume from the delegator account."
}

variable "delegated_policy_arns" {
  type        = list(string)
  description = "The ARNs of the policies that will be attached to the delegated role."

}

# TODO: Support more than just AWS principals.
variable "delegator_principals" {
  type        = list(string)
  description = "A list of the delegator AWS principals from which the delegator role will assume the delegated role."
}

