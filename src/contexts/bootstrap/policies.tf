/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

###############################################################################
# Create a Terraform Admin policy at the Terraform state account that permits
# management & locking of Terraform state.
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
      "arn:aws:dynamodb:*:${aws_organizations_account.accounts[module.global.config.terraform.state_account].id}:table/${module.global.config.terraform.state_lock_table}",
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

resource "aws_iam_policy" "terraform_admin" {
  name        = module.global.config.terraform.admin_role
  policy      = data.aws_iam_policy_document.terraform_admin.json
  description = "Permits management & locking of Terraform state."
  provider    = aws.terraform_state_account
}

###############################################################################
# Create a Terraform Reader policy at the Terraform state account that permits
# read-only access to Terraform state.
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

resource "aws_iam_policy" "terraform_reader" {
  name        = module.global.config.terraform.reader_role
  policy      = data.aws_iam_policy_document.terraform_reader.json
  description = "Permits management & locking of Terraform state."
  provider    = aws.terraform_state_account
}

