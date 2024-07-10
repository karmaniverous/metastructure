/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

###############################################################################
# Policy document that assigns the Terraform state account as principal in 
# an assume role policy for cross account access.
###############################################################################
data "aws_iam_policy_document" "crossaccount_assume_from_terraform_state_account" {
  statement {
    sid     = "AssumeFromTerraformStateAccount"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "AWS"
      identifiers = [aws_organizations_account.accounts[module.global.config.terraform.state_account].id]
    }
  }
}

###############################################################################
# A policy document that provides read/write access to the necessary resources to
# manage Terraform state in S3 and locking in DynamoDB
###############################################################################
data "aws_iam_policy_document" "terraform_admin" {
  statement {
    sid = "AllowS3ActionsOnTerraformBucket"

    actions = ["s3:*"]

    resources = [
      "arn:aws:s3:::${module.global.config.terraform.state_bucket}",
      "arn:aws:s3:::${module.global.config.terraform.state_bucket}/*",
    ]
  }

  statement {
    sid = "AllowCreateAndUpdateDynamoDBActionsOnTerraformLockTable"

    actions = [
      "dynamodb:PutItem",
      "dynamodb:GetItem",
      "dynamodb:DeleteItem",
      "dynamodb:DescribeTable",
      "dynamodb:CreateTable",
    ]

    resources = [
      "arn:aws:dynamodb:*:${aws_organizations_account.accounts[module.global.config.terraform.state_account].id}:table/${module.global.config.terraform.state_table}",
    ]
  }

  statement {
    sid = "AllowTagAndUntagDynamoDBActions"

    actions = [
      "dynamodb:TagResource",
      "dynamodb:UntagResource",
    ]

    resources = [
      "*",
    ]
  }
}

###############################################################################
# A policy document that provides read access to the necessary resources to
# list and read Terraform state from S3
###############################################################################
data "aws_iam_policy_document" "terraform_reader" {
  statement {
    sid = "AllowListS3ActionsOnTerraformBucket"

    actions = [
      "s3:ListBucket",
    ]

    resources = [
      "arn:aws:s3:::${module.global.config.terraform.state_bucket}",
    ]
  }

  statement {
    sid = "AllowGetS3ActionsOnTerraformBucketPath"

    actions = [
      "s3:GetObject",
    ]

    resources = [
      "arn:aws:s3:::${module.global.config.terraform.state_bucket}/*",
    ]
  }
}
