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

    resources = [for r in var.delegated_roles : "arn:aws:iam::${r.delegate_account_id}:role/${r.delegated_role_name}"]
  }
}

###############################################################################
# Create delegator policy.
###############################################################################
resource "aws_iam_policy" "delegator" {
  name        = var.delegator_policy_name
  description = "Permits assumption of delegated roles at delegate accounts."
  policy      = data.aws_iam_policy_document.delegator.json
}
