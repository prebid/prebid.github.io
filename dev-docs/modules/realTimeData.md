---
layout: page_v2
page_type: module
title: Module - Real Time Data
description: Infrastructure for supporting real-time data modules
module_code : rtd
display_name : Real Time Data
enable_download : true
sidebarType : 1
---

# Real Time Data Module
{:.no_toc}

* TOC
{:toc}

## Overview

The Real Time Data (RTD) module doesn't do anything on its own, but rather provides
the technical basis for sub-modules that call out for various types of data
that can be used by bidders or the ad server.

{: .table .table-bordered .table-striped }
| Real Time Data Sub-Module              | Description  |
|---------------------+--------------|
| Browsi | Viewability prediction module | 

## How It Works

1. The publisher builds Prebid.js with the optional Real Time Data module and the specific ID sub-module they would like to include. e.g. "gulp build --modules=realTimeData,browsiRtdProvider"
1. The page defines User ID configuration in `pbjs.setConfig()`
1. When `setConfig()` is called, the sub-module is invoked, which may result in a call to a real-time data endpoint.
1. If the option to delay the auction is enabled, Prebid.js will wait up to the supplied time limit before starting the auction.

## Real Time Data, GDPR, and Opt-Out

## Basic Configuration

By including this module and one or more of the sub-modules, new options become available in `setConfig()`,
all of them under the `realTimeData` object. The table below has the options that are common across sub-modules. See the sections below for specific configuration needed by each system and examples.

{: .table .table-bordered .table-striped }
| Param under usersync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | May be: `"unifiedId"`, `"pubCommonId"`, `"digitrust"`, `"id5id"` or `identityLink` | `"unifiedId"` |
| params | Based on User ID sub-module | Object | | |

## Browsi

## Further Reading

* [Prebid.js Usersync](/dev-docs/publisher-api-reference.html#setConfig-Configure-User-Syncing)
* [GDPR ConsentManagement Module](/dev-docs/modules/consentManagement.html)
* [DigiTrust Module Usage and Configration](/dev-docs/modules/digitrust.html)
