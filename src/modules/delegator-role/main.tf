/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

###############################################################################
# Policy document that grants AssumeRole permission on resources at 
# DelegateAccount in role DelegateRole.
###############################################################################
data "aws_iam_policy_document" "delegator" {
  statement {
    sid = "Assume${replace(title(var.delegate_account_name), "/-| /", "")}${replace(title(var.delegated_role_name), "/-| /", "")}Role"
    actions = [
      "sts:AssumeRole"
    ]

    resources = [
      "arn:aws:iam::${var.delegate_account_id}:role/${var.delegated_role_name}",
    ]
  }
}

###############################################################################
# Create DelegatorRole and allow it to assume DelegatedRole at 
# DelegatorAccount.
###############################################################################
resource "aws_iam_role" "delegator" {
  name               = var.delegated_role_name
  assume_role_policy = data.aws_iam_policy_document.delegator.json
}
