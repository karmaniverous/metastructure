/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/


provider "aws" {
  default_tags {
    tags = {
      Terraform = true
    }
  }
  region = "us-east-1"
}

