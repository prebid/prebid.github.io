---
layout: page_v2
page_type: module
title: Module - Supply Chain Object
description: Validates the Supply Chain object and makes it available to bidders.
module_code : schain
display_name : Supply Chain Object
enable_download : true
sidebarType : 1
---

# Supply Chain Object Module
{:.no_toc}

* TOC
{:toc}

Service Providers who manage Prebid wrappers on behalf of multiple publishers and handle payments to the publishers need to declare their intermediary status in the Supply Chain (a.k.a `SChain`) object. The [IAB OpenRTB SupplyChain Object Specification](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/master/supplychainobject.md) prohibits SSPs from adding upstream intermediaries, so publishers or Prebid.js managed service providers need to specify `schain` information.

Two modes are supported:

- **Global Supply Chains**  
  Use this configuration when the Prebid.js implementation is managed by an entity that needs to add an SChain node to every bid request. i.e. payments flow through this entity for all traffic.

- **Bidder-Specific Supply Chains**  
  Use this configuration when one or more bid adapters is an entity (such as a reseller) that requires an SChain node, but other adapters do not require the node. e.g. payments flow through a bidder that doesn't add its own schain node.

## How to Use the Module

First, build the schain module into your Prebid.js package:
```
gulp build --modules=schain,...
```

The module performs validations on the schain data provided and makes it available to bidder adapters on the bidRequest object.

### Global Supply Chains

Call `setConfig` with the `schain` object to be used:

```javascript
pbjs.setConfig({
  "schain": {
    "validation": "strict",
    "config": {
      "ver":"1.0",
      "complete": 1,
      "nodes": [
        {
          "asi":"indirectseller.com",
          "sid":"00001",
          "hp":1
        }
      ]
    }
  }
});
```

### Bidder-Specific Supply Chains

This method uses the `pbjs.setBidderConfig` function, with a syntax similar to the global scenario above.

```javascript
pbjs.setBidderConfig({
  "bidders": ['bidderA'],   // can list more bidders here if they share the same config
  "config": {
    "schain": {
      "validation": "relaxed",
      "config": {
        "ver":"1.0",
        "complete": 1,
        "nodes": [
          {
            "asi":"bidderA.com",
            "sid":"00001",
            "hp":1
          }
        ]
      }
    }
  }
});
{% endhighlight%}

You can find more information about the `pbjs.setBidderConfig` function in the [Publisher API Reference]({{site.baseurl}}/dev-docs/publisher-api-reference/setBidderConfig.html).

### Global and Bidder-Specific Together

Yes, you can set both global and bidder-specific SChain configs. When together, the schain config setup via `pbjs.setConfig` acts as a global config that applies to all your bidders, while `pbjs.setBidderConfig` overrides the global config for the noted bidder(s).

## SChain Config Syntax

{: .table .table-bordered .table-striped }
| SChain Param | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| validation | optional | string | `'strict'`: In this mode, schain object will not be passed to adapters if it is invalid. Errors are thrown for invalid schain object. `'relaxed'`: Errors are thrown for an invalid schain object but the invalid schain object is still passed to adapters. `'off'`: No validations are performed and schain object is passed as-is to adapters. The default value is `'strict'`. | 'strict' |
| config | required | object | This is the full Supply Chain object sent to bidders conforming to the [IAB OpenRTB SupplyChain Object Specification](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/master/supplychainobject.md). | (See examples above) |

## Adapter Information

Adapters can read the `bidRequest.schain` object and pass it through to their endpoint. The adapter does not need to be concerned about whether a bidder-specific schain was provided; the system will provide the relevant one.

## Adapters Supporting the schain Module

{% assign bidder_pages = site.pages | where: "layout", "bidder" %}

<div class="adapters">
{% for page in bidder_pages %}
  <div class="col-md-4{% if page.schain_supported %} schain_supported{% endif %}">
  {{ page.title }}
  </div>
{% endfor %}
</div>

<script>
$(function(){
  $('.adapters .col-md-4').hide();
  $('.schain_supported').show();
});
</script>

<br style="clear: both">

## Further Reading

- [IAB OpenRTB SupplyChain Object Specification](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/master/supplychainobject.md)
- [Sellers.json Specification](https://iabtechlab.com/sellers-json/)  
