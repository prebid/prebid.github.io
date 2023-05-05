---
layout: bidder
title: ViewdeosDX Client
description: Prebid.js ViewDeos Bidder Adapter
pbjs: true
pbs: false
biddercode: viewdeosDX
media_types: banner,video
gdpr_supported: true
gvl_id: 924
sidebarType: 1
---

Note that for Prebid Server, use "viewdeos" bidder code.

### Bid params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                     | Example  | Type      |
|-------|----------|---------------------------------|----------|-----------|
| `aid` | required | The source ID from member zone | `350975` | `integer` |
| `outstream` | optional | Oustream player settings object | `{"audio_setting":"on","video_controls":"show"}` | `object` |

#### Oustream settings object

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description                     | Example  | Type      |
|-------|----------|---------------------------------|----------|-----------|
| `type` | optional | allows to set the outstream type to one of inread/inbanner/interstitial/slider  | `'inbanner'` | `string` |
| `audio_setting` | optional | allows to set audio settings, set to one of: on/muted/hover  | `'hover'` | `string` |
| `video_controls` | optional |  enables or disables the visibility of controls, set to one of: show/hide/hover | `'show'` | `string` |
| `close_button_options` | optional |  allows to choose when/if it is needed to show the "close" button, set to one of: delay/not_show/based_on | `'delay'` | `string` |
| `view_out_action` | optional |  allows to apply the action type to an outstream unit when it is out of the visible zone, set to one of: jump/detach/continue_playing_muted/close/continue_playing/pause | `'pause'` | `string` |
| `default_volume` | optional | allows to set the volume of outstream video ad 0-100 | `45` | `integer` |
| `percent_visible_before_show` | optional | allows to setup visible percentage of an outstream unit to play 0-100 | `60` | `integer` |
| `is_countdown_show` | optional | allows to enable/disable a countdown before the "close" button appears 0 - is enabled 1 - is disabled | `1` | `integer` |
| `countdown_time` | optional | allows to set up how long the countdown will last and show it to the user. | `5` | `integer` |
| `close_button_delay` | optional | allows to set a delay before showing close button | `5` | `integer` |
| `disengagement_delay` | optional | allows to set a delay before actions selected in desangagement_method parameter | `5` | `integer` |
| `disengagement_method` | optional | is applicable solely to Interstitial units allowing determine the actions that can be applied to the player, set to one of: close_button/detach_button/no/auto_detach | `'close_button'` | `string` |
| `event_for_expand` | optional | allows to select when outstream unit should be expanded, set to one of: on_start_ad/on_load_ad | `'on_load_ad'` | `string` |
| `detach_location_on page` | optional | allows to select the location where you want the detached player to be placed, set to one of: bottom_right/fullscreen/bottom_left/center_left/center_right/top_right/top_left | `'top_left'` | `string` |
| `animation_mode` | optional | allows to control your outstream unit's animation mode on the webpage, set to one of: ease/ease_in/ease_out/step_start/linear | `'ease'` | `string` |
| `detach_width` | optional | detached player's width in pixels | `300` | `integer` |
| `detach_height` | optional | detached player's height in pixels | `200` | `integer` |

### Test Parameters
```
    var adUnits = [

      // Video instream adUnit
      {
        code: 'div-test-div',
        mediaTypes: {
          video: {
            playerSize:[640, 480],
            context: 'instream'
          }
        },
        bids: [{
          bidder: 'viewdeosDX',
          params: {
            aid: 331133
          }
        }]
      },

      // Video outstream adUnit
      {
        code: 'outstream-test-div',
        mediaTypes: {
          video: {
            playerSize:[640, 480],
            context: 'outstream'
          }
        },
        bids: [{
          bidder: 'viewdeosDX',
          params: {
            aid: 331133
          }
        }]
      },

      // Banner adUnit
      {
        code: 'div-test-div',
        mediaTypes: {
          banner: {
            sizes:[[300, 250]]
          }
        },
        bids: [{
          bidder: 'viewdeosDX',
          params: {
            aid: 350975
          }
        }]
      }
    ];
```
