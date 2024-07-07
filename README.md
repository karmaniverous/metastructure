# AWS Infrastructure

## Configuring Your Development Environment

Working with this repository in your local environment requires the following tools. Follow the links for installation instructions:

- [Git](https://git-scm.com/download)
- [Terraform](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)
- [TFLint](https://github.com/terraform-linters/tflint)
- [AWS CLI](https://aws.amazon.com/cli/)
- [Node.js (v20 LTS)](https://nodejs.org/en/download/package-manager) or MUCH BETTER install it with [NVM](https://github.com/coreybutler/nvm-windows)!
- [Visual Studio Code](https://code.visualstudio.com/Download) — Not _strictly_ required but these instructions assume you are working inside VS Code!

Install the following NPM packages globally:

- [@antfu/ni](https://github.com/antfu-collective/ni) — Again, not _strictly_ required, but helps you execute NPM scripts with simpler, cross-platform syntax.

To install these, run:

```bash
npm i -g @antfu/ni
```

Once you've got all this installed, clone this repo & open it in VS Code. VS Code will ask you if you'd like to install recommended extensions. Do so. If you miss this step, you can install them manually by clicking on the Extensions icon in the sidebar and searching for "Recommended".
