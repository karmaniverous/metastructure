# Metastructure

Metastructure is a command-line tool that can generate & manage a complex AWS infrastructure, DevOps pipeline, etc., with a single YAML config file and a handful of Handlebars templates.

## The Trouble With Terraform

[Terraform](https://www.terraform.io/) encapsulates the [AWS Cloud Control API](https://aws.amazon.com/cloudcontrolapi/). Also other cloud providers, but for now Metastructure focuses on AWS.

This encapsulation isn't perfect, but it is VERY good. When you use Terraform, you rarely have to think about the underlying API calls. Linter & IDE support allow you to focus on the Terraform code as if it were the only thing that mattered. Think TypeScript: you rarely have to think about the underlying JavaScript!

There are some issues, though:

- Terraform isn't particularly [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself). Especially in a multi-account setup like [AWS Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html), many code blocks will be nearly identical, but NOT so identical that they can be modularized.

- [Terraform iterators](https://developer.hashicorp.com/terraform/cdktf/concepts/iterators) are limited, especially when there are dependencies between iterated sets. Also, once a resource is part of an iterated set, it is ALWAYS part of that set. If you make any significant changes to your architecture, migrating existing resources is a thorny problem.

- A [third-party Terraform module](https://registry.terraform.io/browse/modules) encapsulates code but is very much a black box. When they work, they're great. But when they don't, it's very hard to understand what is going on under the hood. Once a set of resources is encapsulated in a module, it is almost impossible to move those resourecs to a different module.

None of this matters much in a lab environment where you can tear down and rebuild your infrastructure at will. But in a production environment, where changes are often not reversible, these limitations can be a real headache.

And in an ENTERPRISE environment—with multiple interdependent accounts, centralized services, and complex compliance requirements—these limitations can be such a nightmare that infrastructure development just grinds to a halt.

### Terragrunt, Terraspace, etc.

[Terragrunt](https://terragrunt.gruntwork.io/), [Terraspace](https://terraspace.cloud/), and the like are all great tools that operate differently to DRY up Terraform code and encapsulate away some of the issues listed above. But they also all present their own challenges:

- They're _DRYer_, but they aren't **_DRY_**. When your code is DRY, you don't have to think about maintaining dupes, ever. When it isn't, you do. That's fundamental, and **close just doesn't count**.

- They're often opinionated as to project structure and other conventions. This is great when you're starting a new project, but it can be a real headache when you're trying to integrate them into an existing project alongside other tools that are ALSO opinionated.

- The more Terraform is encapsulated, the less it is exposed to the very ecosystem of linters, IDE integrations, and other tools that made it SAFE to encapsulate the AWS API in the first place. If you write bad Terraform code, you can see what's going on. If you write bad Terragrunt code, you're often flying blind!

### Metastructure to the Rescue

Metastructure addresses Terraform's issues from a different direction.

---

**Where other tools use an improved syntax & structure to ENCAPSULATE Terraform code, Metastructure uses a powerful set of templating features to GENERATE Terraform code.**

---

Once you've generated your code, there it is: Terraform code, in all its WET glory! (You know: not DRY. 🤣) It leverages whatever features you built into your templates, and is hooked into the same linters & IDE extensions you already use.

BUT...

- You can make changes to your DRY templates & regenerate your WET code at will.

- You can drive multiple workspaces from single, coherent YAML config file.

- You can use the same config to drive the generation of related assets like GitHub Actions workflows, Dockerfiles, etc.

**_Do you need to create unique resources that are intrinsically DRY?_** No problem, and no template required: just write boring old Terraform code, which can live right alongside the Metastructure output and still leverage much of its configuration.

**_Do you need to deploy to multiple accounts and manage authentication profiles in an SSO environment?_** No problem: when you run `terraform apply` THROUGH Metastructure, it will generate appropriate providers, get you authenticated, and deploy resources to EVERY account with a SINGLE command.

Despite its power, Metastructure is a very simple tool. It doesn't try to replace or encapsulate Terraform, and it doesn't impose any particular structure on your project beyond the relationships already intrinsic to things like accounts, OUs, and SSO permission sets.

Instead, Metastructure provides:

- A unifed config file format.

- A supercharged Handlebars template engine.

- A CLI that intelligently parses your project configuraton and generates WHATEVER MAKES SENSE from your templates.

The true magic of Metastructure is in your templates, which are really just the code you were going to write anyway... only DRY as a bone and driven by a common config because, at long last, you CAN.

See the [Metastructure Template](https://github.com/karmaniverous/metastructure-template) repo for a working example of a Metastructure project!

## Getting Started

Metastructure is a Node.js package, so you'll need to have Node.js installed on your system. You can download it [here](https://nodejs.org/) or MUCH better use [NVM](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/).

Metastructure expects your Terraform project to be embedded in an NPM package. For best results, just [clone the Metastructure Template](https://github.com/new?template_name=metastructure-template)!

If you like, you can install Metastructure as a dev dependency:

```bash
npm i -D metastructure
```

... in which case you would run it like `npx metastructure...`. That's what you will see in the [Metastructure Template](https://github.com/karmaniverous/metastructure-template) repo.

Otherwise, you'll want to install it as a global dependency:

```bash
npm i -g metastructure
```

In this README, for the sake of simplicity, we'll assume a global installation.

## Assumptions

Metastructure assumes you are building an [AWS Organization](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html) secured by [IAM Identity Center](https://aws.amazon.com/iam/identity-center/) single sign-on (SSO). You CAN do other things—in fact you HAVE to, to bootstrap a project—but in the long term, you shouldn't.

If you build your project according to the [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html), then Metastructure will serve you well.

## Project Structure

Metastructure is agnostic about your project structure, with these exceptions...

### .metastructure.yml

Note the dot at the beginning of the filename.

This file must be located in your project root. It contains a single YAML object that looks like this:

```yaml
configPath: src/metastructure.yml
```

The purpose of this file is to tell Metastructure where to find your project configuration file, which you can name whatever you like and put wherever you want. The path is relative to the project root, and doesn't even have to be in the same project!

For example, to support testing this repository has a [`.metastructure.yml`](./.metastructure.yml) file that points to a config file in the [Metastructure Template](https://github.com/karmaniverous/metastructure-template) repo.

When you run Metastructure, it looks for a `.metastructure.yml` file in the current directory's project root, which points to a config file as described above. All subsequent activity will take place in that config file's project directory.

If your project doesn't have a `.metastructure.yml` file, you can specify your config file location at the command line using the `-c` or `--config-path` flag. If you do neither, Metastructure will be unable to locate your project config file and will throw an error.

### Project Config File

As described above, `.metastructure.yml` points to a project config file, which can have any name you like and may not even be in the same project.

The structure of this file is laid out in the [Metastructure Config](#metastructure-config) section below. Any file paths contaned in this file should be relative to its own project root.

### license-checker-config.json

PCI and other compliance standards require that all code files contain a licensing header.

Metastructure is optionally integrated with the [`license-check-and-add`](https://www.npmjs.com/package/license-check-and-add) package, which will place a licensing header as a properly-formatted comment at the top of each generated file (in fact all non-excluded files in your project directory).

If you choose to use this feature, place a `license-checker-config.json` file in your project root and point it at a license file somewhere in your project.

This package is a little quirky, particularly in how it processes ignore patterns, but it's the best solution I've found that supports configurably managing license headers across multiple file formats. If you have a better idea, [please share](https://github.com/karmaniverous/metastructure/discussions)!

See the [Metastructure Template](https://github.com/karmaniverous/metastructure-template) repo for a working example.

## Running Metastructure

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
  -r, --assume-role <string>     Role to assume on target accounts (requires
                                 --aws-profile, conflicts with
                                 --permission-set).
  -p, --aws-profile <string>     AWS profile (requires --assume-role, conflicts
                                 with --permission-set).
  -s, --permission-set <string>  SSO permission set (conflicts with
                                 --assume-role & --aws-profile).
  -L, --local-state-on           Use local state (conflicts with -l).
  -l, --local-state-off          Use default state (conflicts with -L).
  -c, --config-path <string>     Config file path relative to CWD. Defaults to
                                 location specified in .metastructure.yml.
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

#### Config Recursion

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

Each `workspace` defined in your project config file contains an optional `generators` object. If present, each key of this object should specify a file path relative to the project root, and the associated value should specify the location of a Handlebars template, also relative to the project root.

When you run Metastructure with the `-g` or `--generate` flag, it will generate (or replace) the files specified in the `generators` keys by processing the associated Handlebars templates with the expanded project config data object for the workspace provided with the `-w` or `--workspace` flag.

To visualize this data object, use the `-d` or `--debug` flag when running Metastructure.

Neither templates nor destination files need be located in any specific directory, so it is perfectly reasonable to collect global templates in a common directory and reference them from multiple workspaces. This is the approach taken in the [Metastructure Template repo](https://github.com/karmaniverous/metastructure-template).

See the [Handlebars Templates](#handlebars-templates) section below for more information on how to write templates.

### Authenticated Execution

There are two ways use Metastructure to generate AWS credentials, depending how your [CLI overrides](#cli-overrides) resolve.

If `assume_role` and `aws_profile` are populated, then Metastructure will attempt to authenticate with the indicated profile from your local [AWS credentials file](https://docs.aws.amazon.com/cli/v1/userguide/cli-configure-files.html). These credentials will generally take the form of an AWS Access Key Id and an AWS Secret Access Key. Once authenticated, Metastructure will attempt to assume the indicated role. It is up to you to ensure that the credentials you provide have the necessary permissions to assume that role on all affected accounts.

If `permission_set` is populated, then there are a few more moving parts, which are best understood using the Metastructure Template repo as an example:

- The [`shared_config template`](https://github.com/karmaniverous/metastructure-template/blob/main/src/templates/shared_config.hbs) generates an SSO credentials config file at the location specified in your project config file at `workspaces.<workspace>.shared_config_path`.

- Metastructure leverages this file to launch a browser window initiate the SSO login process. You should log in as a user that has access to the indicted permission set.

- The [backend](https://github.com/karmaniverous/metastructure-template/blob/main/src/templates/backend.hbs) and [providers](https://github.com/karmaniverous/metastructure-template/blob/main/src/templates/providers.hbs) templates leverage the same shared config file to provide access to your Terraform state and account resources. [`GH-6`](https://github.com/karmaniverous/metastructure/issues/6)

These steps assume code generation has taken place in the indicted workspace with a `permission_set` CLI argument in effect! Otherwise, the shared config file will not be populated, and the `backend` and `providers` files will be configured for key credential access rather than SSO.

So: if you are shifting from key credential access to SSO (which will happen as you bootstrap a new project), you MUST run Metastructure at least once with the `-g` or `--generate` flag in order to generate the required SSO configurations.

In practice, it is not unreasonable to run Metastructure with the `-g` or `--generate` flag all the time, unless you have a compelling reason not to. Any unexpected changes will show up in version control, so you can deal with them immediately.

In any case, when Metastructure is invoked with a command argument, that command will run within the context of the AWS session generated by the above process.

Consider this command:

```bash
metastructure -w bootstrap -g -u terraform apply
```

Assuming you already have either a `permission_set` or `assume_role` and `aws_profile` configured in `cli_defaults`, the above command below will:

- Generate the Terraform code for your `bootstrap` workspace.

- Establish an AWS session.

- Deploy your code to all accounts in your project.

- Update your project config with identifiers as described in [Config Updates](#config-updates) below.

### Config Updates

When you run Metastructure with the `-u` or `--update` flag, Metastructure will merge the output of the current Terraform workspace with the contents of the config file.

The main purpose of this feature is to write identifiers of key resources (like accounts & OUs) back to the config file. Other templates can then use this information to decide whether to create new resources or import existing ones.

To use this feature:

- Create a template that generates a Terraform output containing the desired identifiers, whose structure matches that of the config file. It's ok to leave out irrelevant keys. Here's [an example](https://github.com/karmaniverous/metastructure-template/blob/main/src/bootstrap/templates/outputs.hbs).

- Add the template to the relevant workspace's `generators` section in your project config file.

- Run Metastructure with the `-u` or `--update` flag.

## Metastructure Config

Your Metastructure project config serves several purposes:

- It records key global variables like Terraform versions & state configuration.

- It defines key project entities, like AWS accounts & organizational units, applications, and environments, as well as the relationships between them.

- It records key project entity identifiers as described in [Config Updates](#config-updates) below.

- It defines your SSO groups, permission sets, and policies, as well as their respective account relationships.

- It defines your Terraform workspaces and the files to be generated via Handlebars template for each workspace.

- It defines any other data elements that you want to use in your Handlebars templates.

Wherever possible, the config file format will accept data in a condensed form. See [Format Expansion](#format-expansion) above for more information.

Metastructure validates defined elements to ensure relational consistency. For example, it will validate that the account key assigned to an application environment actually exists. Feel free to create new elements of any complexity as you see fit, anywhere in the config file. Just know that validating the internal consistency of these elememts is up to you! See `throwif` in [Handlebars Helpers](#handlebars-helpers) below for more information.

### Config Schema

For you motivated developers, the Metastructure Config schema (a [Zod](https://github.com/colinhacks/zod) schema) and the associated Typescript type, as well as all schema validations and expansions, are defined in [this source file](./src/Config.ts).

For everybody else, please explore the [Metastructure Template repo project config file](https://github.com/karmaniverous/metastructure-template/blob/main/src/metastructure.yml). This is a working implementation and tracks current development, so it's a great example to follow!

The sections below briefly describe each section of the config file.

**_REMEMBER: You can add any data you like to your config file, anywhere you like, and use it in your Handlebars templates!_**

#### `organization`

This section defines values that apply globally across your AWS Organization. It contains the following significant keys:

`id` is the AWS Organization ID. AWS Organizations must be created through the AWS Management Console, so you will need to enter this value manually, and your Organization will be imported into Terraform.

`key_accounts` is an object whose keys identify key functional roles within your organization and whose values identify the accounts that play them. For example, consider the following snippet:

```yml
organization:
  key_accounts:
    master: master
    terraform_state: shared_services
```

This indicates that the the account with key `master` plays the master account role in your organization, and the account with key `shared_services` houses your Terraform state.

If your templates are suitably generic, this gives you the ability to assign key roles to accounts in your configuration, without having to make any template changes.

`tokens` is an object whose keys are used as tokens in your templates. For example, consider the following snippet:

```yml
organization:
  tokens:
    namespace: metastructure-001
accounts:
  dev:
    email: karmaniverous+{{#if organization.tokens.namespace}}{{organization.tokens.namespace}}-{{/if}}dev@gmail.com
```

Thanks to the [Config Recursion](#config-recursion) feature described above, the `dev` account email will resolve to `karmaniverous+metastructure-001@gmail.com`.

Organization tokens can be used throughout your configuration to provide a single source of truth for values that are used in multiple places.

#### `accounts`

This section identifies the AWS accounts in your organization. Each account is defined by a key, which is used to reference the account in other parts of the configuration, and a value, which is an object that defines the account's properties.

Each account object contains the following significant keys:

`id` is the AWS account id. If you add this value manually, Terraform will attempt to import your account and add it to your Organization. It's up to you to ensure the account and your permissions are properly configured to support this operation!

If your project follows the [Metastructure Template](https://github.com/karmaniverous/metastructure-template) pattern, `id` will be populated when you perform a [Config Update](#config-updates).

If `id` is populated and you add `action: remove` to the account object, when you run `terraform apply` the account will be removed from your Terraform state and your Organization. If you add `action: destroy`, the account will be removed from your Organization and destroyed. As always, this assumes you have already met the necessary conditions to perform these operations!

`name` is the name of the account. This is used in the AWS Management Console and in other places where human-readable account names are required.

`email` is the email address to be associated with the account. Metastructure validates that each account has a unique email, and remember that AWS requires every account to have a globally unique email address, which can't be reused on another account.

`organizational_unit` is optional, and is the key of the OU to which the account belongs. This key must match the key of an OU in the [`organizational_units`](#organizational_units) section. To move an account to a new OU, simply update this value, regenerate your code & run `terraform apply`!

#### `organizational_units`

This section identifies the Organizational Units (OUs) in your organization. Each OU is defined by a key, which is used to reference the OU in other parts of the configuration, and a value, which is an object that defines the OU's properties.

Each OU object contains the following significant keys:

`id` & `action` work just like their `account` counterparts. See the [`accounts` section](#accounts) above for details.

`name` is the name of the OU. This is used in the AWS Management Console and in other places where human-readable OU names are required.

`parent` is optional, and is the key of the parent OU. This key must match the key of another OU in the same section. To move an OU to a new parent, simply update this value, regenerate your code & run `terraform apply`!

#### `sso`

This section defines the SSO groups, permission sets, and SSO-related policies in your organization.

The SSO section contains the following significant keys:

`start_url` is the URL of the AWS SSO login page. This is used by the shared config template to generate the SSO credentials file.

`groups` is an object whose properties define the SSO groups in your organization. Each group is defined by a key, which is used to reference the group in other parts of the configuration, and a value, which is an object that defines the group's properties.

There's some special expansion behavior here that is best illustrated by example:

```yaml
sso:
  groups:
    # This is the key used to reference the SSO Group in other parts of the configuration.
    terraform_admin:
      # These are the SSO Group name & description that appear in the IAM Identity Center console.
      name: TerraformAdmin
      description: Terraform administrators can create & manage all resources in all accounts.
      # These are the keys of the SSO Permission Sets (see below) assigned to the SSO Group. In this example, the terraform_admin permission set will be assigned to all accounts.
      account_permission_sets: terraform_admin
    audit_reader:
      name: AuditReader
      # In this example, both of the indicated permission sets will be assigned to all accounts.
      account_permission_sets:
        - audit_log_reader
        - app_log_reader
    non_prod_audit_reader:
      name: NonProdAuditReader
      # In this example, both of the indicated permission sets will be assigned to the designated accounts.
      account_permission_sets:
        dev:
          - audit_log_reader
          - app_log_reader
        test:
          - audit_log_reader
          - app_log_reader
```

`permission_sets` is an object whose properties define the SSO permission sets in your organization. Each permission set is defined by a key, which is used to reference the permission set in other parts of the configuration, and a value, which is an object that defines the permission set's properties.

The point of this section is to connect permission sets with assigned policies in the relevant accounts. It's up to you and your templates to actually CREATE those policies using the expanded config object. See the Metastructure Template repo's [bootstrap workspace SSO template](https://github.com/karmaniverous/metastructure-template/blob/main/src/bootstrap/templates/sso.hbs) for a working example.

Here's an annotated example of this section:

```yml
sso:
  permission_sets:
    # This is the key used to reference the SSO Permission Set in other parts of the configuration.
    terraform_admin:
      # These are the SSO Permission Set name & description that appear in the IAM Identity Center console.
      name: TerraformAdmin
      description: Permits creation & management of all resources.
      # These are the keys of the AWS IAM Policies (see below) assigned to the SSO Permission Set. IMPORTANT: AWS Managed Policies (like AdministratorAccess below) should be referenced by name.
      policies:
        - AdministratorAccess
        - sso_terraform_state_writer
```

`policies` is an object whose keys represent the user-defined IAM Policies that will support SSO in each relevant account, and whose value represents the name of that policy. Only user-defined policies should be referenced here. AWS Managed Policies should be referenced by name in the `permission_sets` section.

#### `applications`

This section defines the applications that your organization uses, the environments each application runs in, and the accounts that host those environments.

The `applications` section is a little lean at the moment: Metastructure evaluates it for referential integrity, but it is not yet consumed by any templates in the Metastructure Template repo.

More to come!

#### `terraform`

This section defines global values that apply specifically to Terraform and Terraform state.

Mostly its keys are consumed by templates, notably to generate [backend](https://github.com/karmaniverous/metastructure-template/blob/main/src/templates/backend.hbs) & [provider](https://github.com/karmaniverous/metastructure-template/blob/main/src/templates/providers.hbs) resources.

The one important exception to this is the `paths` key, which is used to define the path or paths (if you use an array) to your Terraform state files. Metastructure invokes Terraform to format the files in these paths after it generates code from your templates.

#### `workspaces`

This is where the magic happens!

Each key in the `workspaces` object is the name of a Terraform workspace. Each value is an object that defines the workspace's properties. These objects have the following significant properties:

`cli_defaults` sets global CLI defaults for the workspace. See [CLI Overrides](#cli-overrides) above for more information.

`cli_defaults_path` is the path (relative to the project root) to a local YAML file that contains CLI overrides for the workspace. See [CLI Overrides](#cli-overrides) above for more information.

`path` identifies the path (relative to the project root) to the current working directory to be used when running Terraform for this workspace.

`shared_config_path` is the path (relative to the project root) to the shared config file that will be used by backend & provider files for SSO authentication. [GH-6](https://github.com/karmaniverous/metastructure/issues/6)

`generators` is an object whose keys identify the files to be generated by the workspace and whose values identify the Handlebars templates to be used to generate them. Both sets of paths should be expressed relative to the project root.

## Handlebars Templates

[Handlebars](https://handlebarsjs.com/) is a powerful template engine that was developed to support dynamic HTML generation in web applications.

A Handlebars template is driven by a data object (like your [expanded config object](#config-expansion)) and can generate ANY kind of text... including Terraform code!

In a Metastructure project, Metastructure's job is to generate this expanded data object from your project config file and present it to your templates. YOUR job is to write DRY, compact Handlebars templates that consume this data object & generate the code you need!

### Handlebars Helpers

Vanilla Handlebars expresses only a limited set of logical and data operations, FAR less capability than Metastructure requires!

Fortunately, Handlebars is easily extensible, so Metastructure includes an enhanced handlebars variant with a VERY powerful set of helper functions!

Note that Handlebars helpers are composable, so you can use them together to create complex logic in your templates.

Here are some examples:

- [`lodash`](https://github.com/karmaniverous/handlebars?tab=readme-ov-file#lodash--numeral) exposes the entire [Lodash](https://lodash.com/) library to your templates.

- [`params`](https://github.com/karmaniverous/handlebars?tab=readme-ov-file#params) converts a set of Handlebars parameters into an array that can be consumed by a `lodash` helper.

- [`logic`](https://github.com/karmaniverous/handlebars?tab=readme-ov-file#logic) provides the boolean logic functions that are missing from vanilla Handlebars and can easily be combined with `lodash` comparison function like `eq` and `isEqual`.

- [`ifelse`](https://github.com/karmaniverous/handlebars?tab=readme-ov-file#ifelse) provides a [ternary operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator).

- [`json2tf`](https://github.com/karmaniverous/handlebars?tab=readme-ov-file#json2tf) converts a JSON object into a Terraform literal. The Metastructure Template repo's global module [outputs template](https://github.com/karmaniverous/metastructure-template/blob/main/src/modules/global/outputs.hbs) uses this function to expose your entire project config directly to your Terraform code!

- [`namify`](https://github.com/karmaniverous/handlebars?tab=readme-ov-file#namify) transforms a string to force it into compatibility with a given naming convention (e.g. an S3 bucket name).

- [`throwif`](https://github.com/karmaniverous/handlebars?tab=readme-ov-file#throwif) will throw an exception if its condition is met, halting template generation & presenting an error message in your console.

## So What Next?

This VERY long README doesn't seem to tell the whole story, does it?

Metastructure is a powerful IDEA, but the tool itself is fairly simple. The real magic is in the templates you create to generate your infrastructure code.

The [Metastructure Template repo](https://github.com/karmaniverous/metastructure-template) aims to provide an enterprise-grade reference infrastructure that can serve as a robust starting point for your own projects.

At the moment...

- I'm adding a critical mass of key features to the Metastructure Template repo to make it a more useful reference. At a minimum this will include the existing SSO implementation, full cross-account CloudWatch audit logging, and a GitHub Actions-based DevOps pipeline.

- I'm developing a course on Udemy to present Metastructure and work organically through the process of developing the Metastructure Template repo.

So stay tuned!

## I Love Metastructure! How Can I Help?

You are AWESOME! 👊

The best way to help is to clone the [Metastructure Template Repo](https://github.com/karmaniverous/metastructure-template) and start building your own infrastructure with it! I'd be delighted to help you create new generic patterns and features that can be added to the template implementation.

---

See more great templates and other tools on
[my GitHub Profile](https://github.com/karmaniverous)!
