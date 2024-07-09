# AWS Infrastructure

A typical enterprise needs something that looks like:

- A collection of back-end services that talk to one another and the world through a secure API layer.

- A performant, responsive, well-architected front-end application that consumes this back end across a reusable data layer.

- A PCI-compliant serverless infrastructure-as-code that supports a robust SDLC and offers heavily automated DevOps right out of the box.

Applicable technologies:

- TypeScript
- Serverless Framework (AWS Lambda, API Gateway, DynamoDB, S3, CloudFront, etc.)
- Next.js (AWS Amplify)
- Terraform

This repo addresses the infrastructure corner of this triangle and is a VERY early work in progress, which I am developing as a template to support other ongoing work.

For a preview of the back-end corner, see [this repository](https://github.com/karmaniverous/aws-api-template). It will soon be experiencing a MAJOR facelift, including a complete TS refactor, a ton of config automation, and a couple years' worth of new patters and lessons learned.

For a preview of the front end, see [this repository](https://github.com/karmaniverous/nextjs-template). Same story: big update on the way.

You will note that many of the key dependencies are my own, as along the way I've had to think through some VERY important problems (how DO we do configurable entity management in DynamoDB at scale?) and engineer generic solutions to the same. This project has a single architect and a single developer with 40 years of coding experience under his belt, and I hope it shows.

At the end of the day, what I hope to offer is a truly configuration-driven, fully open-sourced, enterprise-grade application template that can be spun up in a matter of minutes and customized to meet the needs of any serious organization.

Stay tuned.

## About This Repo

This repository contains the Infrastructure-as-Code (IaC) source code and deployment machinery for the Application platform.

The infrastructure is managed using Terraform, and all Terraform configuration code is located in the [`infrastructure`](./infrastructure/) directory.

This repository also features extensive tooling to facilitate configuration and (soon) bootstrapping. The code driving this functionality is located in the [`src`](./src/) directory and should not be changed without careful consideration.

The Application's Serverless Framework and Next.js repos create their own AWS resources. The goal of this repo is to provide the opinionated security & DevOps frameworks within which those other repos operate, probably across mutiple `dev`, `test` & `prod` environments spread across several AWS accounts.

## Repo Structure

All Terraform code is contained in the [`infrastructure`](./infrastructure/) directory, which features the following key elements:

- The [`env`](./infrastructure/env/) directory contains ENVIRONMENT-specific configurations. There may be more than one environment associated with a given AWS account. Each environment has its own Terraform workspace within this directory. Enter `terraform workspace list` to see the current list, and note that the `default` workspace is not used.

- The [`acct`](./infrastructure/env/) directory contains ACCOUNT-specific configurations. Each AWS account has its own Terraform workspace within this directory. Enter `terraform workspace list` to see the current list, and note that the `default` workspace is not used.

- The [`globals`](./infrastructure/globals/) directory is a Terraform module that exports configuration values common to all Terraform code.

- [`config.yml`](./infrastructure/config.yml) is the configuration file that drives project setup via the `nr init` script. In addition to global configs applicable to all contexts, this file captures key info about AWS accounts, application environments, GitHub branches, and the relationships between them.

- [`license.txt`](./infrastructure/license.txt) contains the license text that is added to the header of all supported source code files.

## Configuring Your Development Environment

Working with this repository in your local environment requires the following tools. Follow the links for installation instructions:

- [Git](https://git-scm.com/download)
- [Terraform](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)
- [TFLint](https://github.com/terraform-linters/tflint)
- [AWS CLI](https://aws.amazon.com/cli/)
- [Node.js (v20 LTS)](https://nodejs.org/en/download/package-manager) or MUCH BETTER install it with [NVM](https://github.com/coreybutler/nvm-windows)!
- [Visual Studio Code](https://code.visualstudio.com/Download) — Not _strictly_ required but these instructions assume you are working inside VS Code!

Install globally:

- [@antfu/ni](https://www.npmjs.com/package/@antfu/ni) — Ensures cross-platform shell script compatibility.

Once you've got all this installed, clone this repo & open it in VS Code. VS Code will ask you if you'd like to install recommended extensions. Do so. If you miss this step, you can install them manually by clicking on the Extensions icon in the sidebar and searching for "Recommended".

### Connecting AWS

Still working on bootstrapping SSO. Stay tuned.

### Initializing the Project

Open a terminal in VS Code and run the following commands:

```bash
# Install project dependencies.
ni

# Initialize local repository.
nr init
```

The initialization script consumes `config.yml` to generate a bunch of key Terraform & GitHub Actions configurations. More on this later.

## Bootstrapping AWS

The initial assumption here is that we are starting from zero.

Much of what follows is adamped from [AWS Multi-account Multi-region Bootstrapping with Terraform](https://levelup.gitconnected.com/aws-multi-account-multi-region-bootstrapping-with-terraform-39aeed097ad2). Please review that very excellent reference for a deeper dive.

### Create the Master Account

This needs to be done manually. Follow these steps:

1. [Sign up for a new AWS account](https://signin.aws.amazon.com/signup?request_type=register). Use a unique email; you won't be able to use it again to create another account.

1. Sign into the new account as the root user and choose your desired home region in the upper right corner of the AWS Console.

1. Visit the IAM Identity Center page and enable IAM Identity Center with AWS Organizations (the default choice).

1. On the **Settings > Identity Source** tab, customize your AWS access portal URL (not required but recommended).

1. On the **Settings > Authentication** tab, enable _Send email OTP for users created from API_ and configure Multi-Factor Authentication.

1. In the IAM console (_not_ IAM Identity Center!) create Policy `Terraform-Init` and paste in the contents of [`Terraform-Init-IAM-Policy.json`](./infrastructure/start/Terraform-Init-IAM-Policy.json). **Ignore any warnings! We'll delete this policy at the end of the bootstrapping process.**

1. In the IAM console new IAM user with `terraform-init` and attach the `Terraform-Init` policy.

1. From the `terraform-init` user page **Security Credentials** tab, create an access key and secret key (choose the _Other_ use case or AWS will hassle you with alternatives). Save these in a secure location.
