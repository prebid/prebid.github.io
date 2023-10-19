---
layout: bidder
title: Connatix
description: Connatix Bidder Adapter
biddercode: connatix
gdpr_supported: false
gvl_id: 143
usp_supported: false
coppa_supported: false
gpp_supported: false
schain_supported: false
dchain_supported: false
userId: none
media_types: banner
safeframes_ok: true
deals_supported: true
floors_supported: true
fpd_supported: false
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: true
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `placementId`      | required | Placement id         | `'ed8a9c16-88ea-4724-aa0d-013c3e595e49'`    | `string` |
| `bidfloor`      | optional | Floor price         | `2.5`    | `float` |

#### Example

```js
var adUnits = [
	{
		code: '1',
		mediaTypes: {
			video: {
				sizes: [[640, 480], [320, 180]],
			},
		},
		bids: [
			{
				bidder: 'connatix',
				params: {
					placementId: 'e4984e88-9ff4-45a3-8b9d-33aabcad634e', //required
				},
			},
			// Add more bidders and their parameters as needed
		],
	},
	// Define more ad units here if necessary
```

### Configuration

Connatix requires that ```iframe``` is used for user syncing.

#### Example configuration:

```js
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: '*', // represents all bidders
        filter: 'include'
      }
    }
  }
});
```