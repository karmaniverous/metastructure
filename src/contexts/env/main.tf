/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/


module "globals" {
  source = "../../modules/globals"
}

module "s3_log_bucket" {
  source      = "../../modules/s3_log_bucket"
  bucket_name = "${module.globals.namespace}-log-s3-${terraform.workspace}"
}

module "waf_acl" {
  source                 = "../../modules/waf_acl"
  cognito_user_pool_name = module.globals.app_environments[terraform.workspace].cognito_user_pool_name
  namespace              = module.globals.namespace
}
