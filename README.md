# Metastructure

Metastructure is a command-line tool that can generate & manage a complex AWS infrastructure, DevOps pipeline, etc., with a single YAML config file and a handful of Handlebars templates.

## The Trouble With Terraform

[Terraform](https://www.terraform.io/) encapsulates the [AWS Cloud Control API](https://aws.amazon.com/cloudcontrolapi/). Also other cloud providers, but for now Metastructure focuses on AWS.

This encapsulation isn't perfect, but it is VERY good. When you use Terraform, you rarely have to think about the underlying API calls. Linter & IDE support allow you to focus on the Terraform code as if it were the only thing that mattered. Think TypeScript: you rarely have to think about the underlying JavaScript!

There are some issues, though:

- Terraform isn't particularly [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself). Especially in a multi-account setup like [AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html), many code files will be nearly identical, but NOT so identical that they can be modularized.

- [Terraform iterators](https://developer.hashicorp.com/terraform/cdktf/concepts/iterators) are limited, especially when there are dependencies between iterated sets. Also, once a resource is part of an iterated set, it is ALWAYS part of that set. If you make any significant changes to your architecture, migrating existing resources is a thorny problem.

- A [third-party Terraform module](https://registry.terraform.io/browse/modules) encapsulates code but is very much a black box. When they work, they're great. But when they don't, it's very hard to understand what is going on under the hood. Once a set of resources is encapsulated in a module, it is almost impossible to move those resourecs to a different module.

None of this matters much in a lab environment where you can tear down and rebuild your infrastructure at will. But in a production environment, where changes are often not reversible, these limitations can be a real headache.

And in an ENTERPRISE environment—with multiple interdependent accounts, centralized services, and a compliance requirement—these limitations can be such a nightmare that infrastructure development just grinds to a halt.

### Terragrunt, Terraspace, etc.

[Terragrunt](https://terragrunt.gruntwork.io/), [Terraspace](https://terraspace.cloud/), and the like are all great tools that operate differently to DRY up Terraform code and encapsulate away some of the issues listed above. But they also all present their own challenges:

- They're _DRYer_, but they aren't **_DRY_**. When your code is DRY, you don't have to think about maintaining dupes, ever. When it isn't, you do. That's fundamental, and **close just doesn't count**.

- They're often opinionated as to project structure and other conventions. This is great when you're starting a new project, but it can be a real headache when you're trying to integrate them into an existing project alongside other tools that are ALSO opinionated.

- The more Terraform is encapsulated, the less it is exposed to the very ecosystem of linters, IDE integrations, and other tools that made it SAFE to encapsulate the AWS API in the first place. If you write bad Terraform code, you can see what's going on. If you write bad Terragrunt code, you're often flying blind!

### Metastructure to the Rescue

Metastructure addresses Terraform's issues from a different direction.

**Where other tools use an improved syntax & structure to ENCAPSULATE Terraform code, Metastructure uses a powerful set of templating features to GENERATE Terraform code.**

Once you've generated your code, there it is: Terraform code, in all its WET glory! (You know: not DRY. 🤣) It leverages whtever features you built into your templates, and is hooked into the same linters & IDE extensions you already use.

BUT...

- You can make changes to your DRY templates & regenerate your WET code at will.

- You can drive multiple workspaces from single, coherent YAML config file.

- You can use the same config to drive the generation of related assets like GitHub Actions workflows, Dockerfiles, etc.

**_Do you need to create unique resources that are intrinsically DRY?_** No problem, and no template required: just write boring old Terraform code, which can live right alongside the Metastructure output and still leverage much of its configuration.

**_Do you need to deploy to multiple accounts and manage authentication profiles in an SSO environment?_** No problem: when you run `terraform apply` THROUGH Metastructure, it will generate appropriate providers, get you authenticated, and deploy resources to EVERY account with a SINGLE command.

Despite its power, Metastructure is a very simple tool. It doesn't try to replace or encapsulate Terraform, and it doesn't impose any particular structure on your project beyond the relationships already intrinsic to things like accounts, OUs, and SSO permission sets.

Instead, Metastructure provides:

- A unifed config file format.

- A superchanged Handlebars templating engine.

- A CLI that intelligently parses your project configuraton and generates WHATEVER MAKES SENSE from your templates.

The true magic of Metastructure is in your templates, which really just the code you were going to write anyway... only DRY as a bone and driven by a common config because, at long last, you CAN.

See the [Metastructure Template](https://github.com/karmaniverous/metastructure-template) repo for a working example of a Metastructure project!

## Getting Started

Metastructure is a Node.js package, so you'll need to have Node.js installed on your system. You can download it [here](https://nodejs.org/) or MUCH better use [NVM](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/).

Metastructure expects your Terraform project to be embedded in an NPM package. For best results, just [clone the Metastructure Template](https://github.com/new?template_name=metastructure-template)!

If you like, you can install Metastructure as a dev dependency:

```bash
npm i -D @karmaniverous/metastructure
```

... in which case you would run it like `npx metastructure...`. That's what you will see in the [Metastructure Template](https://github.com/karmaniverous/metastructure-template) repo.

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

If Metastructure can't find `.metastructure.yml`, it will be unable to locate your project config file and will throw an error.

### Project Config File

As described above, `.metastructure.yml` points to a project config file, which can have any name you like and may not even be in the same project.

The structure of this file is laid out in the [Metastructure Config](#metastructure-config) section below. Any file paths contaned in this file should be relative to its own project root.

### license-checker-config.json

PCI and other compliance standards require that all code files contain a licensing header.

Metastructure is optionally integrated with the [`license-check-and-add`](https://www.npmjs.com/package/license-check-and-add) package, which will place a licensing header as a properly-formatted comment at the top of each generated file.

If you choose to use this feature, place a `license-checker-config.json` file in your project root and point it at a license file somewhere in your project.

This package is a little quirky, particularly in how it processes ignore patterns, but it's the best solution I've found that supports configurably managing license headers across multiple file formats. If you have a better idea, [please share](https://github.com/karmaniverous/metastructure/discussions)!

See the [Metastructure Template](https://github.com/karmaniverous/metastructure-template) repo for a working example.

## Running Metastructure

```text
Usage: metastructure [options] [command...]

Generate & manage infrastructure code.

Arguments:
  command                        Command to run within AWS authentication context.

Options:
  -w, --workspace <string>       Workspace name (required).
  -g, --generate                 Generate workspace from config.
  -u, --update                   Update config from workspace output.
  -r, --assume-role <string>     Role to assume on target accounts (requires
                                 --aws-profile, conflicts with
                                 --permission-set).
  -p, --aws-profile <string>     AWS profile (requires --assume-role, conflicts
                                 with --permission-set).
  -s, --permission-set <string>  SSO permission set (conflicts with
                                 --assume-role & --aws-profile).
  -L, --local-state-on           Use local state (conflicts with -l).
  -l, --local-state-off          Use default state (conflicts with -L).
  -c, --config-path <string>     Config file path relative to CWD.
  -d, --debug                    Enable debug logging.
  -h, --help                     Display command help.
```

You can run Metastructure to do the following things. These may be specified in any combination, but will always run in this order:

- Generate artifacts (like Terraform code) in a selected Terraform workspace from your project config & Handlebars templates. [_Learn more..._](#artifact-generation)

- Create a valid AWS session (SSO or otherwise) and run a command (like `terraform apply`) against it. [_Learn more..._](#authenticated-execution)

- Update your project config file from the output of your selected Terraform workspace. [_Learn more..._](#config-update)

### CLI Overrides

The following CLI arguments can be specified as defaults in your config file at `workspaces.<workspace>.cli_defaults`:

| CLI Argument                                      | Config Key        | Config Type       | Description                                                                                  |
| ------------------------------------------------- | ----------------- | ----------------- | -------------------------------------------------------------------------------------------- |
| `-r, --assume-role`                               | `assume_role`     | `string \| null`  | Role to assume on target accounts (requires `aws_profile`, conflicts with `permission_set`). |
| `-p, --aws-profile`                               | `aws_profile`     | `string \| null`  | AWS profile (requires `assume-role`, conflicts with `permission_set`).                       |
| `-s, --permission-set`                            | `permission_set`  | `string \| null`  | SSO permission set (conflicts with `assume_role` & `aws_profile`).                           |
| `-L, --local-state-on`<br>`-l, --local-state-off` | `use_local_state` | `boolean \| null` | Use local state.                                                                             |

Since the project config file will normally be persisted to your shared repository, these defaults apply to all developers working on the project.

If you wish to override these defaults locally, create a .gitignored local yaml file (e.g. `workspace.local.yml`) and add your overrides to the file root. For example:

```yaml
assume_role: null
aws_profile: META-BOOTSTRAP
permission_set: terraform_admin
```

Then add the path to this file to your project config at `workspaces.<workspace>.cli_defaults_path`. These values will override the defaults in the config file.

Finally, you can override these values at the command line.

Some notes:

- To negate a CLI argument without overriding it, use `null`.

- CLI argument overrides are performed CLI arguments are validated. After overrides, either `permission_set` or BOTH `assume_role` and `aws_profile` must be non-null.

- You can access resolved CLI arguments in your Handlebars templates at key `cli_params`.

### Config Expansion

On loading, your project config file is expanded in several ways as described in the sections below.

When you run Metastructure, use the `-d` or `--debug` flag to see the expanded config object in your console!

#### Handlebars Recursion

Your project config file is processed recursively as a Handlebars template, using itself as a data object. If your config file has this:

```yaml
organization:
  tokens:
    audit_log: audit-logs
    namespace: metastructure-001
    owner: karmaniverous
accounts:
  dev:
    email: {{organization.tokens.owner}}+{{#if organization.tokens.namespace}}{{organization.tokens.namespace}}-{{/if}}dev@gmail.com
```

... it will be processed into this:

```yaml
organization:
  tokens:
    audit_log: audit-logs
    namespace: metastructure-001
    owner: karmaniverous
accounts:
  dev:
    email: karmniverous+metastructure-001-dev@gmail.com
```

#### Format Expansion

For brevity, you can enter data into your project config file in a condensed form. For example, where the format wants an array of strings and you only have one string, you can just provide the string. Metastructure will convert it to an array before passing the config object to your Handlebars templates.

So this:

```yaml
permission_sets:
  terraform_admin:
    policies: AdministratorAccess
```

... will become this:

```yaml
permission_sets:
  terraform_admin:
    policies:
      - AdministratorAccess
```

There are also some special expansion cases that will be covered in the relevant config sections below.

#### CLI Params

As described in the [CLI Overrides](#cli-overrides) section above, CLI arguments are resolved and added to the config object at key `cli_params`.

#### SSO Reference

The groups, permission sets, and policies defined in the `sso` section of your project config file encode a complex set of relationships. Metastructure generates `sso.reference` keys to provide your templates with easy access to different facets of these relationships to facilitate the creation of the resources necessary to support SSO.

These include:

- `account_permission_sets`: A map of the permission sets assigned to each account across all groups. This is used by the session authentication engine to select an SSO profile based on the provided permission set.

- `account_policies`: A map of SSO policies assigned to each account via related permission sets. In the Metstructure Template repo, this is used by the [bootstrap workspace SSO template](https://github.com/karmaniverous/metastructure-template/blob/main/src/bootstrap/templates/sso.hbs) to generate the `aws_iam_policy` resources necessary to support the SSO permission sets assigned to each account.

- `group_account_permission_set_policies`: A breakdown of the policies assigned to each permission set, in each account, in each SSO group. In the Metstructure Template repo, this is also used by the [bootstrap workspace SSO template](https://github.com/karmaniverous/metastructure-template/blob/main/src/bootstrap/templates/sso.hbs) to generate the `aws_ssoadmin_account_assignment` resources that link these entities.

- `policy_accounts`: The inverse of `account_policies`, this is used by the [bootstrap workspace SSO template](https://github.com/karmaniverous/metastructure-template/blob/main/src/bootstrap/templates/sso.hbs) to prevent a policy from being added to an SSO permission set until it has been created in its parent account.

### Artifact Generation

Each `workspace` defined in your project cnfig file contains an optional `generators` object. If present, each key of this object should specify a file path relative to the project root, and the associated value should specify the location of a Handlebars template, also relative to the project root.

When you run Metastructure with the `-g` or `--generate` flag, it will generate (or replace) the files specified in the `generators` keys by processing the associated Handlebars templates with the expanded project config data object for the workspace provided with the `-w` or `--workspace` flag.

To visualize this data object, use the `-d` or `--debug` flag when running Metastructure.

Neither templates nor destination files need be located in any specific directory, so it is perfectly reasonable to collect global templates in a common directory and reference them from multiple workspaces. This is the approach taken in the [Metastructure Template repo](https://github.com/karmaniverous/metastructure-template).

See the [Handlebars Templates](#handlebars-templates) section below for more information on how to write templates.

### Authenticated Execution

There are two ways use Metastructure to generate AWS credentials, depending how your [CLI overrides](#cli-overrides) resolve.

If `assume_role` and `aws_profile` are populated, then Metastructure will attempt to authenticate with the indicated profile from your local [AWS credentials file](https://docs.aws.amazon.com/cli/v1/userguide/cli-configure-files.html). These credentials will generally take the form of an AWS Access Key Id and an AWS Secret Access Key. Once authenticated, Metastructure will attempt to assume the indicated role. It is up to you to ensure that the credentials you provide have the necessary permissions to assume the role on all affected accounts.

If `permission_set` is populated, then there are a few more moving parts, which are best understoof using the Metastructure Template repo as an example:

- The [`shared_config template`](https://github.com/karmaniverous/metastructure-template/blob/main/src/templates/shared_config.hbs) generates an SSO credentials config file at the location specified in your project config file at `workspaces.<workspace>.shared_config_path`.

- Metastructure leverages this file to launch a browser window initiate the SSO login process. You should log in as a user that has access to the indicted permission set.

- The [backend](https://github.com/karmaniverous/metastructure-template/blob/main/src/templates/backend.hbs) and [providers](https://github.com/karmaniverous/metastructure-template/blob/main/src/templates/providers.hbs) templates leverage the same shared config file to provide access to your Terraform state and account resources.

Note that these steps assume code generation has taken place in the indicted workspace with a `permission_set` argumet, otherwise the shared config file will not be populated and the `backend` and `providers` files will be configured for key credential access rather than SSO.

So: if you are shifting from key credential access to SSO (which will happen as you bootstrap a new project), you MUST run Metastructure at least once with the `-g` or `--generate` flag in order to generate the required SSO configurations.

In practice, it is not unreasonable to run Metastructure with the `-g` or `--generate` all the time, unless you have a compelling reason not to.

In any case, when Metastructure invoked with any other command, that command will run within the context of the AWS session generated by the above process.

So, assuming you have either a `permission_set` or `assume_role` and `aws_profile` configured in `cli_defaults`, this command will:

- Generate the Terraform code for your `bootstrap` workspace.

- Establish an AWS session.

- Deploy your code to all accounts in your project.

- Update your project config with identifiers as described in [Config Updates](#config-updates) below.

```bash
metastructure -w bootstrap -g -u terraform apply
```

### Config Updates

When you run Metastructure with the `-u` or `--update` flag, Metastructure will merge the output of the current Terraform workspace with the contents of the config file.

The main purpose of this feature is to write identifiers of key resources (like accounts & OUs) back to the config file. Other templates can then use this information to decide whether to create new resources or import existing ones.

To use this feature:

- Create a template that generates a Terraform output containing the desired identifiers, whose structure matches that of the config file. Here's [an example](https://github.com/karmaniverous/metastructure-template/blob/main/src/bootstrap/templates/outputs.hbs).

- Add the template to the relevant workspace's `generators` section in your project config file.

- Run Metastructure with the `--update` flag.

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

### Config Format

TODO

## Handlebars Templates

TODO

### Throwing Exceptions

TODO

## Metastructure In Action

Metastructure is a powerful IDEA, but the tool itself is fairly simple. The real magic is in the templates you create to generate your infrastructure code.

The [Metastructure Template repo](https://github.com/karmaniverous/metastructure-template) aims to provide an enterprise-grade reference infrastructure that can serve as a robust starting point for your own projects.

Stay tuned!

---

See more great templates and other tools on
[my GitHub Profile](https://github.com/karmaniverous)!
