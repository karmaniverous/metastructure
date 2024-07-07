/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.56.1"
    }
  }

  required_version = ">= 1.9.0"
}

