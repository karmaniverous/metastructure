/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

locals {
  current_accounts = { for k, v in module.global.config.accounts : k => v if try(!v.destroy, true) }
}
