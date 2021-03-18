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

- This module loads external JavaScript to render creatives

## Generic Mode
- You can specify your our own renderUrl using the module configuration option. When specifying a custom renderer, quality assurance is your responsibility.

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
      dealIdPattern: /^MASS/i
    }
  });
});
```

Parameters details:

|Name |Type |Description |Default |
| :------------ | :------------ | :------------ |:------------ |
|enabled | Boolean |Enable/disable the module |`true` |
|renderUrl | String |The render script to use | |
|dealIdPattern | RegExp |The pattern used to identify MASS deal IDs |`/^MASS/i` |

## Example

To view an integration example:
 
1) in your cli run:

```
gulp serve --modules=ixBidAdapter,mass
```

2) in your browser, navigate to:

```
http://localhost:9999/integrationExamples/mass/index.html
```
