/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

# This file is generated via nr cli init. Do not edit it manually!

output "accounts" {
  description = "AWS accounts."
  value = {
    dev = {
      name                = "Core Development Account"
      email               = "dev@karmanivero.us"
      organizational_unit = "dev"
    }
    logging = {
      name                = "Core Logging Account"
      email               = "logging@karmanivero.us"
      organizational_unit = "security"
    }
    prod = {
      name                = "Core Production Account"
      email               = "prod@karmanivero.us"
      organizational_unit = "prod"
    }
    master = {
      name  = "Master Account"
      email = "master@karmanivero.us"
    }
    security = {
      name                = "Core Security Account"
      email               = "security@karmanivero.us"
      organizational_unit = "security"
    }
    shared_services = {
      name                = "Core Shared Services Account"
      email               = "shared.services@karmanivero.us"
      organizational_unit = "infrastructure"
    }
    test = {
      name                = "Core Test Account"
      email               = "test@karmanivero.us"
      organizational_unit = "test"
    }
  }
}

output "environments" {
  description = "Application environments."
  value = {
    bali = {
      account                = "dev"
      cognito_user_pool_name = "api-user-v0-bali"
      gha_on_push_branches   = "preview/**"
    }
    dev = {
      account                = "dev"
      cognito_user_pool_name = "api-user-v0-dev"
      gha_on_push_branches   = "dev"
    }
    prod = {
      account                = "prod"
      cognito_user_pool_name = "api-user-v0-prod"
      gha_on_push_branches   = "main"
    }
    release = {
      account                = "test"
      cognito_user_pool_name = "api-user-v0-release"
      gha_on_push_branches   = "release/**"
    }
    seattle = {
      account                = "dev"
      cognito_user_pool_name = "api-user-v0-seattle"
      gha_on_push_branches   = "preview/**"
    }
  }
}

output "organization" {
  description = "Organization."
  value = {
    aws_profile    = "KARMA-TERRAFORM"
    aws_region     = "us-east-1"
    github_org     = "karmaniverous"
    master_account = "master"
    namespace      = "karma"
  }
}

output "organizational_units" {
  description = "AWS organizational units."
  value = {
    dev = {
      name = "Development"
    }
    infrastructure = {
      name = "Infrastructure"
    }
    prod = {
      name = "Production"
    }
    security = {
      name = "Security"
    }
    test = {
      name = "Test"
    }
    workload = {
      name = "Workload"
    }
  }
}

