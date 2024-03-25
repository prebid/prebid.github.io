---
layout: page_v2
title: DSA Control Module
display_name: DSA Control Module
description: Digital Services Act bid validation  
page_type: module
module_code : dsaControl
enable_download : true
sidebarType : 1
---

# DSA Control Module
{:.no_toc}

* TOC
  {:toc}

## Overview

The ORTB [DSA extension](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/main/extensions/community_extensions/dsa_transparency.md) provides a method for publishers to request DSA transparency information, and for buyers to attach it to their bids. 
This module adds validation for DSA information, discarding bids that do not match what was requested.

## Usage

With this module installed, validations are enabled by requesting DSA transparency information. For example:

```javascript
pbjs.setConfig({
  ortb2: {
      regs: {
          ext: {
              dsa: {
                  dsarequired: 2,  
                  pubrender: 0
                  // ...
              }
          }
      }
  }
})
```

This module will then enforce that:

* all bids include DSA information, if required (`dsarequired` is either `2` or `3`);
* all bids that provide DSA information use a compatible rendering method:
  * if the request indicates that the publisher can't render (`pubrender` is `0`), then the advertiser must (`adrender` cannot be `0`);
  * if it indicates that the publisher will render (`pubrender` is `2`), then the advertiser must not (`adrender` cannot be `1`).
   
Bids that fail the checks above are rejected with a console warning and removed from the auction.  

## Further Reading

* [DSA Transparency](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/main/extensions/community_extensions/dsa_transparency.md)
