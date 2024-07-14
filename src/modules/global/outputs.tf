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
        email               = "jscroft+karma.dev.001@gmail.com"
        name                = "Core Development Account"
        organizational_unit = "dev"
      }
      dev2 = {
        email               = "jscroft+karma.dev2.001@gmail.com"
        name                = "Second Development Account"
        organizational_unit = "dev"
      }
      identity = {
        email               = "jscroft+karma.identity.001@gmail.com"
        name                = "Identity Account"
        organizational_unit = "infrastructure"
      }
      log_archive = {
        email               = "jscroft+karma.log_archive.001@gmail.com"
        name                = "Log Archive Account"
        organizational_unit = "security"
      }
      master = {
        email = "infra-abc@karmanivero.us"
        name  = "Master Account"
      }
      prod = {
        email               = "jscroft+karma.prod.001@gmail.com"
        name                = "Core Production Account"
        organizational_unit = "prod"
      }
      shared_services = {
        email               = "jscroft+karma.log_archive.0010@gmail.com"
        name                = "Core Shared Services Account"
        organizational_unit = "infrastructure"
      }
      test = {
        email               = "jscroft+karma.log_archive.001@gmail.com"
        name                = "Core Test Account"
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
        name   = "Prod Workloads OU"
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
