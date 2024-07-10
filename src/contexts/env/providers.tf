/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/


locals {
  account_id = module.globals.aws_accounts[module.globals.app_environments[terraform.workspace].aws_account].id
}

provider "aws" {
  assume_role {
    role_arn = "arn:aws:iam::${local.account_id}:role/${module.globals.namespace}-${module.globals.terraform_delegate_role_token}"
  }
  default_tags {
    tags = {
      Terraform = true
    }
  }
  region = "us-east-1"
}

