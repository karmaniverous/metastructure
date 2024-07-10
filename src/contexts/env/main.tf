/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/


module "global" {
  source = "../../modules/global"
}

module "s3_log_bucket" {
  source      = "../../modules/s3_log_bucket"
  bucket_name = "${module.global.namespace}-log-s3-${terraform.workspace}"
}

module "waf_acl" {
  source                 = "../../modules/waf_acl"
  cognito_user_pool_name = module.global.app_environments[terraform.workspace].cognito_user_pool_name
  namespace              = module.global.namespace
}
