/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

###############################################################################
###############################################################################
####                                                                       ####
####              THIS FILE WAS GENERATED WITH nr cli config               ####
####                       DO NOT EDIT IT MANUALLY!                        ####
####                                                                       ####
###############################################################################
###############################################################################

output "config" {
  description = "Global config."
  value = {
    accounts = {
      dev = {
        name                = "Core Development Account"
        email               = "jscroft+karma.dev.000@gmail.com"
        organizational_unit = "dev"
      }
      identity = {
        name                = "Identity Account"
        email               = "jscroft+karma.identity.000@gmail.com"
        organizational_unit = "infrastructure"
      }
      log_archive = {
        name                = "Log Archive Account"
        email               = "jscroft+karma.log_archive.000@gmail.com"
        organizational_unit = "security"
      }
      master = {
        name  = "Master Account"
        email = "infra-abc@karmanivero.us"
      }
      prod = {
        name                = "Core Production Account"
        email               = "jscroft+karma.prod.000@gmail.com"
        organizational_unit = "prod"
      }
      shared_services = {
        name                = "Core Shared Services Account"
        email               = "jscroft+karma.log_archive.000@gmail.com"
        organizational_unit = "infrastructure"
      }
      test = {
        name                = "Core Test Account"
        email               = "jscroft+karma.log_archive.000@gmail.com"
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
      aws_region     = "us-east-1"
      github_org     = "karmaniverous"
      id             = "o-3f4ig2op2b"
      master_account = "master"
      namespace      = "karma"
    }
    organizational_units = {
      dev = {
        name   = "Dev Workloads OU"
        parent = "workloads"
      }
      infrastructure = {
        name = "Infrastructure OU"
      }
      prod = {
        name   = "Dev Workloads OU"
        parent = "workloads"
      }
      security = {
        name = "Security OU"
      }
      test = {
        name   = "Test Workloads OU"
        parent = "workloads"
      }
      workloads = {
        name = "Workloads OU"
      }
    }
    terraform = {
      admin_role                = "TerraformAdmin"
      aws_profile               = "KARMA-INIT"
      aws_version               = ">= 5.56.1"
      deployment_role           = "TerraformDeployment"
      deployment_delegator_role = "TerraformDeploymentDelegator"
      reader_role               = "TerraformReader"
      state_account             = "shared_services"
      state_bucket              = "karma-terraform-state"
      state_key                 = "terraform.tfstate"
      state_table               = "terraform-state-lock"
      terraform_version         = ">= 1.9.0"
    }
  }
}
