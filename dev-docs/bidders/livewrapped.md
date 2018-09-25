---
layout: bidder
title: Livewrapped
description: Prebid Livewrapped Bidder Adaptor
top_nav_section: dev_docs
nav_section: reference
biddercode: livewrapped
biddercode_longer_than_12: false
hide: true
prebid_1_0_supported : true
media_types: banner
gdpr_supported: true
---

### Note:

The Livewrapped Bidder Adapter requires setup and approval from Livewrapped AB.
Please reach out to <sales@livewrapped.com> for more information.

### bid Params

{: .table .table-bordered .table-striped }
| Name                | Scope    | Description                                                                                                                                                                   | Example                                               | Type             |
|---------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|------------------|
| `adUnitId`          | required | The ad unit ID from Livewrapped. You may identify an ad unitt using the `publisherId` and `adUnitName` instead of an ad unit ID.                                              | `'6A32352E-BC17-4B94-B2A7-5BF1724417D7'`              | `string`         |
| `publisherId`       | optional | The publisher ID from Livewrapped. Must be used with `adUnitName`.                                                                                                            | `'C6E31E93-116B-4040-A185-E7BA621C3799'`              | `string`         |
| `adUnitName`        | optional | The ad unit name from Livewrapped. Must be used with `publisherId`.                                                                                                           | `'panorama_d_1'`                                      | `string`         |
| `userId`            | optional | If a user id is available, pass the id into this parameter.                                                                                                                   | `'user id'`                                           | `string`         |
