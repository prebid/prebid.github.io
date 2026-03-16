---
layout: userid
title: UtiqMtp ID
description: UtiqMtp User ID sub-module
useridmodule: utiqMtpIdSystem
bidRequestUserId: utiqMtpId
eidsource: utiq-mtp.com
example: '"1111"'
---

Utiq generates unique tokens, enabling improved efficiency in programmatic advertising while safeguarding transparency and control for end customers via `consenthub.utiq.com`. A website visitor’s Utiq ID is generated based on network identifiers provided by network operators and requires explicit user consent.

Utiq provides different tokens type, known as 'adtechpass' and 'martechpass'. UtiqMtpId module helps publishers support and pass the 'martechpass' token to their SSP partners of choice. 'martechpass' is a first party ID meant to enable first party audiences in the SSP and shouldn't be forwarded to other parties.

Both Utiq and UtiqMtpId user id submodules can be used in parallel as both supports different use cases and scenarios.

Utiq is also the brand name of the service, which is provided by Utiq SA/NV.

## Utiq installation

In order to use utiq in your prebid setup, you must first integrate utiq solution on your website as per <https://docs.utiq.com/>
If you are interested in using Utiq on your website, please contact Utiq on <https://utiq.com/contact/>

## UtiqMtp ID configuration

{: .table .table-bordered .table-striped }

| Param under userSync.userIds[] | Scope    | Type   | Description                 | Example                       |
| ------------------------------ | -------- | ------ | --------------------------- | ----------------------------- |
| name                           | Required | String | The name of the module      | `"utiqMtpId"`                 |
| bidders                        | Required | Array  | SSPs to send martechpass to | `["bidder1", "bidder2", ...]` |

Configuration example:

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [
      {
        name: "utiqMtpId",
        bidders: ["bidder1", "bidder2", ...]
      },
    ],
  },
})
```

You may like to consider limiting the SSPs that receive the martechpass by **adding the bidders array**, to make sure they are not forwarding this first party ID to DSPs. We are working with SSPs to blacklist the above source from being sent to DSPs, please reach out to <csm@utiq.com> to verify which are these SSPs.

## TCF Activity Integration

If you use the Prebid.js [TCF Control Module](/dev-docs/modules/tcfControl), which prevents access to local storage for non consented vendors, you may need to add a vendor exception for the Utiq user id module to work, as Utiq is not a TCF vendor and will be automatically blocked by Prebid when TCF Control is enabled. Utiq performs its own consent check, outside TCF, to ensure that there is no device storage access in the absence of consent.

To do that, you can use below configuration:

```javascript
pbjs.setConfig({
  consentManagement: {
    gdpr: {
      cmpApi: "iab",
      rules: [
        {
          // these are the default values
          purpose: "storage",
          enforcePurpose: true, // block localStorage based on purpose 1 of TCF
          enforceVendor: true, // block localStorage for non consented / non TCF vendors
          vendorExceptions: ["utiqMtpId"], // configuration line to add to make utiq exception
        },
      ],
    },
  },
});
```

## Utiq ID onboarding

If you wish to find out more about Utiq, please contact <csm@utiq.com>
