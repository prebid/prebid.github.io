#### Prebid Server-side Rewarded Configuration

You can pass some rewarded configuration properties from PBS to the SDK using the `ext.prebid.passthrough` object, [supported](https://docs.prebid.org/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#request-passthrough) by Prebid Server, in the stored impression-level request. The rewarded configuration could be placed in `ext.prebid.passthrough[].rwdd` object.

Here is the details about rewarded configuration object `rwdd`:

{: .table .table-bordered .table-striped }
| Attribute            | Required?      | Description                                                                                                           | Example                                                  | Type     |
|----------------------|----------------|-----------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------|----------|
| `reward`             | Yes            | Metadata provided by the publisher to describe the reward                                                             | `{"type": "SuperDollars", "count": 10}`                  | object   |
| `reward.type`        | Yes            | Type of the reward in the app's coins                                                                                 | `"SuperDollars"`                                         | string   |
| `reward.count`       | Yes            | Amount of coins                                                                                                       | `10`                                                     | integer  |
| `reward.ext`         | No             | For future extensions                                                                                                 | `null`                                                   | object   |
| `completion`         | No             | Describes the condition when the SDK should send a signal to the app that the user has earned the reward               | `{ "video": { "endcard": { "time": 5 } } }`              | object   |
| `completion.banner`  | No             | Details for banner ad completion                                                                                      | `{ "time": 5, "event": "custom_event_url" }`             | object   |
| `completion.banner.time`   | No     | Period of time the banner ad is on screen                                                                             | `5`                                                      | integer  |
| `completion.banner.event`  | No     | URL with custom schema sent by the creative                                                                           | `"rwdd://userDidEarnReward"`                                      | string   |
| `completion.video`   | No             | Details for video ad completion                                                                                       | `{ "endcard": { "time": 5 } }`                           | object   |
| `completion.video.time`    | No     | Period of time the video ad is on screen                                                                              | `10`                                                     | integer  |
| `completion.video.playbackevent` | No  | The playback event stage in the video                                                                                 | `"start"`, `"firstquartile"`, `"midpoint"`, `"thirdquartile"`, `"complete"` | string   |
| `completion.video.endcard` | No       | Properties for end card, same as banner ad                                                                            | `{ "time": 5 }`                                          | object   |
| `completion.video.endcard.time` | No  | Period of time the end card is on screen                                                                              | `5`                                                      | integer  |
| `completion.video.endcard.event` | No  | URL with custom schema sent by the creative for end card                                                              | `"rwdd://userDidEarnReward"`                                     | string   |
| `close`              | No             | Describes close behavior after reward is earned                                                                       | `{ "postrewardtime": 3, "action": "autoclose" }`         | object   |
| `close.postrewardtime` | No           | Time interval (seconds) after reward event when SDK should close interstitial                                         | `3`                                                      | integer  |
| `close.action`       | No             | Action SDK should take: `"autoclose"` (close interstitial) or `"closebutton"` (show close button)                     | `"autoclose"`                                            | string   |


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
