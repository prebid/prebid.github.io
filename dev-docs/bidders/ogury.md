---
layout: bidder
title: ogury
description: Ogury Bidder Adapter
biddercode: ogury
gdpr_supported: true
gvl_id: 31
usp_supported: false
coppa_supported: false
schain_supported: false
floors_supported: true
dchain_supported: false
media_types: banner
safeframes_ok: false
deals_supported: false
pbjs: true
pbs: false
prebid_member: false
sidebarType: 1
---
### Registration

 Before Ogury's adapter integration, you have to register an account in the Ogury Platform. Please contact <supply-development@ogury.co> if you're interested in a partnership.
If you already have an account you'll need to register your websites (= assets) and the placements (= ad units) within the Platform. Alternatively reach out to your POC within Ogury to assist you with the placement creation.
A detailed overview about the integration process can be found in [this documentation](https://ogury-ltd.gitbook.io/mobile-web/header-bidding/ogury-prebid.js-adapter-integration).

 After this registration, you will receive the Asset IDs and Ad Unit IDs to start the integration.

### Mandatory bid Params
The minimal list of bid params is:

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `assetKey`    | required | The asset key provided by Ogury   | `'OGY-CA41D116484F'` | `string`  |
| `adUnitId`    | required | Your ad unit id configured with Ogury | `'2c4d61d0-90aa-0139-0cda-0242ac120004'` | `string`  |

### Optional bid Params
The minimal list of bid params is:

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description           | Example   | Type      |
|----------------|----------|-----------------------|-----------|-----------|
| `skipSizeCheck`| optional |By default, the sizes field must include [1,1]. Otherwise the Ogury Bidder doesn't participate in the auction. However, if it isn't possible for some reasons to include it, you may use this option to enable bidding even on other sizes.| `true` | `boolean`  |

Depending on your advertising format needs, other optional parameters can be used. Supported parameters are detailed [here](https://ogury-ltd.gitbook.io/mobile-web/header-bidding/ogury-prebid.js-adapter-integration#optional-configuration).

## How to contact us
If you have any technical concerns or questions about the adapter, please contact <web.inventory@ogury.co>.