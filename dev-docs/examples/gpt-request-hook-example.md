---
layout: example
title: GPT Request Hook Example
description: GPT Request Hook Example
sidebarType: 1

about:
- Demonstrates Prebid.js with Google Publisher Tag (GPT) using GPT's new <a href="https://developers.google.com/publisher-tag/reference#googletag.PubAdsService.registerRequestHook">registerRequestHook()</a> API (currently experimental)
- Removes the need for <code>disableInitialLoad()</code>, <code>bidsBackHandler</code> wiring, and a failsafe <code>setTimeout()</code>
- Runs a fresh Prebid auction and updates targeting before every GPT ad request, including lazy loading and GPT's automatic refreshes after bfcache restores and heavy ad intervention
- Existing GPT pages can evaluate this flow without retagging through the <a href="/dev-docs/modules/gpt-pre-auction.html#gpt-request-hook-integration">GPT Pre-Auction module's test mode</a>
---

## GPT Request Hook Example

{% capture htmlCodePrebid %}
<!-- DO NOT add this script in prod -->
<script src="intercept-banner-not-for-prod.js"></script>
<!-- END -->

<h5>Div-1</h5>
<button class="btn btn-primary mb-3" onclick="googletag.cmd.push(function() { googletag.pubads().refresh(); })">Refresh Ad Unit</button>
<div id="div-1" style="min-height:250px;">
  <script type="text/javascript">
    googletag.cmd.push(function() {
      googletag.display('div-1');
    });
  </script>
</div>
{% endcapture %}

{% capture jsCode %}
const PREBID_TIMEOUT = 1000;
const REQUEST_HOOK_TIMEOUT = 1500;

const adUnits = [{
  code: 'div-1',
  mediaTypes: {
    banner: {
      sizes: [[300, 250]]
    }
  },
  bids: [{
    bidder: 'msft',
    params: {
      placement_id: 'XXXXXXX' // not used in prod
    }
  }]
}];

window.pbjs = window.pbjs || {};
pbjs.que = pbjs.que || [];

pbjs.que.push(function() {
  pbjs.addAdUnits(adUnits);
});

window.googletag = window.googletag || {};
googletag.cmd = googletag.cmd || [];

googletag.cmd.push(function() {
  googletag.defineSlot('/19968336/header-bid-tag-1', [[300, 250]], 'div-1')
    .addService(googletag.pubads());

  // Enable single-request mode with a hook timeout slightly above PREBID_TIMEOUT.
  googletag.setConfig({
    singleRequest: true,
    requestHookTimeoutMs: REQUEST_HOOK_TIMEOUT
  });

  // Run a Prebid auction and apply targeting before every outgoing GPT ad request
  // (initial display, lazy load, or refresh).
  googletag.pubads().registerRequestHook(async ({ slots }) => {
    await new Promise(resolve => pbjs.que.push(resolve));
    // Map requested GPT slots to Prebid adUnit.code values (div IDs here; use
    // slot.getAdUnitPath() or a custom matcher if keyed by GPT ad unit path).
    const adUnitCodes = slots.map(slot => slot.getSlotElementId());
    await pbjs.requestBids({
      adUnitCodes,
      timeout: PREBID_TIMEOUT
    });
    pbjs.setTargetingForGPTAsync(adUnitCodes);
  }, 'prebid-docs-request-hook');

  googletag.enableServices();
});
{% endcapture %}

{% include code/web-example.html id="gpt-request-hook-example" html=htmlCodePrebid js=jsCode scripts="pbjs,gpt" %}

## Integration Notes

- **Hook timeout:** GPT waits for request hooks up to `requestHookTimeoutMs`, then sends the ad request. Set it to `"auto"` or slightly above the Prebid auction timeout, which is `bidderTimeout` or the `timeout` passed to `pbjs.requestBids()`. This timeout also covers the case where Prebid.js fails to load, so the page needs no separate failsafe timer.
- **Slot matching:** This example keys `adUnits` by div ID, so the hook maps slots with `slot.getSlotElementId()`. If your `adUnits` are keyed by GPT ad unit path, use `slot.getAdUnitPath()` or the same logic as your [`customGptSlotMatching`](/dev-docs/publisher-api-reference/setConfig.html#customGptSlotMatching) function.
- **Other header bidding wrappers:** The hook runs only when GPT starts an ad request. A wrapper that still uses `disableInitialLoad()` and calls `googletag.pubads().refresh()` after its own auction therefore delays the Prebid auction. Register each wrapper as a GPT request hook so that the auctions run in parallel.
