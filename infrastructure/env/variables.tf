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

module "globals" {
  source = "../globals"
}

variable "env_accts" {
  description = "Maps environment tokens to AWS account tokens."
  type        = map(string)
  default = {
    bali    = "dev"
    dev     = "dev"
    release = "test"
    prod    = "prod"
  }
}

variable "service_major_versions" {
  description = "Maps API service tokens to current major version number."
  type        = map(number)
  default = {
    beneficiary  = 0
    group        = 0
    ledger       = 0
    membership   = 0
    merchant     = 0
    message      = 0
    method       = 0
    network-visa = 0
    offer        = 0
    payment      = 0
    system       = 0
    template     = 0
    txn          = 0
    user         = 0
    validation   = 0
    validator    = 0
  }
}
