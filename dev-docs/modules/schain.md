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

* **Global Supply Chains**  
  Use this configuration when the Prebid.js implementation is managed by an entity that needs to add an SChain node to every bid request. i.e. payments flow through this entity for all traffic.

* **Bidder-Specific Supply Chains**  
  Use this configuration when one or more bid adapters is an entity (such as a reseller) that requires an SChain node, but other adapters do not require the node. e.g. payments flow through a bidder that doesn't add its own schain node.

## How to Use the Module

{: .alert.alert-warning :}
Since Prebid 10, schain is treated as first party data: this module just copies `schain.config` into `ortb2.source.ext.schain`. You may provide it (or `ortb2.source.schain`) directly, removing the need for this module.
Like other first party data, a bidder-specific schain is merged with the global one, so the bidder receives the global nodes followed by its own. Up to Prebid.js 9, it replaced the global schain instead; since Prebid.js 11.45 you can restore that with `firstPartyData.replaceGlobalSchain`. See [Global and Bidder-Specific Together](#global-and-bidder-specific-together).

First, build the schain module into your Prebid.js package:

```bash
gulp build --modules=schain,...
```

The module performs validations on the schain data provided and makes it available to bidder adapters on the bidRequest object.

### Global Supply Chains

Call `setConfig` with the supply chain object in `schain.config`:

```javascript
pbjs.setConfig({
  "schain": {
    "config": {
      "ver": "1.0",
      "complete": 1,
      "nodes": [
        {
          "asi": "indirectseller.com",
          "sid": "00001",
          "hp": 1
        }
      ]
    }
  }
});
```

### Bidder-Specific Supply Chains

This method uses the `pbjs.setBidderConfig` function, with a syntax similar to the global scenario above. Note the two levels of `config`: the outer one is part of `setBidderConfig`, the inner one is `schain.config`.

```javascript
pbjs.setBidderConfig({
  "bidders": ['bidderA'],   // can list more bidders here if they share the same config
  "config": {
    "schain": {
      "config": {
        "ver": "1.0",
        "complete": 1,
        "nodes": [
          {
            "asi": "bidderA.com",
            "sid": "00001",
            "hp": 1
          }
        ]
      }
    }
  }
});
```

You can find more information about the `pbjs.setBidderConfig` function in the [Publisher API Reference]({{site.baseurl}}/dev-docs/publisher-api-reference/setBidderConfig.html).

{: .alert.alert-warning :}
**Prebid 10 :** You can either use above method or `ortb2.source.schain` property to pass schain. You can read more about passing [First Party Data](https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html#first-party-data). As far as precedence is concerned, `ortb2.source.schain` property takes precedence over the schain config setup via `pbjs.setConfig` using above mentioned method.

### Global and Bidder-Specific Together

Yes, you can set both global and bidder-specific SChain configs. The schain set with `pbjs.setConfig` applies to all your bidders. For the bidders in `pbjs.setBidderConfig`, how the two combine depends on `firstPartyData.replaceGlobalSchain`:

* **By default**, the bidder-specific schain is merged with the global one like other first party data: the bidder receives the global nodes followed by its own. This is useful when every chain starts with the same nodes.
* **With `replaceGlobalSchain: true`** (Prebid.js 11.45 and later), the bidder-specific schain replaces the global one for those bidders. This was the behavior up to Prebid.js 9.

Other bidders receive the global schain either way. This works the same whether you use this module or provide the schain as first party data:

```javascript
pbjs.setConfig({
  ortb2: {
    source: {
      schain: { ver: '1.0', complete: 1, nodes: [{ asi: 'indirectseller.com', sid: '00001', hp: 1 }] }
    }
  }
});

// Prebid.js 11.45+: bidderA receives only its own chain; other bidders receive the global one.
// setConfig replaces the whole firstPartyData object: set this together with any other
// firstPartyData options (such as uaHints) in one call.
pbjs.setConfig({ firstPartyData: { replaceGlobalSchain: true } });

pbjs.setBidderConfig({
  bidders: ['bidderA'],
  config: {
    ortb2: {
      source: {
        schain: { ver: '1.0', complete: 1, nodes: [{ asi: 'bidderA.com', sid: '00001', hp: 1 }] }
      }
    }
  }
});
```

## SChain Config Syntax

{: .alert.alert-warning :}
**Prebid 10 :** Validation will be automatically performed by the **validationFpdModule** if you have included it in your Prebid.js build. If the `skipValidation` parameter is set to true in the validationFpdModule configuration, validation will be skipped. Please visit the [validationFpdModule documentation](https://docs.prebid.org/dev-docs/modules/validationFpdModule.html) for more information.

{: .table .table-bordered .table-striped }
| SChain Param | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| validation (deprecated from Prebid 10) | optional | string | `'strict'`: In this mode, schain object will not be passed to adapters if it is invalid. Errors are thrown for invalid schain object. `'relaxed'`: Errors are thrown for an invalid schain object but the invalid schain object is still passed to adapters. `'off'`: No validations are performed and schain object is passed as-is to adapters. The default value is `'strict'`. | 'strict' |

## Adapter Information

{: .alert.alert-warning :}
**Prebid 10 :** Adapters can read `bidderRequest.ortb2.source.ext.schain` instead of `bidRequest.schain`.

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

* [IAB OpenRTB SupplyChain Object Specification](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/master/supplychainobject.md)
* [Sellers.json Specification](https://iabtechlab.com/sellers-json/)  
