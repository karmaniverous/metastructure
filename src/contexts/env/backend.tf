/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

# This file is generated via nr cli init. Do not edit it manually!

terraform {
  backend "s3" {
    bucket               = "karma-terraform-state"
    encrypt              = true
    dynamodb_table       = "terraform-state-lock"
    key                  = "terraform.tfstate"
    region               = "us-east-1"
    workspace_key_prefix = "env"
  }
}