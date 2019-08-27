<div class="api-header">Send All Bids</div> 

Sending all bids is the default, but should you wish to turn it off:

```javascript
pbjs.setConfig({ enableSendAllBids: false })
```

When `sendAllBids` mode is on, your page will send keywords for all bidders to your ad server. The ad server will then make the decision on which will win. Some ad servers, such as DFP, can then generate reporting on historical bid prices from all bidders.

<div class="pb-alert pb-alert-note">Note that this config must be set before <code>pbjs.setTargetingForGPTAsync()</code> or <code>pbjs.getAdserverTargeting()</code>.</div>

After this method is called, <code>pbjs.getAdserverTargeting()</code> will give you the below JSON (example). <code>pbjs.setTargetingForGPTAsync()</code> will apply the below keywords in the JSON to GPT (see example below)</div>

<pre><code> 
{
  "hb_adid_audienceNetw": "1663076dadb443d",
  "hb_pb_audienceNetwor": "9.00",
  "hb_size_audienceNetw": "300x250",
  "hb_adid_appnexus": "191f4aca0c0be8",
  "hb_pb_appnexus": "10.00",
  "hb_size_appnexus": "300x250",
  // also sends the highest bid in the these variables:
  "hb_bidder": "appnexus",
  "hb_adid": "191f4aca0c0be8",
  "hb_pb": "10.00",
  "hb_size": "300x250",
}
</code></pre>

<div class="pb-alert pb-alert-important"><b>Important:</b> DFP has a key-value key character <a href="https://support.google.com/dfp_premium/answer/1628457?hl=en#Key-values">limit</a> of up to <b>20 characters</b>. Some of the keys without truncation will exceed 20 chars. Prebid.js automatically truncates the key length to 20 characters. For example, <code>hb_adid_longBidderName</code> is truncated to <code>hb_adid_longBidderNa</code> (<code>me</code> is truncated). Note that the key is case-sensitive. To get the exact key-value keys for each bidder, find them at <a href="/dev-docs/bidders.html">Bidder Params</a>.</div>

<table class="table table-striped table-bordered">
<theader>
  <th>Default Key</th>
  <th> Scope</th>
  <th>Description</th>
  <th>Example</th>
</theader>

<tbody>
  <tr>
    <td><code>`hb_pb_BIDDERCODE</code></td>
    <td>Required</td>
    <td>The price bucket. Used by the line item to target. Case sensitive and truncated to 20 chars. The <code>BIDDERCODE</code> is documented at <a href="/dev-docs/bidders.html">Bidder Params</a>.</td>
    <td><code>hb_pb_rubicon</code> = <code>2.10</code></td>
  </tr>
  
  <tr>
    <td><code>hb_adid_BIDDERCODE</code></td>
    <td>Required</td>
    <td>The ad Id. Used by the ad server creative to render ad. Case sensitive and truncated to 20 chars. The <code>BIDDERCODE</code> is documented at <a href="/dev-docs/bidders.html">Bidder Params.</a></td>
    <td><code>hb_adid_longBidderNa</code> = <code>234234</code></td>
  </tr>

  <tr>
    <td><code>hb_size_BIDDERCODE</code></td>
    <td>Optional</td>
    <td>This is not required for adops. Case sensitive and truncated to 20 chars.</td>
    <td><code>hb_size_appnexus</code> = <code>300x250</code></td>
  </tr>
  </tbody>
</table>





