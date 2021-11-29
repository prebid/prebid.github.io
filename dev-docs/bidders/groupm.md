---
layout: bidder
title: GroupM
description: Prebid GroupM Bidder Adaptor
biddercode: groupm
aliasCode: pubmatic
media_types: banner, video, native
gdpr_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
floors_supported: true
userIds: all
prebid_member: true
safeframes_ok: true
pbjs: true
pbs: true
pbs_app_supported: true
fpd_supported: true
gvl_id: 98
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description        | Example                      | Type     |
|---------------|----------|--------------------|------------------------------|----------|
| `publisherId` | required | Publisher ID          | `'32572'`                 | `string` |
| `adSlot`      | optional | Ad Slot Name (see below)| `'38519891'`            | `string` |
| `pmzoneid`    | optional | Zone ID               | `'zone1,zone2'`           | `string` |
| `lat`         | optional | Latitude              | `'40.712775'`             | `string` |
| `lon`         | optional | Longitude             | `'-74.005973'`            | `string` |
| `yob`         | optional | Year of Birth         | `'1982'`                  | `string` |
| `gender`      | optional | Gender                | `'M'`                     | `string` |
| `kadpageurl`  | optional | Overrides Page URL    |  `'http://www.yahoo.com/'`| `string` |
| `kadfloor`    | optional | Bid Floor             | `'1.75'`                  | `string` |
| `currency`    | optional | Bid currency    	   | `'AUD'` (Value configured only in the 1st adunit will be passed on. <br/> Values if present in subsequent adunits, will be ignored.) 				   | `string` |
| `dctr`		| optional | Deal Custom Targeting <br/> (Value configured only in the 1st adunit will be passed on. <br/> Values if present in subsequent adunits, will be ignored.) | `'key1=123\|key2=345'` 	   | `string` |
| `bcat`    | optional | Blocked IAB Categories  <br/> (Values from all slots will be combined and only unique values will be passed. An array of strings only. Each category should be a string of a length of more than 3 characters.) | `[ 'IAB1-5', 'IAB1-6', 'IAB1-7' ]`     | `array of strings` |
| `deals`    | optional | PMP deals  <br/> (Values from each slot will be passed per slot. An array of strings only. Each deal-id should be a string of a length of more than 3 characters.) | `[ 'deal-id-5', 'deal-id-6', 'deal-id-7' ]`     | `array of strings` |
| `outstreamAU`    | optional | Oustream AdUnit described in Blue BillyWig UI. This field is mandatory if mimeType is described as video and context is outstream (i.e., for outstream videos)           | `'renderer_test_groupm'`           | `string` |

GroupM is an aliased bidder of PubMatic

### Prebid Server Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description        | Example                      | Type     |
|---------------|----------|--------------------|------------------------------|----------|
| `publisherId` | required | Publisher ID          | `"32572"`                 | `string` |
| `adSlot`      | optional | Ad Slot Name | `"38519891"`            | `string` |
| `pmzoneid`    | optional | Comma separated zone id. Used im deal targeting & site section targeting. e.g drama,sport| `"zone1,zone2"`           | `string` |
| `dctr`	    	| optional | Deal Custom Targeting, pipe separated key-value pairs| `"key1=123\|key2=345"` | `string` |
| `wrapper` 		| optional | Specifies GroupM openwrap configuration for a publisher | `"wrapper": { "profile": 123, "version": 1}` 	   | `object` |
| `keywords`    | optional | A set of key-value pairs; A key can have one or more values associated with it. They are used in buy-side segment targeting.| `"keywords": { "genre": ["rock", "pop"] }`                | `object`         |



### Prebid Server Test Request

The following test parameters can be used to verify that Prebid Server is working properly with the
GroupM adapter. This example includes an `imp` object with an GroupM test publisher ID, ad slot,
and sizes that would match with the test creative.

```
"imp":[
      {
         "id":“"some-impression-id”,
         "banner":{
            "format":[
               {
                  "w":300,
                  "h":250
               },
               {
                  "w":300,
                  "h":600
               }
            ]
         },
         "ext":{
            "groupm":{
               "publisherId":“156276”,
               "adSlot":"groupm_test"
            }
         }
      }
   ]
```
