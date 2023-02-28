---
layout: bidder
title: Datawrkz
description: Prebid Datawrkz Bidder Adaptor
biddercode: datawrkz
media_types: banner, video, native
gdpr_supported: true
prebid_member: false
coppa_supported: true
usp_supported: true
floors_supported: true
pbjs: true
deals_supported: true
sidebarType: 1
---

### Note:

The Datawrkz Bidding adapter requires setup before beginning. Please contact us at pubops@datawrkz.com

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Type | Description | Example
| ---- | ----- | ---- | ----------- | -------
| `site_id` | required | String | Site id  | "test_site_id"
| `deals` | optional | Array<Deal> | Array of deal objects | `[{id: "deal_1"},{id: "deal_2"}]`
| `bidfloor` | optional | Float | Minimum bid for this impression expressed in CPM | `0.5`
| `outstreamType` | optional | String | Type of outstream video to the played. Available options: inline, slider_top_left, slider_top_right, slider_bottom_left, slider_bottom_right, interstitial_close, and listicle | "inline"
| `outstreamConfig` | optional | Object | Configuration settings for outstream ad unit | `{ad_unit_audio: 1, show_player_close_button_after: 5, hide_player_control: 0}`

### Deal Object

{: .table .table-bordered .table-striped }
| Name | Scope | Type | Description | Example
| ---- | ----- | ---- | ----------- | -------
| `id` | required | String | Deal id  | "test_deal_id"

### Outstream Config Object

{: .table .table-bordered .table-striped }
| Name | Scope | Type | Description | Example
| ---- | ----- | ---- | ----------- | -------
| `ad_unit_audio` | optional | Integer | Set default audio option for the player. 0 to play audio on hover and 2 to mute | `0` or `2`
| `show_player_close_button_after` | optional | Integer | Show player close button after specified seconds | `5`
| `hide_player_control` | optional | Integer | Show/hide player controls. 0 to show player controls and 1 to hide | `1`