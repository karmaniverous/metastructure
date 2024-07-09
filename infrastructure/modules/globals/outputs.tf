/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

output "namespace" {
  description = "Organization token prefixed to resource names."
  value       = "karma"
}

output "terraform_delegate_role_token" {
  description = "Combined with namespace to form terraform delegate role name."
  value       = "terraform-delegate"
}

output "aws_accounts" {
  description = "Maps AWS account tokens to account ids."
  value = {
    dev = {
      id = "000000000000"
    }
    master = {
      id = "000000000001"
    }
    prod = {
      id = "000000000002"
    }
    test = {
      id = "000000000003"
    }
  }
}

output "app_environments" {
  description = "Maps environment tokens to AWS account tokens."
  value = {
    bali = {
      aws_account            = "dev"
      cognito_user_pool_name = "api-user-v0-bali"
    }
    dev = {
      aws_account            = "dev"
      cognito_user_pool_name = "api-user-v0-dev"
    }
    prod = {
      aws_account            = "prod"
      cognito_user_pool_name = "api-user-v0-prod"
    }
    release = {
      aws_account            = "test"
      cognito_user_pool_name = "api-user-v0-release"
    }
    seattle = {
      aws_account            = "dev"
      cognito_user_pool_name = "api-user-v0-seattle"
    }
  }
}
