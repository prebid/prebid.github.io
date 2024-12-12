---
layout: userid
title: MediaWallah OpenLinkID
description: MediaWallah OpenLinkID User ID sub-module
useridmodule: mwOpenLinkIdSystem
bidRequestUserId: mwOpenLinkId
eidsource: mediawallahscript.com
example: '"1111"'
---


MediaWallah's openLink is an anonymous person based ID that enables buyers and sellers of media to connect a person and their devices across the web and mobile apps. openLink facilities the buying of media between DSPs, SSPs and publishers.

Add support for MediaWallah OpenLinkID to your Prebid.js package with:

```bash
gulp build --modules=userId,mwOpenLinkIdSystem
```

## MediaWallah OpenLinkID Registration

MediaWallah requires the creation of an accountId a partnerId in order to take advantage of openLink. Please contact your partner resource to get these Ids provisioned.

## MediaWallah OpenLinkID Configuration

{: .table .table-bordered .table-striped }

| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module. | `'mwOpenLinkId'` |
| params | Required | Object | Details for mwOLID syncing. ||
| params.accountId | Required | String | The MediaWallah assigned Account Id  | `1000` |
| params.partnerId | Required | String | The MediaWallah assign partner Id |`'1001'`|
| params.uid | Optional | String | Your unique Id for the user or browser. Used for matching. | `'u-123xyz'` |

## MediaWallah OpenLinkID Examples

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'mwOpenLinkId',
            params: {
                accountId: '1000',
                partnerId: '1001',
                uid: 'u-123xyz'
            }
        }]
    }
})
```
