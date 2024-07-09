/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

resource "aws_iam_policy" "serverless_delegate" {
  # gz 02/22/2023 TN-181
  # checkov:skip=CKV_AWS_287:Ensure IAM policies does not allow credentials exposure.
  # checkov:skip=CKV_AWS_289:Ensure IAM policies does not allow permissions management / resource exposure without constraints.
  # checkov:skip=CKV_AWS_286:Ensure IAM policies does not allow privilege escalation.
  # checkov:skip=CKV_AWS_288:Ensure Ensure IAM policies does not allow data exfiltration.  
  # checkov:skip=CKV_AWS_290:Ensure IAM policies does not allow write access without constraints.
  # checkov:skip=CKV2_AWS_40:Ensure AWS IAM policy does not allow full IAM privileges.
  # checkov:skip=CKV_AWS_355:Ensure no IAM policies documents allow "*" as a statement's resource for restrictable actions.
  name        = var.role_name
  description = "Policies required to deploy serverless applications."
  policy      = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "acm:*",
                "apigateway:*",
                "cloudformation:*",
                "cloudfront:UpdateDistribution",
                "cloudwatch:*",
                "codedeploy:*",
                "cognito-idp:*",
                "config:DescribeConfigurationRecorderStatus",
                "config:DescribeConfigurationRecorders",
                "config:DescribeDeliveryChannels",
                "dynamodb:*",
                "events:*",
                "iam:*",
                "iam:PassRole",
                "kms:DescribeKey",
                "lambda:*",
                "logs:*",
                "route53:*",
                "s3:*",
                "secretsmanager:*",
                "sns:*",
                "sqs:*",
                "ssm:GetParameter",
                "ssm:GetParameters",
                "states:*",
                "wafv2:*",
                "xray:*"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Deny",
            "Action": [
                "iam:*User*",
                "iam:*Login*",
                "iam:*Group*",
                "directconnect:*",
                "aws-marketplace:*",
                "aws-marketplace-management:*",
                "ec2:*ReservedInstances*"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "serverless_delegate" {
  role       = aws_iam_role.serverless_delegate.name
  policy_arn = aws_iam_policy.serverless_delegate.arn
}
