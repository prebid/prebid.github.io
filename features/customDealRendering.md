---
layout: page_v2
title: Custom Rendering for Deals
description: Render selected bids, such as specific deals, with your own code
sidebarType: 1
redirect_from:
  - /dev-docs/modules/mass.html
---

# Custom Rendering for Deals

{:.no_toc}

* TOC
{:toc}

## Overview

Some deals need a creative experience that the standard rendering path can't provide. Examples are takeovers, rich media formats with a vendor rendering script, or markup that has to be processed before it's displayed. Until Prebid.js 8.0 this was done with the MASS (deal rendering) module. That module has been removed. The same result takes a few lines of publisher code: attach a [renderer](/dev-docs/adunit-reference.html) to the bids you want to handle, when they come in.

When a bid with a renderer wins and the ad server creative asks Prebid.js to display it (for example through the [Prebid Universal Creative](/overview/prebid-universal-creative.html)), Prebid.js calls the renderer's `render` function instead of writing the bid's `ad` markup into the creative frame.

## Example

```javascript
pbjs.que.push(function () {
    pbjs.onEvent('bidResponse', function (bid) {
        // choose the bids to handle: by deal ID pattern, bidder, a meta flag, etc.
        if (bid.dealId && /^MYDEAL/i.test(bid.dealId)) {
            // a safe renderer, if the bid has one, takes precedence over bid.renderer
            delete bid.safeRenderer;
            bid.renderer = {
                renderNow: true,
                render: function (bid) {
                    // bid.ad holds the original markup. Render it in a sandboxed iframe in the ad slot
                    // (assuming the slot's div id is the ad unit code), never in the page's own DOM.
                    var slot = document.getElementById(bid.adUnitCode);
                    if (!slot) {
                        return;
                    }
                    var iframe = document.createElement('iframe');
                    iframe.width = bid.width;
                    iframe.height = bid.height;
                    iframe.scrolling = 'no';
                    iframe.style.border = '0';
                    iframe.title = '3rd party ad content';
                    // no allow-same-origin: the creative runs in an opaque origin, isolated from the page
                    iframe.sandbox.add('allow-forms', 'allow-popups', 'allow-popups-to-escape-sandbox',
                        'allow-scripts', 'allow-top-navigation-by-user-activation');
                    iframe.srcdoc = bid.ad;
                    slot.replaceChildren(iframe);
                }
            };
        }
    });
});
```

To hand rendering to a vendor script, as the MASS module did with its `renderUrl`, load the script from `render` and pass it the bid:

```javascript
render: function (bid) {
    var script = document.createElement('script');
    script.src = 'https://vendor.example/render.js';
    script.onload = function () {
        window.vendorRender(bid);
    };
    document.head.appendChild(script);
}
```

## How it works

* The renderer has to be set before the bid wins. The `bidResponse` event fires for each bid as it's added to the auction, and Prebid.js uses the renderer when the bid is rendered.
* `renderNow: true` tells Prebid.js the renderer is ready to call. A renderer with a `url` instead loads that script first.
* `render(bid, doc)` runs in the page that loaded Prebid.js, not inside the creative frame, so don't insert bidder markup into the page's DOM. `doc` is the page's own document unless the renderer's `config.documentResolver` returns another one; the example ignores it and creates its own iframe.
* If a bid also has a [safe renderer](/dev-docs/renderer.html) (from the adapter or ad unit config), Prebid.js uses that instead of `bid.renderer`. The example deletes `bid.safeRenderer` so its own renderer is used.
* Rendering through a renderer is reported as `adRenderSucceeded`, like other renders.
* To use the same renderer for every bid of an ad unit or bidder, rather than for selected bids, configure `renderer` on the [ad unit or bidder](/dev-docs/adunit-reference.html) instead.

## Migrating from the MASS module

| MASS module config | Equivalent |
| --- | --- |
| `dealIdPattern` | The condition in the `bidResponse` handler, e.g. `/^MASS/i.test(bid.dealId)` |
| `bid.meta.mass` flag | Check `bid.meta.mass` in the same condition |
| `renderUrl` / `namespace` | Load the vendor script in `render`, as in the second example |
| `custom[].match` / `custom[].render` | Your own condition and `render` function |
| `payload.adm` | `bid.ad` |
| `payload.bidRequest` | Not passed to the renderer; listen to `bidRequested` if you need it |
