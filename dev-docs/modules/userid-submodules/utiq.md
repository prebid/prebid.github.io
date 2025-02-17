---
layout: userid
title: Utiq ID
description: Utiq User ID sub-module
useridmodule: utiqIdSystem
bidRequestUserId: utiId
eidsource: utiq.com
example: '"1111"'
---

Utiq generates unique tokens, enabling improved efficiency in programmatic advertising while safeguarding transparency and control for end customers via `consenthub.utiq.com`. A website visitor’s Utiq is generated based on network identifiers provided by network operators and requires explicit user consent.

Utiq is also the brand name of the service, which is provided by Utiq SA/NV.

## Utiq ID configuration

{: .table .table-bordered .table-striped }

| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of the module | `"utiqId"` |

Configuration example:

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [
      {
        name: "utiqId",
      },
    ],
  },
})
```

You can find more information at [docs.utiq.com/docs/programmatic-integration](https://docs.utiq.com/docs/programmatic-integration)

### TCF Activity Integration

If you use the Prebid.js [TCF Control Module](/dev-docs/modules/tcfControl.html), which prevents access to local storage for non consented vendors, you may need to add a vendor exception for the Utiq user id module to work, as Utiq is not a TCF vendor and will be automatically blocked by Prebid when TCF Control is enabled. Utiq performs its own consent check, outside TCF, to ensure that there is no device storage access in the absence of consent.

To do that, you can use below configuration:

{: .alert.alert-warning :}
Prebid.org recommends working with a privacy lawyer before making enforcement exceptions for any vendor.

```javascript
pbjs.setConfig({
  consentManagement: {
    gdpr: {
      cmpApi: 'iab',
      rules: [{        // these are the default values
        purpose: "storage",
        enforcePurpose: true, // block localStorage based on purpose 1 of TCF
        enforceVendor: true,  // block localStorage for non consented / non TCF vendors
        vendorExceptions: ["utiqId"] // configuration line to add to make utiq exception
      }]
    }
  }
});
```

## Utiq ID onboarding

If you wish to find out more about Utiq, please contact <csm@utiq.com>
