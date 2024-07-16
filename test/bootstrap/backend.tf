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

terraform {
  backend "s3" {
    bucket               = "karma003-terraform-state"
    dynamodb_table       = "terraform-state-lock"
    encrypt              = true
    key                  = "terraform.tfstate"
    region               = "us-east-1"
    role_arn             = "arn:aws:iam::975050301644:role/"
    workspace_key_prefix = "bootstrap"
  }
}