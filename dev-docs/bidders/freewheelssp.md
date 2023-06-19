---
layout: bidder
title: FreeWheelssp
description: Freewheel Bidder Adaptor
pbjs: true
pbs: true
biddercode: freewheelssp
aliasCode: freewheel-ssp
gvl_id: 285
gdpr_supported: true
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
| `format` | optional | The format to use for displaying the ad. Can be one of the following:<br/>* screen-roll<br/>* intext-roll<br/>* sliderad<br/>* floorad<br/>* expand-banner<br/>* instream<br/>* inbanner<br/>Note: The screen-roll, intext-roll, sliderad and floorad formats are all FreeWheel outstream formats.<br>Default value: "instream" | "screen-roll" | `string` |
| `bidfloor` | optional | Bid floor price. | 13.2118  | `float` |
| `bidfloorcur` | optional | Bid floor currency. | "USD" | `string` |
| `vastUrlParams` | optional | Add query parameters to the vast request. Should be a single item level JSON.<br>Works with formats: instream, inbanner | { protocolVersion:'3.0' } | `object` |

When the following params are used with instream or inbanner formats, they should be included in the `vastUrlParams` object. For other formats, they should be included directly in the `params` object:

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description | Example | Type     |
|----------|----------|-------------------------|--------|----------|
| `soundButton` | optional | If enabled, the sound will be off by default and the user will be able to turn it on/off by clicking on a button. (disabled on iOS devices)<br/>Default value: false | true | `boolean` |
| `defaultMute` | optional | If "soundButton=true" is set, controls if the video will start with the sound muted.<br/>Default value: true | false | `boolean` |
| `timeline` | optional | Display a progress bar to the bottom of the ad unit.<br/> Default value: false | true | `boolean` |
| `protocolVersion` | optional | Specify the VAST version that will be used for the vastVersion parameter value on AdsSetup request.<br/>Default Value: 4.2 | 3 .0 | `float` |
| `onOver` | optional | Allows to enable the sound only when the mouse is over the ad container.<br/> Works with formats: screen-roll, intext-roll, sliderad, floorad, expand-banner<br/>Default value: false | true | `boolean` |
| `closeTimeout` | optional | The duration in milliseconds before displaying the close button.<br/>Works with formats: screen-roll, intext-roll, sliderad, floorad<br/>Default value: 5000 | 2000 | `integer` |
| `animated` | optional | Enable an animation on opening and on closing of the video.<br/>Works with formats: intext-roll, sliderad<br/>Default value: true | false | `boolean` |
| `animationSpeed` | optional | If the animated parameter is set to true, allows to choose the animation speed in milliseconds.<br/>Works with formats: intext-roll, sliderad<br/>Default value: 700 | 500 | `integer` |
| `contentId` | optional | Displays the ad inside the content-id dom element (dom id). Requires an 'auto', 'p' or 'article' param.<br/>Works with format: intext-roll | "element-id" | `string` |
| `auto` | optional | If value is set to "v2", position the intext-roll automatically. If contentId is set, the auto positioning will find a position inside the 'contentId' dom element.<br/>If contentId is not set, the auto positionaing will search the best position to display the ad based on the page semantic. It will select several possible position and show the intext-roll at the time one of them is made visible.<br/>Works with format: intext-roll<br/>Default value: null | "v2" | `string` |
| `article` | optional | Set the location of the ad just after the given article tag in the page (0 is for the first article tag). If content-id is set, the article index is relative to articles inside the 'content-id' dom element | "element-id"<br/>Works with format: intext-roll | `string` |
| `p` | optional | Set the location of the ad just after the given paragraph tag in the page (0 is for the first p tag). If content-id is set, the p index is relative to paragraphs inside the 'content-id' dom element.<br/>Works with format: intext-roll | "element-id" | `string` |
| `iframeMode` | optional | Indicate to intext-roll that it is served in a friendly hidden iframe. Can be one of the following:<br/>* normal - place ad in friendly iframe<br/>* dfp - place ad in iframe on dfp platform<br/>Works with format: intext-roll | "normal" | `string` |
| `inRead` | optional | When true, will keep the ad slot window on the page when the ad is done.<br/>Works with format: intext-roll<br/>Default value: false | true | `boolean` |
| `lang` | optional | Text language. Can be one of: [fr,en,es,it,de,nl,pt]<br/>Works with format: intext-roll<br/>Default value: "fr" | "en" | `string` |
| `openingTime` | optional | The time in milliseconds to display the opening animation.<br/>Works with format: intext-roll<br/>Default value: 0 | 100 | `integer` |
| `pauseRatio` | optional | Specify the viewabilityratio where the ad is paused. This can be a float between 0 and 1, or "never" which means never paused. The default value will pause when the ad has less than 50% viewability.<br/>Works with formats: intext-roll, expand-banner<br/>Default value: 0.5 | 0.9 | `float` \| `string` |
| `closeAction` | optional | Define what to do for the banner after all ads complete. Can be one of:<br/>* collapse - will set the target css display property to "none".<br/>* hide - will leave the target element in place, empty.<br/>Works with formats: intext-roll, expand-banner<br/>Default value: “collapse” | "hide" | `string` |
| `domId` | optional | id of the dom element containing the text. If this targeted div is empty, be sure it has the needed width or a width of 0px will be used. Note that the script tag should be added in the page AFTER the targeted dom element so the target will be ready when the script runs.<br/>Works with formats: intext-roll, expand-banner | "element-id" | `string` |
| `errorAction` | optional | Define what to do for the banner after an ad error. Can be one of:<br/>* collapse - will set the target css display property to "none".<br/>* hide - will leave the target element in place, empty.<br/>Works with formats: intext-roll, expand-banner<br/>Default value: “collapse” | "hide" | `string` |
| `stickToTop` | optional | Controls if the ad will stick to the top of the browser window. Can be one of the following:<br/>* true - The ad will stick to the top of the browser window upon scroll. <br/>* "bottom" - The ad will stick to the top and will be hidden again when reaching the bottom of the page.<br/>* number - The ad will stick to the top for the given distance in pixels.<br/>Works with formats: intext-roll, expand-banner | 300 | `boolean \| string \| number` |
| `blurDisplay` | optional | Allow to choose between too blur effects for the sides of the banner. Can be one of:<br/>* big - will show the blured video only once in the background.<br/>* duplicate - will show the blured video twice: once for each side.<br/>Works with format: expand-banner<br/>Default value: "big" | "duplicate" | `string` |
| `expandDirection` | optional | Allows to force the expansion direction. Can be one of the following:<br/>* before - Expand to the left if the banner is vertical and to the top if the banner is horizontal.<br/>* after - Expand to the right if the banner is vertical and to the bottom if the banner is horizontal.<br/>* center - Expand to left and right if the banner is vertical. Expand to the top and bottom if the banner is horizontal.<br/>* auto - Expand based on the space available on the page. Expand to the left and/or right if the banner is vertical. and expand to the top and bottom if the banner is horizontal, depending on the space available.<br/>* none - Banner will not expand<br/>Works with format: expand-banner<br/>Default value: "auto" | "before" | `string` |
| `zIndex` | optional | Force the z-index value on the ad container. The default value is around 4100 (see IAB guidelines). Use this parameter if it doesn't fit your needs.<br/>Works with format: expand-banner<br/>Default value: ~4100 | 1000 | `integer` |
| `hAlign` | optional | Horizontal side where to display the video. Can be one of:<br/>* left - horizontal align to the left of the page.<br/>* middle - horizontal align to the middle of the page.<br/>* right - horizontal align to the right of the page.<br/>Works with format: sliderad<br/>Default value: "right" | "left" | `string` |
| `hSpacing` | optional | Set a horizontal spacing between the hAlign side and the video.<br/>Works with format: sliderad<br/>Default value: 10 | 20 | `integer` |
| `vAlign` | optional | Vertical side where to display the video. Can be one of:<br/>* top - vertical align to the top of the page.<br/>* middle - vertical align to the middle of the page.<br/>* bottom - vertical align to the bottom of the page.<br/>Works with format: sliderad<br/>Default value: "bottom" | "top" | `string` |
| `vSpacing` | optional | Set a vertical spacing between the vAlign side and the video.<br/>Works with format: sliderad<br/>Default value: 10 | 20 | `integer` |
| `mod` | optional | Ad trigger mode. Can be one of:<br/>* asap - play the ad asap<br/>* click - play the ad when the user clicks a link<br/>* scroll - play the ad when the user scrolls<br/>Works with format: screen-roll<br/>Default value: "asap" | "click" | `string` |
| `opacity` | optional | Define the opacity of the background. This is a number between 0 (completely transparent) and 1 (totally black).<br/>Works with format: screen-roll<br/>Default value: 0.4 | .5 | `float` |
| `smartPlay` | optional | Enable to use autoPlay on mobile devices.<br/>Works with format: screen-roll<br/>Default value: false | true | `boolean` |
| `bannerHeight` | optional | The height in pixel of the bottom banner. The video ad takes this height when its not expanded.<br/>Works with format: floorad<br/>Default value: 250 | 500 | `integer` |
