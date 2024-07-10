/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/


module "globals" {
  source = "../../modules/globals"
}

module "role_serverless_delegate" {
  source    = "../../modules/role_serverless_delegate"
  role_name = "${module.globals.namespace}-serverless-delegate"
}

