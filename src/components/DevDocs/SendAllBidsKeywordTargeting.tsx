import React from 'react';

const SendAllBidsKeywordTargeting: React.FC = () => (
  <div>
    <h2>Send-All-Bids Keyword Targeting</h2>
    
    <div className="alert alert-warning">
      <strong>Important:</strong> Google Ad Manager has a key-value key character{' '}
      <a href="https://support.google.com/dfp_premium/answer/1628457?hl=en#Key-values">limit</a> of up to{' '}
      <strong>20 characters</strong>. Some of the keys without truncation will exceed 20 chars. Prebid.js automatically truncates the key length to 20 characters. 
      For example, <code>hb_adid_longBidderName</code> is truncated to <code>hb_adid_longBidderNa</code> (<code>me</code> is truncated). 
      Note that the key is case-sensitive. To get the exact key-value keys for each bidder, find them at{' '}
      <a href="/dev-docs/bidders.html">Bidder Params</a>.
    </div>

    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>Default Key</th>
          <th>Scope</th>
          <th>Description</th>
          <th>Example</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>hb_pb_BIDDERCODE</code></td>
          <td>Required</td>
          <td>The price bucket. Used by the line item to target. Case sensitive and truncated to 20 chars. The <code>BIDDERCODE</code> is documented at <a href="/dev-docs/bidders.html">Bidder Params</a>.</td>
          <td><code>hb_pb_rubicon</code> = <code>2.10</code></td>
        </tr>
        <tr>
          <td><code>hb_adid_BIDDERCODE</code></td>
          <td>Required</td>
          <td>The ad Id. Used by the ad server creative to render ad. Case sensitive and truncated to 20 chars. The <code>BIDDERCODE</code> is documented at <a href="/dev-docs/bidders.html">Bidder Params</a>.</td>
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
  </div>
);

export default SendAllBidsKeywordTargeting; 