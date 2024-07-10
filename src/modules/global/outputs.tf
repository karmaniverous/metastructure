/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

###############################################################################
# This file is generated via nr cli init. Do not edit it manually!
###############################################################################

output "config" {
  description = "Global config."
  value = {
    accounts = {
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
    environments = {
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
    organization = {
      aws_profile    = "KARMA-TERRAFORM"
      aws_region     = "us-east-1"
      github_org     = "karmaniverous"
      master_account = "master"
      taxonomy = {
        namespace = "karma"
      }
    }
    organizational_units = {
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
    templates_path = "src/templates"
    terraform = {
      aws_version       = ">= 5.56.1"
      state_bucket      = "terraform-state"
      state_key         = "terraform.tfstate"
      state_table       = "terraform-state-lock"
      terraform_version = ">= 1.9.0"
    }
    config = {}
    params = {
      localState = undefined
    }
  }
}
