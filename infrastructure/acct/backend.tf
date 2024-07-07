/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

terraform {
  backend "s3" {
    bucket               = "terraform"
    encrypt              = true
    dynamodb_table       = "terraform"
    key                  = "terraform.tfstate"
    region               = "us-east-1"
    workspace_key_prefix = "acct"
  }
}
