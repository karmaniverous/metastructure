/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/


output "role_serverless_delegate_arn" {
  value = aws_iam_role.serverless_delegate.arn
}
