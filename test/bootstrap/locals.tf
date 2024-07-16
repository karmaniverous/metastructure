/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

locals {
  accounts = {
    for k, v in module.global.config.accounts :
    k => v if try(v.action != "destroy" && v.action != "remove", true)
  }

  accounts_to_import = {
    for k, v in module.global.config.accounts : k => v if try(v.action == "import", false)
  }

  organizational_units = {
    for k, v in module.global.config.organizational_units :
    k => v if try(v.action != "destroy" && v.action != "remove", true)
  }

  organizational_units_to_import = {
    for k, v in module.global.config.organizational_units : k => v if try(v.action == "import", false)
  }
}
