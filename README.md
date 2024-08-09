# Metastructure

Metastructure is a command-line tool that can generate & manage a complex AWS infrastructure, DevOps pipeline, etc., with a single YAML config file and a handful of Handlebars templates.

## The Trouble With Terraform

Terraform encapsulates the AWS API. (Forget about other cloud platforms for now).

This encapsulation isn't perfect, but it is VERY good. When you use Terraform, you rarely have to think about the underlying API calls. Linter & IDE support allow you to focus on the Terraform code as if it were the only thing that mattered. Think TypeScript: you rarely have to think about the underlying JavaScript!

There are some issues, though:

- Terraform isn't particularly DRY. Especially in a multi-account setup like AWS Organizations, many code files will be nearly identical, but NOT so identical that they can be modularized.

- Terraform iterators are limited, especially when there are dependencies between iterated sets. Also, once a resource is part of an iterated set, it is ALWAYS part of that set. If you make any significant changes to your architecture, migrating existing resources is a thorny problem.

- A Terraform module encapsulates code but is very much a black box. When they work, they're great. But when they don't, it's very hard to understand what is going on under the hood. Once a set of resources is encapsulated in a module, it is almost impossible to move those resourecs to a different module.

None of this matters much in a lab environment where you can tear down and rebuild your infrastructure at will. But in a production environment, where changes are often not reversible, these limitations can be a real headache. And in an ENTERPRISE environment, with multiple interdependent accounts, centralized services, and a compliance requirement, these limitations can be such a nightmare that infrastructure development just grinds to a halt.

### Terragrunt, Terraspace, etc.

All great tools that operate differently to DRY up Terraform code and encapsulate away some of the issues listed above. But they also all present their own challenges:

- They're _DRYer_, but they aren't **_DRY_**. When your code is DRY, you don't have to think about maintaining dupes, ever. When it isn't, you do. That's funddamental.

- The more Terraform is encapsulated, the less it is exposed to the very ecosystem of linters, IDE integrations, and other tools that made it SAFE to encapsulate the AWS API in the first place. If you write bad Terraform code, you can see what's going on. If you write bad Terragrunt code, you're flying blind.

### Metastructure to the Rescue

Metastructure addresses Terraform's issues from a different direction.

Where other tools use an improved syntax & structure to ENCAPSULATE Terraform code, Metastructure uses a powerful set of templating features to GENERATE Terraform code.

Once you've generated your code, there it is: Terraform, in all its wet glory, hooked into the same linters & IDE extensions you already use. But you can also regenerate it at will, with a single command, from a single YAML file and a highly condensed set of Handlebars templates.

Do you need to create unique resources that are intrinsically DRY? No problem: just write boring old Terraform code, which can live right alongside the Metastructure output and still leverage much of its configuration.

Do you need to deploy to multiple accounts and manage authentication profiles in an SSO environment? No problem: when you run `terraform apply` THROUGH Metastructure, it will generate appropriate providers, get you authenticated, and deploy resources to EVERY account with a SINGLE command.

Despite its power, Metastructure is a very simple tool. It doesn't try to replace or encapsulate Terraform, and it doesn't impose any particular structure on your project beyond the minimum required to support things like SSO.

Instead, Metastructure provides:

- A unifed config file format.
- A superchanged Handlebars templating engine.
- A CLI that intelligently parses your project configuraton and generates WHATEVER MAKES SENSE from your templates.

The real magic of Metastructure is in the templates, which are NOT limited to Terraform code. Need to generate a GitHub Actions workflow based on your project config? No problem... just write another template!

See the [Metastructure Template](https://github.com/karmaniverous/metastructure-template) repo for a working example of a Metastructure project!

## Getting Started

Metastructure is a Node.js package, so you'll need to have Node.js installed on your system. You can download it [here](https://nodejs.org/) or MUCH better use [NVM](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/).

Metastructure expects your Terraform project to be embedded in an NPM package (see the [Metastructure Template](https://github.com/karmaniverous/metastructure-template) repo for details).

If you like, you can install Metastructure as a dev dependency:

```bash
npm i -D @karmaniverous/metastructure
```

... in which case you would run it like `npx metastructure...`.

Otherwise, you'll want to install it as a global dependency:

```bash
npm i -g @karmaniverous/metastructure
```

In this README, for the sake of simplicity, we'll assume a global installation.

## Assumptions

Metastructure assumes you are building an AWS Organization secured by IAM Identity Center SSO. You can do other things—in fact you HAVE to, to bootstrap a project—but in the long term, you shouldn't.

If you build your project according to the [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html), then Metastructure will serve you well.

## Project Structure

Metastructure is agnostic about your project structure, with these exceptions...

### .metastructure.yml

Note the dot at the beginning of the filename.

This file must be located in your project root. It contains a single YAML object that looks like this:

```yaml
configPath: src/metastructure.yml
```

The purpose of this file is to tell Metastructure where to find your project configuration file, which you can name whatever you like. The path is relative to the project root, and doesn't HAVE to be in the same project!

For example, to support testing this repository has a [`.metastructure.yml`](./.metastructure.yml) file that points to a config file in the [Metastructure Template](https://github.com/karmaniverous/metastructure-template) repo.

When you run Metastructure, it looks for a `.metastructure.yml` file in the current directory's project root, which points to a config file as described above. All subsequent activity will take place in that config file's project directory.

### Project Config File

As described above, `.metastructure.yml` points to a project config file, which can have any name you like and may not be in the same project.

The structure of this file is laid out in the [Metastructure Config](#metastructure-config) section below. Any file paths contaned in this file should be relative to its own project root.

### license-checker-config.json

PCI and other compliance standards require that all code files contain a licensing header.

Metastructure is optionally integrated with the [`license-check-and-add`](https://www.npmjs.com/package/license-check-and-add) package, which will place a licensing header as a properly-formatted comment at the top of each generated file.

If you choose to use this feature, place a `license-checker-config.json` file in your project root and point it at a license file somewhere in your project.

This package is a little quirky, particularly in how it processes ignore patterns, but it's the best solution I've found that supports configurably managing license headers across multiple file formats. If you have a better idea, [please share](https://github.com/karmaniverous/metastructure/discussions)!

See the [Metastructure Template](https://github.com/karmaniverous/metastructure-template) repo for a working example.

## Running Metastructure

You can run Metastructure to do the following things in any combination:

- Override default CLI arguments articulated in your project config or your local repo. Resolved CLI arguments are passed to your Handlebars templates, where you can use them just like any other config data.

- Generate artifacts (like Terraform code) in a selected Terraform workspace from your project config & Handlebars templates.

- Create a valid AWS session (SSO or otherwise) and run a command (like `terraform apply`) against it.

- Update your project config file from the output of your selected Terraform workspace.

Here's the command line help:

```text
Usage: metastructure [options] [command...]

Generate & manage infrastructure code.

Arguments:
  command                        Command to run within AWS authentication
                                 context.

Options:
  -w, --workspace <string>       Workspace name (required).
  -g, --generate                 Generate workspace from config.
  -u, --update                   Update config from workspace output.
  -p, --aws-profile <string>     AWS profile.
  -r, --assume-role <string>     Role to assume on target accounts.
  -s, --permission-set <string>  SSO permission set.
  -L, --local-state-on           Use local state (conflicts with -l).
  -l, --local-state-off          Use default state (conflicts with -L).
  -c, --config-path <string>     Config file path relative to CWD.
  -d, --debug                    Enable debug logging.
  -h, --help                     Display command help.
```

## Metastructure Config

Your Metastructure project config serves several purposes:

- It records key global variables like Terraform versions & state configuration.

- It defines key project entities, like AWS accounts & organizational units, applications, and environments, as well as the relationships between them.

- It records key project entity identifiers as described in [Config Updates](#config-updates) below.

- It defines your SSO groups, permission sets, and policies, as well as their respective account relationships.

- It defines your Terraform workspaces and the files to be generated via Handlebars template for each workspace.

- It defines any other data elements that you want to use in your Handlebars templates.

Wherever possible, the config file format will accept data in a condensed form. For example, where the format wants an array of strings and you only have one string, you can provide a single string and it will be converted to an array before being passed to the Handlebars template.

Metastructure validates defined elements to ensure relational consistency. For example, it will validate that the account key assigned to an application environment actually exists. Feel free to create new elements of any complexity as you see fit, anywhere in the config file. Just know that validating the internal consistency of these elememts is up to you! See [Throwing Exceptions](#throwing-exceptions) below for more information.

### Config Updates

The Metastructure CLI includes an `--update` flag. When applied, Metastructure will merge the output of the current Terraform workspace with the contents of the config file.

The main purpose of this feature is to write identifiers of key resources (like accounts & OUs) back to the config file. Other templates can then use this information to decide whether to create new resources or import existing ones.

To use this feature:

- Create a template that generates a Terraform output containing the desired identifiers, whose structure matches that of the config file. Here's [an example](https://github.com/karmaniverous/metastructure-template/blob/main/src/bootstrap/templates/outputs.hbs).

- Add the template to the relevant workspace's `generators` section in your project config file.

- Run Metastructure with the `--update` flag.

### Config Format

## Handlebars Templates

### Throwing Exceptions

## More to Come!

Metastructure works great right now, but the documentation is thin and the real magic is in setting up the templates for a model infrastructure. I'm working on that now, so feel free to track my progress at [this repo](https://github.com/karmaniverous/aws-metastructure).

Stay tuned for WAY more documentation!

---

See more great templates and other tools on
[my GitHub Profile](https://github.com/karmaniverous)!
