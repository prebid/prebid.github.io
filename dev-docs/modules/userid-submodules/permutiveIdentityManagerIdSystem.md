---
layout: userid
title: Permutive Identity Manager
description: Permutive Identity Manager User ID sub-module
useridmodule: permutiveIdentityManagerIdSystem
---

# Permutive Identity Manager

This module supports [Permutive](https://permutive.com/) customers in using Permutive's Identity Manager functionality.

To use this Prebid.js module it is assumed that the site includes Permutive's SDK, with Identity Manager configuration
enabled. See Permutive's user documentation for more information on Identity Manager.

## Building Prebid.js with Permutive Identity Manager Support

Prebid.js must be built with the `permutiveIdentityManagerIdSystem` module in order for Permutive's Identity Manager to be able to
activate relevant user identities to Prebid.

To build Prebid.js with the `permutiveIdentityManagerIdSystem` module included:

```sh
gulp build --modules=userId,permutiveIdentityManagerIdSystem
```

## Prebid configuration

There is minimal configuration required to be set on Prebid.js, since the bulk of the behaviour is managed through
Permutive's dashboard and SDK.

It is recommended to keep the Prebid.js caching for this module short, since the mechanism by which Permutive's SDK
communicates with Prebid.js is effectively a local cache anyway.

```js
pbjs.setConfig({
  ...
  userSync: {
    userIds: [
      {
        name: 'permutiveIdentityManagerId',
        params: {
          ajaxTimeout: 90,
          // Optional: require TCF vendor 361 consent in addition to purpose 1.
          // Defaults to false on Prebid.js 10.19.0 and later.
          enforceVendorConsent: true
        },
        storage: {
          type: 'html5',
          name: 'permutiveIdentityManagerId',
          refreshInSeconds: 5
        }
      }
    ],
    auctionDelay: 100
  },
  ...
});
```

### ajaxTimeout

By default this module will read IDs provided by the Permutive SDK from local storage when requested by prebid, and if
nothing is found, will not provide any identities. If a timeout is provided via the `ajaxTimeout` parameter, it will
instead wait for up to the specified number of milliseconds for Permutive's SDK to become available, and will retrieve
identities from the SDK directly if/when this happens.

This value should be set to a value smaller than the `auctionDelay` set on the `userSync` configuration object, since
there is no point waiting longer than this as the auction will already have been triggered.

### Consent

**Prebid.js 10.19.0 and later:** The module uses the publisher's TCF purpose 1 consent signals by default, without requiring vendor consent for Permutive (vendor 361). To additionally require consent for vendor 361, include that vendor ID in your CMP and set `params.enforceVendorConsent: true` in the `userSync.userIds` entry for `permutiveIdentityManagerId`, as illustrated above. The Boolean flag defaults to `false`; omit it to preserve the default behavior.

**Prebid.js 10.18.0 and earlier:** This flag is unavailable. When using the [TCF Control Module](/dev-docs/modules/tcfControl.html), older builds identify Permutive using vendor ID 361. Refer to the [RTD module's legacy vendor-exception guidance](/dev-docs/modules/permutiveRtdProvider.html#consent) if you do not collect TCF vendor consent.

Before making any updates to your consent configuration, please ensure that your approach aligns with internal policies and current regulations regarding consent.
