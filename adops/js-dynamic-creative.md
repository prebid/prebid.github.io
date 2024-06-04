---
layout: page_v2
title: Prebid.js dynamic creatives
head_title: Prebid.js dynamic creatives 
sidebarType: 3
---

# Prebid.js dynamic creatives
{:.no_toc}

- TOC
{: toc}

## Overview

For line items that target browsers only, you may use Prebid.js dynamic creatives as an alternative to [Prebid Universal Creative](/overview/prebid-universal-creative.html). The former provides slightly better performance and ease of use, but relies on Prebid.js, meaning that it does not support non-JS use cases (such as mobile apps or AMP).

## Comparison vs PUC for Prebid.js

A creative set up to use Prebid Universal Creative:

- loads a separate script, typically from a CDN; the script contains various rendering routines, including some specific to Prebid.js;
- if the script determines that the ad render was initiated by Prebid.js, it retrieves from it information about the winning bid and renders it;
- requires different setups for different use cases (such as banner vs native).

A Prebid.js dynamic creative:

- does not load any additional script - it's instead set up with a small block of inline Javascript;
- it expects to always find Prebid.js, retrieving from it information about the winning bid _and_ the rendering logic to use for it;
- uses the same setup for all cases - but does not work when the render is not initiated by Prebid.js.

## How to use

{: .alert.alert-warning :}
Dynamic creatives require Prebid.js version 8.36 or higher.

Set up the creative following [this example](https://github.com/prebid/Prebid.js/blob/master/integrationExamples/gpt/x-domain/creative.html). If you are not using GAM, replace the macros in the second `script` tag with appropriate equivalents.

To render native ads, you also need to include the [nativeRendering](/dev-docs/modules/nativeRendering.html) module in your Prebid.js bundle.

## Further reading

- [Creative Considerations](/adops/creative-considerations.html)
- [Prebid Universal Creative](/overview/prebid-universal-creative.html)
- [Native rendering module](/dev-docs/modules/nativeRendering.html)
