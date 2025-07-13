import React from 'react';

import Admonition from '@theme/Admonition';

const Fingerprinting: React.FC = () => (
  <Admonition type="warning" title="Fingerprinting Warning">
    This adapter uses JavaScript APIs commonly used in fingerprinting and may get your Prebid build flagged as a fingerprinting script.
  </Admonition>
);

export default Fingerprinting; 