/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

###############################################################################
# Policy document that grants permission to assume delegated_roles at 
# delegate_account_id.
###############################################################################
data "aws_iam_policy_document" "delegator" {
  statement {
    sid = "AssumeDelegatedRole"
    actions = [
      "sts:AssumeRole"
    ]

    principals {
      type        = "AWS"
      identifiers = [for r in var.delegated_roles : "arn:aws:iam::${r.delegate_account_id}:role/${r.delegated_role_name}"]
    }
  }
}

###############################################################################
# Create delegator role and allow it to assume delegated_roles at 
# delegate_account_id.
###############################################################################
resource "aws_iam_role" "delegator" {
  name               = var.delegator_role_name
  assume_role_policy = data.aws_iam_policy_document.delegator.json
}
