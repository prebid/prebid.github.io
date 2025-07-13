import React from 'react';

import Admonition from '@theme/Admonition';

const StorageAllowed: React.FC = () => (
  <Admonition type="warning" title="Prebid note">
    Please review with your legal counsel before enabling <code>storageAllowed</code>.
    Bidders utilizing browser storage may trigger the need for additional disclosures in your privacy policy
    and may imply that the bid adapter is performing an activity redundant with user ID systems like SharedID.
    See the ePrivacy Directive article 5(3) reference to 'comprehensive information'.
  </Admonition>
);

export default StorageAllowed;
