The Ad Operations team will need to create line items in GAM. The creatives used depend on which media formats your adunits can utilize.

{: .table .table-bordered .table-striped }
| Format | Line Item Targeting | Creative Type | Prebid Cache? | Ad Ops Details |
| --- | --- | --- | --- | --- |
| HTML banner, interstitial banner | hb_pb<br/>hb_format=banner | 3rd party HTML that loads the [PUC](/overview/prebid-universal-creative.html) | yes | [link](/adops/gam-creative-banner-sbs.html) |
| Video (instream, non-instream, interstitial) | hb_pb<br/>hb_format=video<br/>inventoryType=(instream, mobile app) | VastUrl pointing to Prebid Cache | yes | [link](/adops/setting-up-prebid-video-in-dfp.html) |
| Rewarded Video | hb_pb<br/>hb_format=video<br/>inventoryType=(instream, mobile app)<br/>rewarded adunits | VastUrl pointing to Prebid Cache | yes | [link](/adops/setting-up-prebid-video-in-dfp.html) |
| In-app native | hb_pb<br/>hb_format=native | GAM native | no | [link](/adops/gam-native.html#create-mobile-in-app-creative) |
| In-Webview native | hb_pb<br/>hb_format=native | 3rd party HTML that loads the native-trk script. | yes | [link](/adops/gam-native.html) |

Notes:

- You may need up to 4 sets of line items to support Prebid Mobile depending on adunit types. If you also run Prebid.js or AMP, please see [line item considerations](/adops/line-item-creation.html#the-big-picture) for more information.
- Use the Prebid Cache column to communicate with the Prebid Server team. They can set up the "top-level stored request" for your account to cache or not cache requests as needed.

### Rendering and Tracking

This information may be useful when comparing data across various reporting systems:

{: .table .table-bordered .table-striped }
| Scenario | Creative: PUC | Creative: VastUrl | Creative: GAM Native |
| --- | --- | --- | --- |
| Rendering Method | PUC in iframe | GMA SDK player | App code with data from PBSDK |
| Fires Prebid win event | always | never | always |
| Fires Prebid imp event | never | VAST impression tag | never |
| Fires OpenRTB burl | when in view | n/a | never (1) |
| Fires OpenRTB nurl | always |  n/a | always |
| Fires OpenMeasurement events | GMA SDK |  n/a | PB SDK |

Notes:

1. OpenRTB burl and nurl will be utilized in a future release.
