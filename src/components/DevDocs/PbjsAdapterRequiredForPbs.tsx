import React from 'react';

import Admonition from '@theme/Admonition';

const PbjsAdapterRequiredForPbs: React.FC = () => (
  <Admonition type="warning" title="Prebid.js Adapter Required">
    This bidder requires the client side Prebid.js adapter to work on Prebid Server due to the dependency on the <code>transformBidParams</code> function.
    See <a href="https://github.com/prebid/Prebid.js/issues/6361">prebid.js #6361</a> for more details.
  </Admonition>
);

export default PbjsAdapterRequiredForPbs; 