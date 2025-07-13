import React from 'react';

import Admonition from '@theme/Admonition';

const LegalWarning: React.FC = () => (
  <Admonition type="warning" title="Legal Disclaimer">
    <p>
      <strong>Important:</strong> This resource should not be construed as legal advice and Prebid.org makes no guarantees about compliance with any law or regulation.
    </p>
    <p>
      Please note that because every company and its collection, use, and storage of personal data is different, you should seek independent legal advice
      relating to obligations under your regional regulations, including the GDPR, the ePrivacy Directive and individual country/province/state laws. Only a
      lawyer can provide you with legal advice specifically tailored to your situation. Nothing in this guide is intended to provide you with, or should be
      used as a substitute for, legal advice tailored to your business.
    </p>
  </Admonition>
);

export default LegalWarning; 