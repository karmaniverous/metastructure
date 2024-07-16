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
        id                  = "533267125685"
        email               = "jscroft+karma.dev.001@gmail.com"
        name                = "Core Development Account"
        organizational_unit = "dev"
      }
      dev2 = {
        id                  = "058264144102"
        email               = "jscroft+karma.dev2.001@gmail.com"
        name                = "Second Development Account"
        organizational_unit = "dev"
      }
      identity = {
        id                  = "654654161374"
        email               = "jscroft+karma.identity.001@gmail.com"
        name                = "Identity Account"
        organizational_unit = "infrastructure"
      }
      log_archive = {
        id                  = "381491918127"
        email               = "jscroft+karma.log_archive.001@gmail.com"
        name                = "Log Archive Account"
        organizational_unit = "security"
      }
      master = {
        id    = "058264434915"
        email = "infra-abc@karmanivero.us"
        name  = "Master Account"
      }
      prod = {
        id                  = "590183658504"
        email               = "jscroft+karma.prod.001@gmail.com"
        name                = "Core Production Account"
        organizational_unit = "prod"
      }
      shared_services = {
        id                  = "533267247492"
        email               = "jscroft+karma.log_archive.0010@gmail.com"
        name                = "Core Shared Services Account"
        organizational_unit = "infrastructure"
      }
      test = {
        id                  = "471112737829"
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
      namespace      = "karma2"
    }
    organizational_units = {
      dev = {
        id     = "ou-ene9-jv0hbb8y"
        name   = "Dev Workloads OU"
        parent = "workloads"
      }
      infrastructure = {
        id   = "ou-ene9-u39ckmi0"
        name = "Infrastructure OU"
      }
      prod = {
        id     = "ou-ene9-t6otsgmo"
        name   = "Prod Workloads OU"
        parent = "workloads"
      }
      security = {
        id   = "ou-ene9-rhqbmjtc"
        name = "Security OU"
      }
      temp = {
        id   = "ou-ene9-dkjc0tly"
        name = "Some Other Name"
      }
      test = {
        id     = "ou-ene9-wznu1nm6"
        name   = "Test Workloads OU"
        parent = "workloads"
      }
      workloads = {
        id   = "ou-ene9-11hhbwhx"
        name = "Workloads OU"
      }
    }
    terraform = {
      aws_profile = "KARMA-INIT"
      aws_version = ">= 5.56.1"
      paths = {
        bootstrap = "src/contexts/bootstrap"
        source    = "src"
      }
      roles = {
        admin      = "TerraformAdmin"
        deployment = "TerraformDeployment"
        reader     = "TerraformReader"
      }
      state_account     = "shared_services"
      state_bucket      = "karma2-terraform-state"
      state_key         = "terraform.tfstate"
      state_lock_table  = "terraform-state-lock"
      terraform_version = ">= 1.9.0"
    }
  }
}
