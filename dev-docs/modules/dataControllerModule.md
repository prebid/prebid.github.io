---
layout: page_v2
page_type: module
title: Data Controller Module
description: Filters the EIDs/SDA being transmitted to bid stream.
module_code : dataControllerModule
display_name : Data Controller Module
enable_download : true
sidebarType : 1
Maintainer: eng-dmp@magnite.com

---


# Data Controller Module

{:.no_toc}

The module attempts to filter/supress the EIDs/SDA being transmitted to bid stream.

The module can be added to the Prebid.js build with this command:

```
gulp build --modules=dataControllerModule
```

## Application Flow

This module is invoked before the start of the auction.
Based on the configuration either EIDs or SDA are filtered/supressed.

## Configuration

{: .table .table-bordered .table-striped }
|  param name | type  | Scope | Description |
 | :------------ | :------------ | :------ | :------ |
 |  filterEIDwhenSDA  | param | required | Filters user EIDs based on SDA. To supress all EID, use '*' as param value. |  
 |  filterSDAwhenEID  | param | required | Filters SDA based on configured EIDs. To supress all SDA, use '*' as param value. |

## Example

```javascript
pbjs.setConfig({
     dataController: {
        filterEIDwhenSDA: ['*'],
        filterSDAwhenEID: ['test.com'] 
     }
 });
```
