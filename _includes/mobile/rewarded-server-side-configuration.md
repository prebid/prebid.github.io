##### Server-side Rewarded Ad Unit Configuration

The Rewarded Ad Unit assumes special behavior that should be configurable by the platform or publisher according to the application or ad experience guides.  

Configuration of rewarded ad unit can be done by defining the Prebid Server [passthrough extension](https://docs.prebid.org/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#request-passthrough) or by using a stored impression-level request on the server.

Prebid SDK will search for a particular `rwdd` object in `$.seatbid.bid.ext.prebid.passthrough` of bid response to configure the behavior and rendering of the Rewarded Ad Unit. The following table describes the structure and usage purpose of `rwdd` configuration parameters.  

{: .table .table-bordered .table-striped }
| Attribute | Type | Description | Example |  
|-----------|------|-------------|---------|
| `reward`             | object <br> (optional)   | Metadata provided by the publisher to describe the reward.                                                             |<code>{<br>&nbsp;"type": "SuperDollars",<br>&nbsp;"count": 10<br>}</code> | 
| `reward.type`        | string   | Type of the reward in the app's coins. | `"SuperDollars"` | 
| `reward.count`       | integer  | Amount of coins. | `10` | 
| `reward.ext`         | object   | For future extensions. | <code>{<br>&nbsp;"ext": {}<br>}</code> | 
| `completion`         | object <br> (optional)   | Describes the condition when the SDK should send a signal to the app that the user has earned the reward. |<code>{<br>&nbsp;"video": {<br>&nbsp;&nbsp;"endcard": {<br>&nbsp;&nbsp;&nbsp;"time": 5 <br>&nbsp;&nbsp;&nbsp;} <br>&nbsp;&nbsp;} <br>}</code> | 
| `completion.banner`  | object   | Details for banner ad completion. |<code>{<br>&nbsp;"time": 5,<br>&nbsp;"event": "custom_event_url" <br>}</code> | 
| `completion.banner.time`   | integer  | Period of time the banner ad is on screen. | `5` | 
| `completion.banner.event`  | string   | URL with custom schema sent by the creative to indicate that the user did earn a reward. | `"rwdd://userDidEarnReward"` | 
| `completion.video`   | object   | Details for video ad completion. |<code>{<br>&nbsp;"endcard": {<br>&nbsp;&nbsp;"time": 5 <br>&nbsp;} <br>}</code> | 
| `completion.video.time`    | integer  | Period of time the video ad is on screen. | `10` | 
| `completion.video.playbackevent` | string   | The playback event stage in the video. | `"start"`, `"firstquartile"`, `"midpoint"`, `"thirdquartile"`, `"complete"` | 
| `completion.video.endcard` | object   | Properties for the end card. |<code>{<br>&nbsp;"time": 5 <br>}</code> | 
| `completion.video.endcard.time` | integer  | Period of time the end card is on screen. | `5` | 
| `completion.video.endcard.event` | string   | URL with custom schema sent by the creative for end card. | `"rwdd://userDidEarnReward"` | 
| `close`              | object <br> (optional)   | Describes the ad close behavior after the reward is earned. |<code>{<br>&nbsp;"postrewardtime": 3,<br>&nbsp;"action": "autoclose"<br>}</code> | 
| `close.postrewardtime` | integer  | Time interval (seconds) after reward event when SDK should close interstitial. | `3` | 
| `close.action`       | string   | Action SDK should make: `"autoclose"` (close interstitial) or `"closebutton"` (show close button) | `"autoclose"` | 


An example of an impression-level stored request:

```json
{
  "video": {
    "h": 480,
    "w": 320,
    "mimes": ["video/mp4"],
    "linearity": 1,
    "placement": 2,
    "playbackmethod": [2]
  },
  "ext": {
    "prebid": {
      "passthrough": [
        {
          "type": "prebidmobilesdk",
          "rwdd": {
            "reward": {
              "type": "SuperDollars",
              "count": 10
            },
            "completion": {
              "video": {
                "endcard": {
                  "time": 5
                }
              }
            },
            "close": {
              "postrewardtime": 3,
              "action": "autoclose"
            }
          }
        }
      ]
    }
  }
}
```

More details about the SDK behavior according to the `rwdd` configuration you can find in the [GitHub Proposal](https://github.com/prebid/prebid-mobile-ios/pull/1058).
