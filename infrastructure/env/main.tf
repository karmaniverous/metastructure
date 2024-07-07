/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

# module "environment" {
#   source = "./environment"
# }

module "s3_log_bucket" {
  source = "./s3_log_bucket"
}

module "waf_acl" {
  source                 = "./waf_acl"
  service_major_versions = var.service_major_versions
}
