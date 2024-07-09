/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

resource "aws_iam_policy" "serverless_delegate_oicd" {
  # gz 02/22/2023 TN-181
  # checkov:skip=CKV_AWS_289:Ensure IAM policies does not allow permissions management / resource exposure without constraints. 
  # checkov:skip=CKV_AWS_290:Ensure IAM policies does not allow write access without constraints.
  # checkov:skip=CKV_AWS_287:Ensure IAM policies does not allow credentials exposure.
  # checkov:skip=CKV_AWS_355:Ensure no IAM policies documents allow "*" as a statement's resource for restrictable actions.
  name        = "${var.role_name}-oidc"
  description = "Policies for Github OICD role"
  policy      = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:*",
        "kms:DescribeKey",
        "kms:GetKeyPolicy",
        "kms:GetKeyRotationStatus",
        "kms:ListAliases",
        "kms:ListResourceTags",
        "logs:CreateLogStream",
        "logs:DescribeLogGroups",
        "logs:ListTagsLogGroup",
        "logs:PutLogEvents",
        "organizations:Describe*",
        "organizations:List*",
        "rds:*",
        "ssm:DescribeDocument",
        "ssm:DescribeDocumentPermission",
        "ssm:DescribeParameters",
        "ssm:GetDocument",
        "ssm:ListTagsForResource",
        "sts:AssumeRole"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:GetRole",
        "iam:PassRole"
      ],
      "Resource": "arn:aws:iam::036512427359:role/mightyAPIECSTaskRole"
    }    
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "serverless_delegate_oicd" {
  role       = aws_iam_role.serverless_delegate.name
  policy_arn = aws_iam_policy.serverless_delegate_oicd.arn
}
