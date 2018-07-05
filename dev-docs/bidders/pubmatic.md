---
layout: bidder
title: PubMatic
description: Prebid PubMatic Bidder Adaptor
top_nav_section: dev_docs
nav_section: reference
hide: true
biddercode: pubmatic
biddercode_longer_than_12: false
prebid_1_0_supported : true
media_types: video
---

### Prebid Server Note:
Before configuring the PubMatic adapter as S2S, you must reach out to the PubMatic team for approval and setup steps.

### Prebid 1.0 Upgrade Note:
If you upgrading from a Prebid version prior to 1.0, please reach out to your PubMatic Customer Success Manager prior to your upgrade.  Publisher accounts need new settings to function correctly with the PubMatic Prebid 1.0 adapter and your Customer Success Manager will ensure your account is setup correctly.

### Banner Bid params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example |
| :--- | :---- | :---------- | :------ |
| `publisherId` | required | Publisher ID | "32572" |
| `adSlot` | required | Ad Unit ID | "38519891@300x250" |
| `pmzoneid` | optional | Zone ID | "zone1,zone2" |
| `lat` | optional | Latitude | "40.712775" |
| `lon` | optional | Longitude | "-74.005973" |
| `yob` | optional | Year of Birth | "1982" |
| `gender` | optional | Gender | "M" |
| `kadpageurl` | optional | Overrides Page URL | "http://www.yahoo.com/" |
| `kadfloor` | optional | Bid Floor | "1.75" |

### Configuration

PubMatic recommends the UserSync configuration below.  Without it, the PubMatic adapter will not able to perform user syncs, which lowers match rate and reduces monetization.

```javascript
pbjs.setConfig({
   userSync: {
    iframeEnabled: true,
    enabledBidders: ['pubmatic'],
    syncDelay: 6000
 }});
```

### Video Bid Params
The following video parameters are supported. For more information, see the video parameters in the OpenRTB specification.

{: .table .table-bordered .table-striped }
| Name 					 | Scope    | Description        										  | Example |
| :----------------------| :------- | :---------------------------------------------------------- | :------ |
| `publisherId` 		 | required | Publisher ID 												  | "32572" |
| `adSlot` 				 | required | Ad Unit ID  												  | "38519891@300x250" |
| `video.mimes` 		 | required | Content MIME types supported 								  | ["video/mp4", "application/x-shockwave-flash", "video/x-ms-wmv"] |
| `video.skippable` 	 | optional | Indicator for ability to skip video 						  | true/false |
| `video.minduration` 	 | optional | Minimum video ad duration in seconds 						  | 5  |
| `video.maxduration` 	 | optional | Maximum video ad duration in seconds 						  | 15 |
| `video.startdelay` 	 | optional | Start delay in seconds for pre/mid/post-roll ad placements. | 1  |
| `video.playbackmethod` | optional | Array of int listing playback methods supported 			  | Supported values: Auto-play sound on=1,Auto-play sound off=2,Click-to-play=3,Mouse-over=4 |
| `video.api` 			 | optional | API frameworks supported 									  | Supported values: 1=VPAID 1.0, 2=VPAID 2.0, 3=MRAID-1, 4=ORMMA, 5=MRAID-2 |
| `video.protocols` 	 | optional | Array of supported video bid response protocols 			  | Supported values: 1=VAST 1.0, 2=VAST 2.0, 3=VAST 3.0, 4=VAST 1.0 Wrapper, 5=VAST 2.0 Wrapper, 6=VAST 3.0 Wrapper |
| `video.battr` 		 | optional | Blocked creative attributes 								  | [3,6] |
| `video.linearity` 	 | optional | Indicates if the impression is linear or nonlinear. 		  | Supported values: 1=Linear/In-Stream, 2=Non-Linear/Overlay |
  `placement`			 | optional | Placement type for the impression							  | Supported values: 1=In
-
Stream,2=In Banner,3=In Article,4=In Feed,5=Interstitial/Slider/Floating
| `video.minbitrate` 	 | optional | Minumim bit rate in Kbps. 								  | 50 |
| `video.maxbitrate` 	 | optional | Maximum bit rate in Kbps. 								  | 70 |

### AdUnit Format for Video
```javascript
var videoAdUnits = [
{
    code: 'test-div-video',
    mediaTypes: {
        video: {
            playerSize: [640, 480],           // required
            context: 'instream'
        }
    },
    bids: [{
      bidder: 'pubmatic',
      params: {
        publisherId: '32572',                     // required
        adSlot: '38519891@300x250',              // required
        video: {
          mimes: ['video/mp4','video/x-flv'],   // required
          skippable: true,                      // optional
          minduration: 5,                       // optional
          maxduration: 30,                      // optional
          startdelay: 5,                        // optional
          playbackmethod: [1,3],                // optional
          api: [ 1, 2 ],                        // optional
          protocols: [ 2, 3 ],                  // optional
          battr: [ 13, 14 ],                    // optional
          linearity: 1,                         // optional
          placement: 2,                         // optional
          minbitrate: 10,                       // optional
          maxbitrate: 10                        // optional
        }
      }
    }]
}]
```


### Configuration for video 
For Video ads, prebid cache needs to be enabled for PubMatic adapter.
```
pbjs.setConfig({
    debug: true,
    cache: {
        url: 'https://prebid.adnxs.com/pbc/v1/cache'
    }
});
```

Note: Combine the above the configuration with any other UserSync configuration. Multiple setConfig() calls overwrite each other and only last call for a given attribute will take effect.
