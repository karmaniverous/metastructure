/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/


terraform {
  required_version = "~>1.4.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "= 4.59.0"
    }
  }
}
