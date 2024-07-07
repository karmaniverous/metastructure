/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

module "globals" {
  source = "../../globals"
}

variable "service_major_versions" {
  type = map(number)
}
