---
layout: page_v2
title: Line Item Manager
description: Prebid Line Item Manager Tool
sidebarType: 8
---

# Prebid Line Item Manager

## Introduction

The Prebid Line Item Manager is a command line tool built in Python to aid in creation of line items for Prebid header bidding integrations.
The goal of this tool is to allow publishers to save time, and prevent issues when creating the required Prebid line-item set up manually.

## Installation

**Note:** This tool requires Python 3 to be installed on your machine, and support is for Python>=3.6.

From your command line run:

```
$ pip install line-item-manager
```

**Currently this is not in prod, so please use:**
```
pip install --extra-index-url https://pypi.org/simple -i https://test.pypi.org/simple/ line-item-manager
```

If you already have it installed you can upgrade it using
```
$ pip install --upgrade line-item-manager
```

**Currently this is not in prod, so please use:**
```
pip install --upgrade --extra-index-url https://pypi.org/simple -i https://test.pypi.org/simple/ line-item-manager
```

## Usage

### Configuration file

This tool uses a base (default) configuration as a starting point to create line items. You can create your own version of this and modify the parameters in it to suit your line item requirement. To see what the config file contains, run the command below:
```
$ line_item_manager show config
```
You can look at the full config [here](https://github.com/prebid/line-item-manager/blob/master/line_item_manager/conf.d/line_item_manager.yml). To save time and build on the default config, create a new config file of your own using the following command:
```
$ line_item_manager show config > my_config.yml
```

Once you have your own file you can follow the comments in the file itself to manage the line item creation settings. Options like `granularity`, `sizes`, `mediatypes`, `priority` etc can all be input there. Please ensure you are using YAML syntax to make your updates.

__Note:__ The GAM Network ID, can also be input at runtime and will override the default Network ID in the config file.

## Line Item creation

When you are ready with the config file you can now use the create command to run the tool to create line items.

**Note: You will require at least one modifier (choosing bidder specific set of orders or single set of orders for all bidders)**
```
$ line_item_manager create my_config.yml --[bidder-code|--single-order]
```

### Examples:
```
$ line_item_manager create my_config.yml -b rubicon
```
This would create a set of orders for bidder Rubicon

![Line Item Results 1](/assets/images/tools/line-item-mgmt-img1.png){:class="pb-xlg-img"}

```
$ line_item_manager create my_config.yml -b rubicon -b appnexus -b openx
```

This would create a set of orders for bidders Rubicon, Appnexus and OpenX

![Line Item Results 2](/assets/images/tools/line-item-mgmt-img2.png){:class="pb-xlg-img"}

```
$ line_item_manager create my_config.yml --single-order
```

This would create a single set of orders with bidder agnostic key value targeting

![Line Item Results 3](/assets/images/tools/line-item-mgmt-img3.png){:class="pb-xlg-img"}

### Modifiers for _create_
The create function has certain modifiers that can be used to do dry runs and test runs for line item creation. Here are all the modifiers that can be used:

{: .table .table-bordered .table-striped }

| Modifier | Type | Description |
|----------|------|-------------|
|--network-code | INTEGER | GAM network code, must reconcile with the network name.|
--network-name |TEXT|GAM network name, must reconcile with the network code.|
|-k, --private-key-file |PATH |Path to json GAM credentials file. [default: gam_creds.json; required]
|-s, --single-order||Create a single set of orders instead of orders per bidder. [default: False]
-b, --bidder-code |TEXT |Bidder code may be used multiple times.
-t, --test-run||Execute a limited number of line_items for testing and manual review which will be auto-archived. [default: False]
-n, --dry-run||Print commands that would be executed, but do not execute them. [default: False]
-q, --quiet||Logging is limited to warnings and errors. [default: False]
-v, --verbose||Verbose logging; use multiple times to increase verbosity. [default: False]
--skip-auto-archive||Upon failure or interruption, do NOT auto-archive already created orders. [default:False]

### Commands for _line_item_manager_

{: .table .table-bordered .table-striped }

| Modifier |  Description |
|----------|-------------|
|create|Create line items|
|show|Show resources. Options: "config" or "bidders" |

All commands can use the `--help` modifier to see various options for the command

## Troubleshooting (Coming soon!)

## Git Repository

[https://github.com/prebid/line-item-manager](https://github.com/prebid/line-item-manager)

Contributing code? Found a bug? If you wish to push changes, please create a [Pull Request](https://github.com/prebid/line-item-manager/pulls) so we can review the change and approve. 

Also, if you have a question or want to notify us about something, please create a github [issue](https://github.com/prebid/line-item-manager/issues).
