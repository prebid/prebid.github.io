---
layout: bidder
title: Etarget
description: Prebid Etarget Bidder Adaptor 

top_nav_section: dev_docs
nav_section: reference

hide: true

biddercode: etarget

biddercode_longer_than_12: false

prebid_1_0_supported : true
media_types: banner, video
gdpr_supported: true
---


### bid params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example |
| :--- | :---- | :---------- | :------ |
| `refid` | required | Placement ID | `12345` |
| `country` | required | Country domain | `1` |
| `options` | optional | Additional data | `{site:'example.com'}` |

#### First Party Data

In release 5.0 and later, publishers should use the `ortb2` method of setting First Party Data. The following fields are supported:
- ortb2.site.ext.data.*
- ortb2.site.keywords
- ortb2.site.content.data[]
- ortb2.user.ext.data.*
- ortb2.user.data[]

With regards to Contextual and Audience segments, the Magnite exchange supports the IAB standard taxonomies. See [the segment management user guide](https://resources.rubiconproject.com/resource/publisher-resources/segment-management-user-guide/) for more information.

Example first party data that's available to all bidders and all adunits:
```
pbjs.setConfig({
  ortb2: {
    site: {
      keywords: "kw1,kw2",            
      ext: {
        data: {
           prodtype: ["tech","mobile"] 
        }
      }
    },
    user: {
      ext: {
        data: {
          ucat:["new"]                 
        }
      }
    }
  }
};
```

Example of first party data available only to the ETARGET bidder. Applies across all ad units.
```
pbjs.setBidderConfig({
  bidders: ["etarget"],
  config: {
    ortb2: {
      site: {
        keywords: "kw1,kw2",             
        ext: {
          data: {
            prodtype: ["tech","mobile"]  
          }
        }
      },
      user: {
        ext: {
          data: {
            ucat:["new"]                 
          }
        }
      }
    }
  }
};
```
