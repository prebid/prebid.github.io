import React from 'react';

const DefaultKeywordTargeting: React.FC = () => (
  <div>
    <h2>Default Keyword Targeting</h2>
    
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
          <td><code>hb_pb</code></td>
          <td>Required</td>
          <td>The price bucket. Used by the line item to target.</td>
          <td><code>2.10</code></td>
        </tr>
        <tr>
          <td><code>hb_adid</code></td>
          <td>Required</td>
          <td>The ad Id. Used by the ad server creative to render ad.</td>
          <td><code>234234</code></td>
        </tr>
        <tr>
          <td><code>hb_bidder</code></td>
          <td>Required</td>
          <td>The bidder code. Used for logging and reporting to learn which bidder has higher fill rate/CPM.</td>
          <td><code>rubicon</code></td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default DefaultKeywordTargeting; 