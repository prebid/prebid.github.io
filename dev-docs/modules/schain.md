---
layout: page_v2
page_type: module
title: Module - Supply Chain Object
description: Validates Supply Chain object and makes it available to bidder
module_code : schain
display_name : Supply Chain Object
enable_download : true
sidebarType : 1
---

# Supply Chain Object Module

Aggregators who manage Prebid wrappers on behalf of multiple publishers and handle payment on behalf of the publishers need to declare their intermediary status in the Supply Chain Object. As the Supply Chain Object spec prohibits SSPs from adding upstream intermediaries, Prebid requests in this case need to come with the `schain` information.

## How to use the module:

First, build the schain module into your Prebid.js package:
```
gulp build --modules=schain,...
```

Next, in your page, call setConfig with the schain object to be used.  Example:

{% highlight js %}
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
{% endhighlight %}

Another way to setup the schain object can be done through the `pbjs.setBidderConfig` function.  This method would allow you to specify unique schain configs for indiviual bidders; this can be helpful if you have a different relationship with certain bidders and need to represent the schain information differently than normal.  

You can opt to use the `pbjs.setBidderConfig` function in conjunction with the `pbjs.setConfig` function.  When together, the schain config setup via the `pbjs.setConfig` acts as a global config that applies to all your bidders, while the `pbjs.setBidderConfig` overrides the global config for the noted bidder(s).

Below is an example of how this would look:
{% highlight js %}
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

pbjs.setBidderConfig({
  bidders: ['rubicon'],   // can list more bidders here if they share the same config (eg if they had an alias you were using)
  config: {
    schain: {
      "validation": "relaxed",
    "config": {
      "ver":"1.0",
      "complete": 1,
      "nodes": [
        {
          "asi":"myoverride1.com",
          "sid":"00001",
          "hp":1
        }, {
          "asi":"myoverride2.com",
          "sid":"00002",
          "hp":1
        }
      ]
    }
    }
  }
});

pbjs.setBidderConfig({
  bidders: ['appnexus'],
  config: {
    schain: {
      "validation": "off",
    "config": {
      "ver":"1.0",
      "complete": 1,
      "nodes": [
        {
          "asi":"myothersite.com",
          "sid":"00001",
          "hp":1
        }
      ]
    }
    }
  }
});
{% endhighlight%}

You can find more information about the `pbjs.setBidderConfig` function in the [Publisher API Reference]({{site.baseurl}}/dev-docs/publisher-api-reference.html#module_pbjs.setBidderConfig).

### Validation modes
- `strict`: It is the default validation mode. In this mode, schain object will not be passed to adapters if it is invalid. Errors are thrown for invalid schain object.
- `relaxed`: In this mode, errors are thrown for an invalid schain object but the invalid schain object is still passed to adapters.
- `off`: In this mode, no validations are performed and schain object is passed as is to adapters.

### Supply Chain Object

The `config` paramter contains a complete supply object confirming to the [IAB's OpenRTB SupplyChain Object Specification](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/master/supplychainobject.md)

## Adapters Supporting the Schain Module

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

- [IAB's OpenRTB SupplyChain Object Specification](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/master/supplychainobject.md)
- [Sellers.json Specification](https://iabtechlab.com/sellers-json/)  
