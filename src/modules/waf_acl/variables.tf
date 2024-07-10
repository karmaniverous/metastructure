/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/


variable "cognito_user_pool_name" {
  description = "Name of Cognito user pool to be protected by WAF."
  type        = string
}

variable "namespace" {
  description = "Application namespace."
  type        = string
}
