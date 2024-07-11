/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

output "role_name" {
  description = "Delegated role name."
  value       = aws_iam_role.delegated.name
}
