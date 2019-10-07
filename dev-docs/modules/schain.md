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
