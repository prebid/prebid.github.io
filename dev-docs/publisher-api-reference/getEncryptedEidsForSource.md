---
layout: api_prebidjs
title: pbjs.getEncryptedEidsForSource(source, encrypt, customFunc)
description: getEncryptedEidsForSource API
sidebarType: 1
---

{: .alert.alert-info :}
To use this function, include the [UserId module](/dev-docs/modules/userId.html) in your Prebid.js build.

Returns a Promise that resolves to the Encrypted Signals for Publishers (ESP) signal for one source. It's the same value that GPT collects for that source after [`pbjs.registerSignalSources()`](/dev-docs/publisher-api-reference/registerSignalSources.html). `registerSignalSources` uses this function as the collector for each configured source. You can call it directly to check a configuration or to pass the signal somewhere else.

The Promise resolves once the User ID module has finished retrieving IDs.

{: .table .table-bordered .table-striped }

| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| source | Required | String | The signal source. Without `customFunc`, this is the `source` of an EID (for example `pubcid.org`). |
| encrypt | Optional | Boolean | Only used without `customFunc`. If `true`, the result is the whole EID, JSON-serialized and base64-encoded, with a `1\|\|` prefix. Otherwise it is the first ID of the EID (`uids[0].id`). |
| customFunc | Optional | Function | Called with `source`. Its return value (a string, or an object that is JSON-serialized first) is base64-encoded with a `1\|\|` prefix. |

The Promise resolves to `undefined` if no EID matches `source`, or to `null` if `customFunc` returns a falsy value.

{: .alert.alert-info :}
"Encrypted" refers to the ESP program. Prebid.js only base64-encodes the value, so it isn't encrypted.

```javascript
pbjs.getEncryptedEidsForSource('pubcid.org').then(signal => {
    // 'some-random-id-value'
});

pbjs.getEncryptedEidsForSource('pubcid.org', true).then(signal => {
    // '1||eyJzb3VyY2UiOiJwdWJjaWQub3JnIiwidWlkcyI6W3siaWQiOiJzb21lLXJhbmRvbS1pZC12YWx1ZSIsImF0eXBlIjoxfV19'
});

pbjs.getEncryptedEidsForSource('segment.com', false, () => ['seg1', 'seg2']).then(signal => {
    // '1||WyJzZWcxIiwic2VnMiJd'
});
```

See the [User ID module ESP configuration](/dev-docs/modules/userId.html#esp-configurations) for details.
