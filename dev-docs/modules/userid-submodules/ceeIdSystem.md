# ceeIdSystem UserID Module

## Prebid Configuration

First, make sure to add ceeIdSystem to your Prebid.js package with:

```bash
gulp build --modules=ceeIdSystem
```

## CEE ID Configuration

| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of CEE ID user ID module. | `"ceeId"` |
| storage | Required | Object | Container of storage options. |  |
| storage.type | Required | String | Type of storage to use  | `"cookie"` |
| storage.name | Required | String | Name of storage to set  | `"ceeIdToken"` |
| storage.expires | Optional | Int | Time when storage should expire it is recommended to use this options otherwise storage last only during session  | `7` |
| storage.refreshInSeconds | Optional | Int | Time when storage value and expiration date will get refreshed in seconds  | `360` |
| params | Required | Object | Container of all module params. |  |
| params.tokenName | Required | String |  Your custom name of token to read | `'myExampleTokenName'` |
| params.value | Optional | String | Optional param if you want to pass token value directly through setConfig  | `'someTokenValue'` |

## CEE ID Examples

You can configure this submodule in your `userSync.userIds[]` configuration. Publishers manage ceeIds themselves can store ceeIds in local storage or 1st party cookies. You can use your custom name of token to read

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'ceeId',
            storage: {
                type: 'cookie',
                name: 'ceeIdToken',
                expires: 7,
                refreshInSeconds: 360
            },
            params: {
                tokenName: 'name' // Your custom name of token to read
            }
        }]
    }
});
```

Or pass value directly thorugh params.value. Note that tokenName is not required then. This param shouldn't be set if token value will be taken by tokenName

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'ceeId',
            storage: {
                type: 'cookie',
                name: 'ceeIdToken',
                expires: 7,
                refreshInSeconds: 360
            },
            params: {
                value: 'tokenValue'
            }
        }]
    }
});
```
