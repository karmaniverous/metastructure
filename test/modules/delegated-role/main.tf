/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

###############################################################################
# Policy document that grants AssumeRole permission to delegator_principals. 
###############################################################################
data "aws_iam_policy_document" "delegators" {
  statement {
    sid     = "DelegatorAccounts"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "AWS"
      identifiers = var.delegator_principals
    }
  }
}

###############################################################################
# Create delegated role and allow it to be assumed by delegator_principals.
###############################################################################
resource "aws_iam_role" "delegated" {
  name               = var.delegated_role_name
  assume_role_policy = data.aws_iam_policy_document.delegators.json
}

###############################################################################
# Attach delegated_policy_arns to delegated role. 
###############################################################################
resource "aws_iam_role_policy_attachment" "delegated" {
  count      = length(var.delegated_policy_arns)
  role       = aws_iam_role.delegated.name
  policy_arn = var.delegated_policy_arns[count.index]
}

