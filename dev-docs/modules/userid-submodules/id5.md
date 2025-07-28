---
layout: userid
title: ID5 ID
description: ID5 ID User ID sub-module
useridmodule: id5IdSystem
bidRequestUserId: id5id
eidsource: id5-sync.com
example: {uid: "1111", ext: { linkType: 2, abTestingControlGroup: false } }
---


The ID5 ID is a shared, neutral identifier that publishers and ad tech platforms can use to recognise users even in environments where 3rd party cookies are not available. The ID5 ID is designed to respect users' privacy choices and publishers’ preferences throughout the advertising value chain. For more information about the ID5 ID and detailed integration docs, please visit [our documentation](https://wiki.id5.io/en/identitycloud/retrieve-id5-ids/prebid-user-id-module/id5-prebid-user-id-module).

## ID5 ID Registration

The ID5 ID is free to use, but requires a simple registration with ID5. Please visit [our website](https://id5.io/solutions/#publishers) to sign up and request your ID5 Partner Number to get started.

The ID5 privacy policy is at [id5.io/platform-privacy-policy](https://id5.io/platform-privacy-policy).

## ID5 ID Configuration

First, make sure to add the ID5 submodule to your Prebid.js package with:

```bash
gulp build --modules=id5IdSystem,userId
```

The following configuration parameters are available:

{: .table .table-bordered .table-striped }

| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module: `"id5Id"` | `"id5Id"` |
| params | Required | Object | Details for the ID5 ID. | |
| params.partner | Required | Number | This is the ID5 Partner Number obtained from registering with ID5. | `173` |
| params.externalModuleUrl | Optional | String | URL to the external ID5 module. Highly recommended for the best integration possible. This is additional javascript unreviewed by the prebid.js community | `https://cdn.id5-sync.com/api/1.0/id5PrebidModule.js` |
| params.pd | Optional | String | Partner-supplied data used for linking ID5 IDs across domains. See [our documentation](https://wiki.id5.io/en/identitycloud/retrieve-id5-ids/passing-partner-data-to-id5) for details on generating the string. Omit the parameter or leave as an empty string if no data to supply | `"MT1iNTBjY..."` |
| params.abTesting | Optional | Object | Allows publishers to easily run an A/B Test. If enabled and the user is in the Control Group, the ID5 ID will NOT be exposed to bid adapters for that request | Disabled by default |
| params.abTesting.enabled | Optional | Boolean | Set this to `true` to turn on this feature | `true` or `false` |
| params.abTesting.controlGroupPct | Optional | Number | Must be a number between `0.0` and `1.0` (inclusive) and is used to determine the percentage of requests that fall into the control group (and thus not exposing the ID5 ID). For example, a value of `0.20` will result in 20% of requests without an ID5 ID and 80% with an ID. | `0.1` |
| params.disableExtensions | Optional | Boolean | Set this to `true` to force turn off extensions call. Default `false` | `true` or `false` |
| params.canCookieSync | Optional | Boolean | Set this to `true` to enable cookie syncing with other ID5 partners. See [our documentation](https://wiki.id5.io/docs/initiate-cookie-sync-to-id5) for details. Default `false` | `true` or `false` |
| params.provider | Optional | String | An identifier provided by ID5 to technology partners who manage API deployments on behalf of their clients. Reach out to ID5 if you have questions about this parameter. | `"providerName"` |
| params.gamTargetingPrefix | Optional | String  | When this parameter is set the ID5 module will set appropriate GAM pubads targeting tags                                                                                                                                                                                            | `"id5"`                                               |

{: .alert.alert-info :}
**NOTE:** The ID5 ID that is delivered to Prebid will be encrypted by ID5 with a rotating key to avoid unauthorized usage and to enforce privacy requirements. Therefore, we strongly recommend setting `storage.refreshInSeconds` to `2` hours (`7200` seconds) or less to ensure all demand partners receive an ID that has been encrypted with the latest key, has up-to-date privacy signals, and allows them to transact against it.

### A Note on A/B Testing

Publishers may want to test the value of the ID5 ID with their downstream partners. While there are various ways to do this, A/B testing is a standard approach. Instead of publishers manually enabling or disabling the ID5 User ID Module based on their control group settings (which leads to fewer calls to ID5, reducing our ability to recognize the user), we have baked this in to our module directly.

To turn on A/B Testing, simply edit the configuration (see above table) to enable it and set what percentage of users you would like to set for the control group. The control group is the set of user where an ID5 ID will not be exposed in to bid adapters or in the various user id functions available on the `pbjs` global. An additional value of `ext.abTestingControlGroup` will be set to `true` or `false` that can be used to inform reporting systems that the user was in the control group or not. It's important to note that the control group is user based, and not request based. In other words, from one page view to another, a user will always be in or out of the control group.

Since [Prebid version 9.42.0](https://github.com/prebid/Prebid.js/releases/tag/9.42.0) an [Enrichment Lift module](https://docs.prebid.org/dev-docs/modules/enrichmentLiftMeasurement.html) is available which also supports A/B Testing. It should not be configured for ID5 UserId Module if the `params.abTesting.enabled` is set to `true`.

### Tags set by GAM targeting

The ID5 UserId module can set GAM targeting tags, if enabled by setting the `params.gamTargetingPrefix`. 
The prefix used should be unique on the property - if more than one Prebid integration is used, the prefix should be different for each integration. 
If the same prefix is used, the ID5 module will overwrite the existing GAM targeting tags.

If `params.gamTargetingPrefix` is set to a non-empty value and an ID5 module has initialized, the ID5 module will set the following GAM targeting tags:

- `{prefix}_id` - set to `y` if a valid id5id was present, otherwise tag is not set
- `{prefix}_ab` - set if `abTesting` was enabled - `n` if in Normal group (with ID5 returned), `c` if in Control group (without ID5 returned)

### A Note on Using Multiple Wrappers
If you or your monetization partners are deploying multiple Prebid wrappers on your websites, you should make sure you add the ID5 ID User ID module to *every* wrapper. Only the bidders configured in the Prebid wrapper where the ID5 ID User ID module is installed and configured will be able to pick up the ID5 ID. Bidders from other Prebid instances will not be able to pick up the ID5 ID.

## ID5 ID Examples

Publisher wants to retrieve the ID5 ID through Prebid.js

```javascript
pbjs.setConfig({
  userSync: {
    userIds: [{
      name: 'id5Id',
      params: {
        partner: 173,            // change to the Partner Number you received from ID5
        externalModuleUrl: 'https://cdn.id5-sync.com/api/1.0/id5PrebidModule.js',
        pd: 'MT1iNTBjY...',      // optional, see table above for a link to how to generate this
        abTesting: {             // optional
          enabled: true,         // false by default
          controlGroupPct: 0.1   // valid values are 0.0 - 1.0 (inclusive)
        },
        canCookieSync: true,      // optional, has effect only when externalModuleUrl is used
        gamTargetingPrefix: "id5" // optional, when set the ID5 module will set gam targeting paramaters with this prefix
      },
      storage: {
        type: 'html5',           // "html5" is the recommended storage type
        name: 'id5id',           // "id5id" is the recommended storage name
        expires: 90,             // storage lasts for 90 days
        refreshInSeconds: 7200   // refresh ID every 2 hours to ensure it's fresh
      }
    }],
    auctionDelay: 50             // 50ms maximum auction delay, applies to all userId modules
  }
});
```

{: .alert.alert-warning :}
**ATTENTION:** As of Prebid.js v8.33.0, to ensure the ID5 module in Prebid.js interoperates properly with the [ID5 API](https://github.com/id5io/id5-api.js), it's possible to provide the `externalModuleUrl` parameter and set it to the latest available module version at `https://cdn.id5-sync.com/api/1.0/id5PrebidModule.js`. If you have any questions, please reach out to us at [prebid@id5.io](mailto:prebid@id5.io).

### Provided eids
The module provides following eids:

```javascript
[
  {
    source: 'id5-sync.com',
    uids: [
      {
        id: 'some-random-id-value',
        atype: 1,
        ext: {
          linkType: 2,
          abTestingControlGroup: false
        }
      }
    ]
  },
  {
    source: 'gpid.id5-sync.com',
    uids: [
      {
        id: 'some-publisher-gp-id',
        atype: 1
      }
    ]
  },
  {
    source: 'uidapi.com',
    uids: [
      {
        id: 'some-uid2',
        atype: 3,
        ext: {
          provider: 'id5-sync.com'
        }
      }
    ]
  }
]
```

The id from `id5-sync.com` should be always present (though the id provided will be '0' in case of no consent or optout)

The id from `gpid.id5-sync.com` will be available if the publisher has enabled Guarded Publisher ID [ID5 wiki](https://wiki.id5.io/docs/guarded-publisher-id)

The id from `uidapi.com` will be available if the partner used in ID5 user module has the EUID2 integration enabled (it has to be enabled on the ID5 side)

Additional EIDS may be provided if the publisher has enabled bid enrichment with ID5. 

### Providing Guarded Publisher ID as a Google PPID

GPID can be provided as a PPID - to use, it the `gpid.id5-sync.com` needs to be provided as a ppid source in prebid userSync configuration:

```javascript
pbjs.setConfig({
  userSync: {
    ppid: 'gpid.id5-sync.com',
    userIds: [],  //userIds modules should be configured here
  }
});
```
