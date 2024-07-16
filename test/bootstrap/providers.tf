/*
******************* DO NOT EDIT THIS NOTICE *****************
This legal notice is added to every supported source code
file at every commit. See the README for more info!                          
*************************************************************
*/

###############################################################################
###############################################################################
####                                                                       ####
####              THIS FILE WAS GENERATED WITH nr cli config               ####
####                       DO NOT EDIT IT MANUALLY!                        ####
####                                                                       ####
###############################################################################
###############################################################################

###############################################################################
# Default provider.
###############################################################################
provider "aws" {
  default_tags {
    tags = {
      Terraform = true
    }
  }
  region = module.global.config.organization.aws_region
}

###############################################################################
# Create a provider to assume the OrganizationAccountAccessRole role on the 
# Terraform state account.
###############################################################################
provider "aws" {
  alias = "terraform_state_account"
  assume_role {
    role_arn = "arn:aws:iam::${aws_organizations_account.accounts["shared_services"].id}:role/OrganizationAccountAccessRole"
  }
  default_tags {
    tags = {
      Terraform = true
    }
  }
  region = module.global.config.organization.aws_region
}

###############################################################################
# Create a provider to assume the OrganizationAccountAccessRole role on account 
# "Development Account".
###############################################################################
provider "aws" {
  alias = "dev"
  assume_role {
    role_arn = "arn:aws:iam::${try(aws_organizations_account.accounts["dev"].id, module.global.config.accounts["dev"].id)}:role/OrganizationAccountAccessRole"
  }
  default_tags {
    tags = {
      Terraform = true
    }
  }
  region = module.global.config.organization.aws_region
}

###############################################################################
# Create a provider to assume the OrganizationAccountAccessRole role on account 
# "Master Account".
###############################################################################
provider "aws" {
  alias = "master"
  default_tags {
    tags = {
      Terraform = true
    }
  }
  region = module.global.config.organization.aws_region
}

###############################################################################
# Create a provider to assume the OrganizationAccountAccessRole role on account 
# "Production Account".
###############################################################################
provider "aws" {
  alias = "prod"
  assume_role {
    role_arn = "arn:aws:iam::${try(aws_organizations_account.accounts["prod"].id, module.global.config.accounts["prod"].id)}:role/OrganizationAccountAccessRole"
  }
  default_tags {
    tags = {
      Terraform = true
    }
  }
  region = module.global.config.organization.aws_region
}

###############################################################################
# Create a provider to assume the OrganizationAccountAccessRole role on account 
# "Testing Account".
###############################################################################
provider "aws" {
  alias = "test"
  assume_role {
    role_arn = "arn:aws:iam::${try(aws_organizations_account.accounts["test"].id, module.global.config.accounts["test"].id)}:role/OrganizationAccountAccessRole"
  }
  default_tags {
    tags = {
      Terraform = true
    }
  }
  region = module.global.config.organization.aws_region
}

###############################################################################
# Create a provider to assume the OrganizationAccountAccessRole role on account 
# "Shared Services Account".
###############################################################################
provider "aws" {
  alias = "shared_services"
  assume_role {
    role_arn = "arn:aws:iam::${try(aws_organizations_account.accounts["shared_services"].id, module.global.config.accounts["shared_services"].id)}:role/OrganizationAccountAccessRole"
  }
  default_tags {
    tags = {
      Terraform = true
    }
  }
  region = module.global.config.organization.aws_region
}