---
layout: page_v2
page_type: module
title: Module - Bid response filter
description: Validates bid's ortb2 data against its meta data
module_code : bidResponseFilter
display_name : Bid Response Filter
enable_download : true
sidebarType : 1

---

# Bid Response Filter

## Overview

This optional module will trigger validation of each bid on the bid response. Validation of a particular bid is based on its `ortb2` values compared to the values in the `bid.meta`. The module configuration allows you to specify whether to enforce validation of particular fields or not. It also lets to specify if the bid should be rejected if selected field metadata value is not present. 

## Configuration

Fields that can be configured:

- `cat` - Banned categories ids
- `adv` - Banned advertiser domains
- `attr` - Banned attributes

### Field configuration object 

{: .table .table-bordered .table-striped }
| Field          | Scope    | Type    | Description                                                                                             | Default |
| -------------- | -------- | ------- | ------------------------------------------------------------------------------------------------------- | ------- |
| `enforce`      | optional | boolean | Specifies whether to enforce validation for the field                                                   | `true`  |
| `blockUnknown` | optional | boolean | Specifies whether it should reject the bid if the corresponding value in the bid metadata is undefined  | `true`  |

### Example module configuration

```javascript
    pbjs.setConfig({
        bidResponseFilter: {
            cat: { 
               blockUnknown: false // setting only one of parameters will keep the other one as default
            },
            adv: { 
               enforce: false 
            },
            attr: { 
               enforce: false, 
               blockUnknown: false
            }
        }
    });
```
