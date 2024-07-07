/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

# Define env WAF ACL.
resource "aws_wafv2_web_acl" "waf_acl" {
  default_action {
    allow {}
  }
  description = "${terraform.workspace} environment WAF ACL"
  name        = "${module.globals.namespace}-waf-acl-${terraform.workspace}"
  scope       = "REGIONAL"

  rule {
    name = "AWSManagedRulesCommonRuleSet"
    override_action {
      none {}
    }
    priority = 0
    statement {
      managed_rule_group_statement {
        name = "AWSManagedRulesCommonRuleSet"
        rule_action_override {
          name = "SizeRestrictions_BODY"
          action_to_use {
            allow {}
          }
        }
        rule_action_override {
          name = "EC2MetaDataSSRF_QUERYARGUMENTS"
          action_to_use {
            allow {}
          }
        }
        vendor_name = "AWS"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${module.globals.namespace}-waf-metric-${terraform.workspace}-AWSManagedRulesCommonRuleSet"
      sampled_requests_enabled   = true
    }
  }

  # rule {
  #   name = "BlockCountryCodes"
  #   action {
  #     block {}
  #   }
  #   priority = 1
  #   statement {
  #     geo_match_statement {
  #       country_codes = ["ID"]
  #     }
  #   }
  #   visibility_config {
  #     cloudwatch_metrics_enabled = true
  #     metric_name                = "${module.globals.namespace}-waf-metric-${terraform.workspace}-BlockCountryCodes"
  #     sampled_requests_enabled   = true
  #   }
  # }

  tags = {
    ENV = terraform.workspace
  }
  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${module.globals.namespace}-waf-metric-${terraform.workspace}"
    sampled_requests_enabled   = true
  }
}

# Lookup env Cognito User Pool. 
data "aws_cognito_user_pools" "cognito_user_pools" {
  name = "api-user-v${var.service_major_versions.user}-${terraform.workspace}"
}

# Associate WAF ACL with Cognito User Pool.
resource "aws_wafv2_web_acl_association" "waf_acl_association_cognito" {
  count        = length(data.aws_cognito_user_pools.cognito_user_pools.arns)
  resource_arn = data.aws_cognito_user_pools.cognito_user_pools.arns[count.index]
  web_acl_arn  = aws_wafv2_web_acl.waf_acl.arn
}

