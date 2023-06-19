---
layout: page_v2
page_type: module
title: Module - Demand Chain Object
description: Validates the Demand Chain object, provided by bidders, stored in the Prebid bid object.
module_code : dchain
display_name : Demand Chain Object
enable_download : true
sidebarType : 1
---

# Demand Chain Object Module

{:.no_toc}

* TOC
{:toc}

Publishers that interact with bidders that support the [IAB Buyers.json and DemandChain Object Specification](https://iabtechlab.com/buyers-json-demand-chain/) may  ensure the incoming dchain object complies to the IAB specification, as well as automatically representing the Prebid bidder in the buying process.  Including this dchain module can address these concerns and perform the needed tasks automatically for any DChain compliant bidder.

## How to Use the Module

First, build the dchain module into your Prebid.js package:

```
gulp build --modules=dchain,...
```

The module will then automatically perform validations on the dchain data, provided by compliant bidders, stored in the Prebid bid object.  Assuming the object is present and valid, the module will also include a final node to the dchain object to represent the Prebid.js bidder in its part of the process.

## DChain Config Syntax

{: .table .table-bordered .table-striped }
| DChain Param | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| validation | optional | string | `'strict'`: In this mode, dchain object will not be accepted by Prebid.js if it is invalid. Errors are thrown for invalid dchain object. `'relaxed'`: Errors are thrown for an invalid dchain object but the invalid dchain object is still accpeted. `'off'`: No validations are performed and dchain object is accepted as-is. The default value is `'strict'`. | 'strict' |

For example:

```
pbjs.setConfig({
  "dchain": {
    "validation": "strict"
  }
});
```

## Adapter Information

Adapters who choose to support DChain should assign their ad server's IAB compliant dchain config object to the `bid.meta.dchain` field when creating their Prebid.js bidresponse object.  When the module is enabled, this dchain object will be evaluated per the publisher's config settings.

```
bid.meta.dchain: {
  "complete": 0,
  "ver": "1.0",
  "ext": {...},
  "nodes": [
  ...,
  {
    "asi": "domain.com",
    "bsid": "123",
    "name": "companyname",
    ...
  },
  ...]
}
```

## Adapters Supporting the dchain Module

{% assign bidder_pages = site.pages | where: "layout", "bidder" %}

<div class="adapters">
{% for page in bidder_pages %}
  <div class="col-md-4{% if page.dchain_supported %} dchain_supported{% endif %}">
  {{ page.title }}
  </div>
{% endfor %}
</div>

<script>
$(function(){
  $('.adapters .col-md-4').hide();
  $('.dchain_supported').show();
});
</script>

<br style="clear: both">

## Further Reading

* [IAB Buyers.json and DemandChain Object Specification](https://iabtechlab.com/buyers-json-demand-chain/)
