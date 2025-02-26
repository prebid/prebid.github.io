---
layout: bidder
title: PixFuture
description: Prebid PixFuture Bidder Adapter
biddercode: pixfuture
media_types: banner
gvl_id: 839
tcfeu_supported: true
prebid_member: false
coppa_supported: true
usp_supported: true
userIds: criteoId, unifiedId, id5Id, sharedId, identityLink, liveIntentId, fabrickId
pbs: true
pbjs: true
sidebarType: 1
---

### Overview

The PixFuture Bidder Adapter connects publishers to PixFuture’s demand via Prebid.js and Prebid Server, supporting banner media types. To use this adapter, your PixFuture account must be approved for Prebid integration. Contact <support@pixfuture.com> to request activation or for setup assistance.

#### Solution

To download the PixFuture adapter for Prebid.js, visit [https://docs.prebid.org/download.html](https://docs.prebid.org/download.html) and select the `pixfuture` bidder from the list, along with other bidders you wish to include in your build. For Prebid Server, ensure your server instance includes the `pixfuture` bidder (consult your Prebid Server host for setup details).

**Important:** The `pixfuture` adapter requires account approval from PixFuture. To enable this integration, email <support@pixfuture.com>.

---

### Features

| Feature                  | Status                |
|--------------------------|-----------------------|
| **Bidder Code**          | `pixfuture`           |
| **Prebid.org Member**    | No                    |
| **Prebid.js Adapter**    | Yes                   |
| **Prebid Server Adapter**| Yes                   |
| **Media Types**          | Display (Banner)      |
| **Multi Format Support** | Contact support       |
| **TCF-EU Support**       | Yes                   |
| **IAB GVL ID**           | 839                   |
| **GPP Support**          | Contact support       |
| **DSA Support**          | Contact support       |
| **USP/CCPA Support**     | Yes                   |
| **COPPA Support**        | Yes                   |
| **Supply Chain Support** | Contact support       |
| **Demand Chain Support** | Contact support       |
| **Safeframes OK**        | Contact support       |
| **Supports Deals**       | Contact support       |
| **Floors Module Support**| Contact support       |
| **First Party Data Support** | Contact support   |
| **User IDs**             | `criteoId`, `unifiedId`, `id5Id`, `sharedId`, `identityLink`, `liveIntentId`, `fabrickId` |
| **ORTB Blocking Support**| Contact support       |
| **Privacy Sandbox**      | Contact support       |

For features marked "Contact support," reach out to <support@pixfuture.com> for more information.

---

### Bid Parameters

| Name       | Scope    | Description                                                        | Example       | Type     |
|------------|----------|--------------------------------------------------------------------|---------------|----------|
| `pix_id`   | required | A unique ID for your site’s ad placement. Corresponds to each ad size. | `"12312345"`    | `string` |

The `pix_id` is a unique identifier provided by PixFuture and must be specified for each ad placement/size combination. This parameter is consistent across both Prebid.js and Prebid Server.

---

### Prebid.js Integration

#### Basic Prebid.js Example

Below is an example of configuring ad units for PixFuture in Prebid.js:

```javascript
var adUnits = [
    {
        code: 'test-div-300x250',
        mediaTypes: {
            banner: {
                sizes: [[300, 250]]
            }
        },
        bids: [
            {
                bidder: 'pixfuture',
                params: {
                    pix_id: "11234567890"
                }
            }
        ]
    },
    {
        code: 'test-div2-728x90',
        mediaTypes: {
            banner: {
                sizes: [[728, 90]]
            }
        },
        bids: [
            {
                bidder: 'pixfuture',
                params: {
                    pix_id: "0987654321"
                }
            }
        ]
    }
];

## Additional "Send All Bids" Ad Server Keys

When using a "Send All Bids" setup with Google Ad Manager (GAM), target the following bidder-specific keys. Note that GAM truncates keys to 20 characters:

| **Key**                | **Description**       |
|-------------------------|-----------------------|
| `hb_pb_pixfuture`      | Bid price            |
| `hb_bidder_pixfuture`  | Bidder name          |
| `hb_adid_pixfuture`    | Ad ID                |
| `hb_size_pixfuture`    | Ad size              |
| `hb_source_pixfuture`  | Source of the bid    |
| `hb_format_pixfuture`  | Format of the bid    |
| `hb_cache_host_pixfut` | Cache host (truncated) |
| `hb_cache_id_pixfutur` | Cache ID (truncated)  |
| `hb_uuid_pixfuture`    | UUID                 |
| `hb_cache_path_pixfut` | Cache path (truncated) |
| `hb_deal_pixfuture`    | Deal ID              |

These keys can be used in GAM line items to target PixFuture bids. Contact [support@pixfuture.com](mailto:support@pixfuture.com) for assistance with deal support or advanced targeting.