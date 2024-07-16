/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

output "policy_arn" {
  description = "Delegator policy ARN."
  value       = aws_iam_policy.delegator.arn
}

output "policy_name" {
  description = "Delegator policy name."
  value       = aws_iam_policy.delegator.name
}
