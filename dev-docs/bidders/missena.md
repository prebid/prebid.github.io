---
layout: bidder
title: Missena
description: Prebid Missena Bidder Adapter
biddercode: missena
gvl_id: 867
pbjs: true
pbs: true
safeframes_ok: false
sidebarType: 1
pbs_app_supported: true
prebid_member: true
---

### Note

The Missena Bidding adapter requires setup before beginning. Please contact us at <jney@missena.com>

### Bid params

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                | Example         | Type     |
|------------|----------|----------------------------|-----------------|----------|
| `apiKey`   | required | Missena's publisher token  | `'PA-34745704'` | `string` |
| `placement`   | optional | Placement Type, default: 'sticky' | `'sticky'` | `string` |
| `formats`  | optional | An array of formats to request (banner, native, or video) | `['banner', 'video']` | `array` |
| `settings` | optional | An object containing extra settings for the Missena adapter | `{ settingName: 'value' }` | `object` |

#### Available Placement Values

The `placement` parameter accepts the following values:

- `sticky` - Default sticky placement
- `header` - Header placement
- `footer` - Static footer placement
- `prestitial` - Full-screen ad before content loads
- `postitial` - Full-screen ad after content loads
