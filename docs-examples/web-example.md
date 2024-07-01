---
layout: page_v2
title: Web Code Example
description: How web code examples can be written
---

# How to implement code examples for web

The prebid documentation uses bootstrap for styling. Bootstrap offers a [tab component](https://getbootstrap.com/docs/4.6/components/navs/#javascript-behavior).

## Example #1

{% capture htmlCode %}<h4>Hello world</h4>
<div id="ad-slot" class="border border-info bg-white mb-2" 
     style="height:250px; width: 300px">Ad Slot</div>

<button type="button" 
        class="btn btn-primary" 
        onclick="exampleFunction()">Interactive</button>
{% endcapture %}

{% capture jsCode %}console.log('hello world');
function exampleFunction() { 
  alert('hey there'); 
}
{% endcapture %}

{% include code/web-example.html id="hello-world" html=htmlCode js=jsCode %}

## Basic Prebid Example

{% include prebidjs-non-prod.html %}
{% include gptjs.html %}

{% capture htmlCodePrebid %}<h2>Basic Prebid.js Example</h2>
<h5>Div-1</h5>
<div id='div-1'>
  <script type='text/javascript'>
    googletag.cmd.push(function() {
      googletag.display('div-1');
    });
  </script>
</div>
{% endcapture %}

{% capture jsCode %}var sizes = [
  [300, 250]
];
var PREBID_TIMEOUT = 700;

var adUnits = [{
  code: '/19968336/header-bid-tag-1',
  mediaTypes: {
    banner: {
      sizes: sizes
    }
  },
  bids: [{
    bidder: 'appnexus',
    params: {
      placementId: 13144370
    }
  }]
}];

// ======== DO NOT EDIT BELOW THIS LINE =========== //
var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
googletag.cmd.push(function() {
  googletag.pubads().disableInitialLoad();
});

var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

pbjs.que.push(function() {
  pbjs.addAdUnits(adUnits);
  pbjs.requestBids({
    bidsBackHandler: initAdserver
  });
});

function initAdserver() {
  if (pbjs.initAdserverSet) return;
  pbjs.initAdserverSet = true;
  googletag.cmd.push(function() {
    pbjs.setTargetingForGPTAsync && pbjs.setTargetingForGPTAsync();
    googletag.pubads().refresh();
  });
}

setTimeout(function() {
  initAdserver();
}, PREBID_TIMEOUT);

googletag.cmd.push(function() {
  googletag.defineSlot('/19968336/header-bid-tag-1', sizes, 'div-1')
    .addService(googletag.pubads());
  googletag.pubads().enableSingleRequest();
  googletag.enableServices();
});
{% endcapture %}

{% include code/web-example.html id="basic-prebid-example" html=htmlCodePrebid js=jsCode %}

## Instructions

The code you need to for this looks like this

{% raw %}

```liquid
<!-- adding prebid and gpt.js if you need it -->
{% include prebidjs-non-prod.html %}
{% include gptjs.html %}

<!-- storing the code inside a variable makes it a lot more readable -->
{% capture htmlCode %}<div id="ad-slot-div-id">
  <script type='text/javascript'>
    googletag.cmd.push(function() {
      googletag.display('div-1');
    });
  </script>
</div>
{% endcapture %}

{% capture jsCode %}var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
googletag.cmd.push(function() {
  googletag.pubads().disableInitialLoad();
});

var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];


// ... and all the prebid and google initializing code

{% endcapture %}

{% include code/web-example.html id="hello-world" html=htmlCode js=jsCode %}
```

{% endraw %}

There are few things to understand here

1. The `include` directive requires a unique `id` for the page. Otherwise the tabs won't work properly
2. Capturing the code into a variable makes everything a lot more readable

## More information

- [jekyll includes](https://jekyllrb.com/docs/includes/)
- [jekyll includes with parameters](https://jekyllrb.com/docs/includes/#passing-parameter-variables-to-includes)
- [bootstrap tabs](https://getbootstrap.com/docs/4.6/components/navs/#javascript-behavior)
