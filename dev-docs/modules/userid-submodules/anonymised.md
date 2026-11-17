---
layout: userid
title: Anonymised ID
description: Anonymised ID User ID sub-module
useridmodule: anonymisedIdSystem
bidRequestUserId: anonymisedId
eidsource: anonymised.io
example: '"01f6a483-86fa-406b-a7c2-45f6d4a89469"'
---


Anonymised is a data anonymization technology for privacy-preserving advertising.

The Anonymised User ID sub-module exposes the identifier that the [Anonymised Marketing Tag](https://support.anonymised.io/integrate/marketing-tag?t=LPukVCXzSIcRoal5jggyeg) assigns when a user signs in, and passes it to the bid stream as an OpenRTB Extended ID under the source `anonymised.io`.

The sub-module makes no network request and loads no script. It reads the identifier the Marketing Tag has already stored on the publisher's own domain, in `localStorage` under the key `anon-cuid`. When the Marketing Tag is not present, or the user is not signed in, no ID is read and no EID is added — which is the expected state for most traffic, not an error.

## Prerequisite

The Anonymised Marketing Tag must be installed on the page. This sub-module does not load it. The tag can be installed [natively](https://support.anonymised.io/integrate/install-the-anonymised-tag-natively?t=LPukVCXzSIcRoal5jggyeg), or through the [Anonymised RTD Provider](/dev-docs/modules/anonymisedRtdProvider.html) using its `tagConfig` parameter.

Please contact an [Anonymised representative](mailto:support@anonymised.io) to get started.

Add the Anonymised ID to your Prebid.js package with:

```bash
gulp build --modules=userId,anonymisedIdSystem
```

## Anonymised ID Configuration

{: .table .table-bordered .table-striped }

| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module | `"anonymisedId"` |

This sub-module takes no `params`.

### Do not configure `storage`

This sub-module manages the identifier itself and must be configured **without** a `storage` object.

The Marketing Tag is the single source of truth for the identifier: it writes the value when the user signs in, and removes it on sign-out and on consent withdrawal. If Prebid.js kept its own copy, that copy would outlive the removal and the sub-module would keep sending a stale identifier to bidders until Prebid's own expiry elapsed. Reading the value on every initialization keeps the Marketing Tag's removal authoritative.

### Do not set `userSync.ppid` to `anonymised.io`

The Marketing Tag sets the Google Ad Manager Publisher Provided ID itself. Setting `userSync.ppid` to `anonymised.io` makes Prebid.js set the PPID as well, which produces two problems:

* Prebid.js strips non-alphanumeric characters from an ID before setting it as the PPID, while the Marketing Tag sends the identifier unmodified. The same user is then represented by two different PPIDs depending on which code path ran, splitting Google Ad Manager audiences and reporting.
* The Marketing Tag applies its own logic when deciding whether a PPID should be set at all. Prebid.js is not aware of that logic and would bypass it.

The Marketing Tag owns the identifier sent to Google Ad Manager; this sub-module owns the identifier sent to bidders.

### Single-page applications

`getId` is called when the User ID module initializes and is not re-run for subsequent auctions. If a user signs in after that point, call `pbjs.refreshUserIds({ submoduleNames: ['anonymisedId'] })` to pick up the new identifier.

Always pass `submoduleNames`. An unscoped refresh re-initializes every configured ID sub-module, including those that make network requests.

### Subdomains

The identifier is read from `localStorage`, which is scoped to a single origin. For a publisher serving the same user from more than one subdomain, the identifier is available on each subdomain only after the Marketing Tag has run there.

### Data deletion

Deletion requests are handled by the Anonymised Marketing Tag, which owns the user's session and every identifier derived from it. This sub-module stores nothing of its own and therefore implements no `onDataDeletionRequest` callback.

## Anonymised ID Example

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'anonymisedId'
        }]
    }
});
```
