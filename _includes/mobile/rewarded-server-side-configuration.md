#### Server-side Rewarded Ad Unit Configuration

The Rewarded Ad Unit assumes special behavior that should be configurable by the platform or publisher according to the application or ad experience guides.  

Configuration of rewarded ad unit can be done using stored impression-level stored request and the [passthrough](https://docs.prebid.org/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#request-passthrough) feature of Prebid Server. 

Prebid SDK will search for a particular `rwdd` object in `ext.prebid.passthrough` of bid response to configure the behavior of the Rewarded Ad Unit. The following table describes the structure and usage purpose of `rwdd` configuration parameters.


{: .table .table-bordered .table-striped }

| Attribute            | Description                                                                                                           | Example                                                  | Type     |
|----------------------|-----------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------|----------|
| `reward`             | Metadata provided by the publisher to describe the reward                                                             | `{"type": "SuperDollars", "count": 10}`                  | object   |
| `reward.type`        | Type of the reward in the app's coins                                                                                 | `"SuperDollars"`                                         | string   |
| `reward.count`       | Amount of coins                                                                                                       | `10`                                                     | integer  |
| `reward.ext`         | For future extensions                                                                                                 | `{"ext":{}}`                                                   | object   |
| `completion`         | Describes the condition when the SDK should send a signal to the app that the user has earned the reward               | `{ "video": { "endcard": { "time": 5 } } }`              | object   |
| `completion.banner`  | Details for banner ad completion                                                                                      | `{ "time": 5, "event": "custom_event_url" }`             | object   |
| `completion.banner.time`   | Period of time the banner ad is on screen                                                                             | `5`                                                      | integer  |
| `completion.banner.event`  | URL with custom schema sent by the creative                                                                           | `"rwdd://userDidEarnReward"`                                      | string   |
| `completion.video`   | Details for video ad completion                                                                                       | `{ "endcard": { "time": 5 } }`                           | object   |
| `completion.video.time`    | Period of time the video ad is on screen                                                                              | `10`                                                     | integer  |
| `completion.video.playbackevent` | The playback event stage in the video                                                                                 | `"start"`, `"firstquartile"`, `"midpoint"`, `"thirdquartile"`, `"complete"` | string   |
| `completion.video.endcard` | Properties for end card, same as banner ad                                                                            | `{ "time": 5 }`                                          | object   |
| `completion.video.endcard.time` | Period of time the end card is on screen                                                                              | `5`                                                      | integer  |
| `completion.video.endcard.event` | URL with custom schema sent by the creative for end card                                                              | `"rwdd://userDidEarnReward"`                                     | string   |
| `close`              | Describes close behavior after reward is earned                                                                       | `{ "postrewardtime": 3, "action": "autoclose" }`         | object   |
| `close.postrewardtime` | Time interval (seconds) after reward event when SDK should close interstitial                                         | `3`                                                      | integer  |
| `close.action`       | Action SDK should take: `"autoclose"` (close interstitial) or `"closebutton"` (show close button)                     | `"autoclose"`                                            | string   |


An example of a stored impression-level request:

```json
{
  "ext": {
    "prebid": {
      "storedauctionresponse": {
        "id": "prebid-response-video-rewarded-endcard"
      },
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
