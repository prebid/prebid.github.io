<div class="api-header">Use Bid Cache</div>

Prebid.js currently allows for <a href="http://prebid.org/dev-docs/faq.html#does-prebidjs-cache-bids">caching and reusing bids in a very narrowly defined scope</a>.
However, if you'd like, you can disable this feature and prevent Prebid.js from using anything but the latest bids for
a given auction.

<div class="pb-alert pb-alert-warning">This option is available in version 1.39 as true-by-default and became false-by-default as of Prebid.js 2.0. If you want to use this feature in 2.0 and later, you'll need to set the value to true.</div>


<pre><code>
pbjs.setConfig({ useBidCache: true })
</code></pre>