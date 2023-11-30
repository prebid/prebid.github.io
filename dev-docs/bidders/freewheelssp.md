---
layout: bidder
title: FreeWheelssp
description: Freewheel Bidder Adaptor
pbjs: true
pbs: true
biddercode: freewheelssp
aliasCode: freewheel-ssp
gvl_id: 285
tcfeu_supported: true
usp_supported: true
gpp_supported: true
coppa_supported: true
schain_supported: true
media_types: video
ortb_blocking_supported: partial
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description | Example | Type     |
|----------|----------|-------------------------|--------|----------|
| `zoneId` | required | The zone ID for the ad. | "2003" | `string` |
| `format` | optional | The format to use for displaying the ad. Can be one of the following:*screen-roll* intext-roll*sliderad* floorad*expand-banner* instream* inbannerNote: The screen-roll, intext-roll, sliderad and floorad formats are all FreeWheel outstream formats.Default value: "instream" | "screen-roll" | `string` |
| `bidfloor` | optional | Bid floor price. | 13.2118  | `float` |
| `bidfloorcur` | optional | Bid floor currency. | "USD" | `string` |
| `vastUrlParams` | optional | Add query parameters to the vast request. Should be a single item level JSON.Works with formats: instream, inbanner | { protocolVersion:'3.0' } | `object` |

When the following params are used with instream or inbanner formats, they should be included in the `vastUrlParams` object. For other formats, they should be included directly in the `params` object:

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description | Example | Type     |
|----------|----------|-------------------------|--------|----------|
| `soundButton` | optional | If enabled, the sound will be off by default and the user will be able to turn it on/off by clicking on a button. (disabled on iOS devices)Default value: false | true | `boolean` |
| `defaultMute` | optional | If "soundButton=true" is set, controls if the video will start with the sound muted.Default value: true | false | `boolean` |
| `timeline` | optional | Display a progress bar to the bottom of the ad unit. Default value: false | true | `boolean` |
| `protocolVersion` | optional | Specify the VAST version that will be used for the vastVersion parameter value on AdsSetup request.Default Value: 4.2 | 3 .0 | `float` |
| `onOver` | optional | Allows to enable the sound only when the mouse is over the ad container. Works with formats: screen-roll, intext-roll, sliderad, floorad, expand-bannerDefault value: false | true | `boolean` |
| `closeTimeout` | optional | The duration in milliseconds before displaying the close button.Works with formats: screen-roll, intext-roll, sliderad, flooradDefault value: 5000 | 2000 | `integer` |
| `animated` | optional | Enable an animation on opening and on closing of the video.Works with formats: intext-roll, slideradDefault value: true | false | `boolean` |
| `animationSpeed` | optional | If the animated parameter is set to true, allows to choose the animation speed in milliseconds.Works with formats: intext-roll, slideradDefault value: 700 | 500 | `integer` |
| `contentId` | optional | Displays the ad inside the content-id dom element (dom id). Requires an 'auto', 'p' or 'article' param.Works with format: intext-roll | "element-id" | `string` |
| `auto` | optional | If value is set to "v2", position the intext-roll automatically. If contentId is set, the auto positioning will find a position inside the 'contentId' dom element.If contentId is not set, the auto positionaing will search the best position to display the ad based on the page semantic. It will select several possible position and show the intext-roll at the time one of them is made visible.Works with format: intext-rollDefault value: null | "v2" | `string` |
| `article` | optional | Set the location of the ad just after the given article tag in the page (0 is for the first article tag). If content-id is set, the article index is relative to articles inside the 'content-id' dom element | "element-id"Works with format: intext-roll | `string` |
| `p` | optional | Set the location of the ad just after the given paragraph tag in the page (0 is for the first p tag). If content-id is set, the p index is relative to paragraphs inside the 'content-id' dom element.Works with format: intext-roll | "element-id" | `string` |
| `iframeMode` | optional | Indicate to intext-roll that it is served in a friendly hidden iframe. Can be one of the following:*normal - place ad in friendly iframe* dfp - place ad in iframe on dfp platformWorks with format: intext-roll | "normal" | `string` |
| `inRead` | optional | When true, will keep the ad slot window on the page when the ad is done.Works with format: intext-rollDefault value: false | true | `boolean` |
| `lang` | optional | Text language. Can be one of: [fr,en,es,it,de,nl,pt]Works with format: intext-rollDefault value: "fr" | "en" | `string` |
| `openingTime` | optional | The time in milliseconds to display the opening animation.Works with format: intext-rollDefault value: 0 | 100 | `integer` |
| `pauseRatio` | optional | Specify the viewabilityratio where the ad is paused. This can be a float between 0 and 1, or "never" which means never paused. The default value will pause when the ad has less than 50% viewability.Works with formats: intext-roll, expand-bannerDefault value: 0.5 | 0.9 | `float` \| `string` |
| `closeAction` | optional | Define what to do for the banner after all ads complete. Can be one of:*collapse - will set the target css display property to "none".* hide - will leave the target element in place, empty.Works with formats: intext-roll, expand-bannerDefault value: “collapse” | "hide" | `string` |
| `domId` | optional | id of the dom element containing the text. If this targeted div is empty, be sure it has the needed width or a width of 0px will be used. Note that the script tag should be added in the page AFTER the targeted dom element so the target will be ready when the script runs.Works with formats: intext-roll, expand-banner | "element-id" | `string` |
| `errorAction` | optional | Define what to do for the banner after an ad error. Can be one of:*collapse - will set the target css display property to "none".* hide - will leave the target element in place, empty.Works with formats: intext-roll, expand-bannerDefault value: “collapse” | "hide" | `string` |
| `stickToTop` | optional | Controls if the ad will stick to the top of the browser window. Can be one of the following:*true - The ad will stick to the top of the browser window upon scroll. * "bottom" - The ad will stick to the top and will be hidden again when reaching the bottom of the page.* number - The ad will stick to the top for the given distance in pixels.Works with formats: intext-roll, expand-banner | 300 | `boolean \| string \| number` |
| `blurDisplay` | optional | Allow to choose between too blur effects for the sides of the banner. Can be one of:*big - will show the blured video only once in the background.* duplicate - will show the blured video twice: once for each side.Works with format: expand-bannerDefault value: "big" | "duplicate" | `string` |
| `expandDirection` | optional | Allows to force the expansion direction. Can be one of the following:*before - Expand to the left if the banner is vertical and to the top if the banner is horizontal.* after - Expand to the right if the banner is vertical and to the bottom if the banner is horizontal.*center - Expand to left and right if the banner is vertical. Expand to the top and bottom if the banner is horizontal.* auto - Expand based on the space available on the page. Expand to the left and/or right if the banner is vertical. and expand to the top and bottom if the banner is horizontal, depending on the space available.* none - Banner will not expandWorks with format: expand-bannerDefault value: "auto" | "before" | `string` |
| `zIndex` | optional | Force the z-index value on the ad container. The default value is around 4100 (see IAB guidelines). Use this parameter if it doesn't fit your needs.Works with format: expand-bannerDefault value: ~4100 | 1000 | `integer` |
| `hAlign` | optional | Horizontal side where to display the video. Can be one of:*left - horizontal align to the left of the page.* middle - horizontal align to the middle of the page.* right - horizontal align to the right of the page.Works with format: slideradDefault value: "right" | "left" | `string` |
| `hSpacing` | optional | Set a horizontal spacing between the hAlign side and the video.Works with format: slideradDefault value: 10 | 20 | `integer` |
| `vAlign` | optional | Vertical side where to display the video. Can be one of:*top - vertical align to the top of the page.* middle - vertical align to the middle of the page.* bottom - vertical align to the bottom of the page.Works with format: slideradDefault value: "bottom" | "top" | `string` |
| `vSpacing` | optional | Set a vertical spacing between the vAlign side and the video.Works with format: slideradDefault value: 10 | 20 | `integer` |
| `mod` | optional | Ad trigger mode. Can be one of:*asap - play the ad asap* click - play the ad when the user clicks a link* scroll - play the ad when the user scrollsWorks with format: screen-rollDefault value: "asap" | "click" | `string` |
| `opacity` | optional | Define the opacity of the background. This is a number between 0 (completely transparent) and 1 (totally black).Works with format: screen-rollDefault value: 0.4 | .5 | `float` |
| `smartPlay` | optional | Enable to use autoPlay on mobile devices.Works with format: screen-rollDefault value: false | true | `boolean` |
| `bannerHeight` | optional | The height in pixel of the bottom banner. The video ad takes this height when its not expanded.Works with format: flooradDefault value: 250 | 500 | `integer` |
