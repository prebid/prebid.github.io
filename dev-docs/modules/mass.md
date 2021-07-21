---
layout: page_v2
page_type: module
title: Module - MASS
description: Enable MASS protocol for Prebid
module_code : mass
display_name : MASS
enable_download : true
sidebarType : 1
---

# MASS Module
{:.no_toc}

* TOC
{:toc}

## Overview

This module enables the MASS protocol for Prebid. To use it, you'll need to
work with a MASS enabled provider.

This module scans incoming bids for the presence of a "mass" flag being set to 
true in the bid meta or a publisher specified DealID pattern and uses 
external resources to decypher and process the MASS:// URI found within the ad markup.
This modules is designed to work with MASS enabled Exchanges and DSP's.

This module only loads external JavaScript resources if the publisher ad server has 
selected a MASS enabled bid as a winner. 

Find out more [here](https://massplatform.net).

{: .alert.alert-warning :}
## Disclosure

This module loads external JavaScript to render creatives

## Custom Mode

You can specify your own `dealIdPattern` and `renderUrl` by adding one or more entries into the `custom` configuration option (see [Configuration Parameters](#configuration-parameters) below). When specifying a custom renderer, quality assurance is your responsibility.

## Integration

Build the MASS module into the Prebid.js package with:

```
gulp build --modules=mass,...
```


## Module Configuration

```js
pbjs.que.push(function() {
  pbjs.setConfig({
    mass: {
      enabled: true,
      renderUrl: 'https://cdn.massplatform.net/bootloader.js',
      dealIdPattern: /^MASS/i,
      custom: [
        {
          dealIdPattern: /xyz/,
          renderUrl: 'https://my.domain.com/render.js',
          namespace: 'xyz'
        }
      ]
    }
  });
});
```

### Configuration Parameters

|Name |Type |Description |Notes |
| :------------ | :------------ | :------------ |:------------ |
|enabled | Boolean |Enable/disable the module |Defaults to `true` |
|dealIdPattern | RegExp |The pattern used to identify MASS deal IDs |Defaults to `/^MASS/i` |
|renderUrl | String |The MASS render script to load |`https://cdn.massplatform.net/bootloader.js` |
|custom | Array |Add custom renderers | |
|custom[].dealIdPattern | RegExp |A pattern used to identify matching deal IDs |Either this parameter or `custom[].match` must be specified |
|custom[].renderUrl | String |The render script to load |Either this parameter or `custom[].render` must be specified |
|custom[].namespace | String |The namespace (i.e.: object) created on `window` to pass parameters to the render script |Required with `custom[].renderUrl` |
|custom[].match | Function(bid) |A custom function to identify matching bids |Either this parameter or `custom[].dealIdPattern` must be specified |
|custom[].render | Function(payload) |A custom function to render the matchig/winning bid |Either this parameter or `custom[].renderUrl` must be specified. The `payload` parameter contains: `payload.bid`, `payload.bidRequest`, `payload.adm` |

### Example Configurations

### Only (official) MASS support enabled

```js
pbjs.que.push(function() {
  pbjs.setConfig({
    mass: {
      renderUrl: 'https://cdn.massplatform.net/bootloader.js'
    }
  });
});
```

### MASS support disabled, custom renderer enabled

```js
pbjs.que.push(function() {
  pbjs.setConfig({
    mass: {
      custom: [
        {
          dealIdPattern: /xyz/,
          renderUrl: 'https://my.domain.com/render.js',
          namespace: 'xyz'
        }
      ]
    }
  });
});
```

### Custom `match` and `render`

```js
pbjs.que.push(function() {
  pbjs.setConfig({
    mass: {
      custom: [
        {
          match: function(bid) {
            // return true/false if matching/non-matching bid
          },

          render: function(payload) {
            console.log(payload);
          }
        }
      ]
    }
  });
});
```

## Integration Example

There are two options to view the integration example:

### Option 1 - Your own development environment
To view the integration example:
 
1) in your cli run:

```
gulp serve --modules=ixBidAdapter,mass
```

2) in your browser, navigate to:

```
http://localhost:9999/integrationExamples/mass/index.html
```

### Option 2 - Hosted online
Mass Platform Limited hosts an official integration and demo page that can be accessed using the following link: http://demo.massplatform.com/ix/prebid/

## Testing MASS
Testing requires valid bids to be returned to Prebid. To assist with this process, we recommend to use the MASS Bid Simulation tool found at https://github.com/massplatform/bidsim. Your Exchange partner might be able to assist you with other specialist tools and browser plugins to achieve similar resuls.

The instructions below assume that you have followed the installation instructions for the MASS Bidsim tool found at https://github.com/massplatform/bidsim/blob/master/README.md.

### Testing using MASS compliant tags
The bidsim tool ships with working DSP example tags that can be found under the bidsim/tags folder.

A quick way to test the Integration test page in combination with the official bootloader is to use one of the following command:
```
node bidsim --inject --bid 2000 --width 300 --height 250 --dealid 'MASS' --tag "tags/inskin-housead-desktop.js" -o https://demo.massplatform.net/ix/prebid
```
### For third-party technology companies
Third-parties that wish to integrate with the official MASS bootloader can get started by running the following command:
```
node bidsim --inject --bid 2000 --width 300 --height 250 --dealid 'MASS' --tag "tags/test.js" -o https://demo.massplatform.net/ix/prebid
```

Explanation: The tags/test.js tag calls a reference endpoint for developer that can be accessed here: https://demo.massplatform.net/reference/endpoint.js.
When running the above command to invoke this reference endpoint, you will see all the params that MASS collected and passed onto your endpoint. This includes inputs, parsed inputs, tag parameters and MASS/Provider specific configuration.
