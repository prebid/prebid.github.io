{: .alert.alert-info :}
**Important:** DFP has a key-value key character [limit](https://support.google.com/dfp_premium/answer/1628457?hl=en#Key-values) of up to **20 characters**. Prebid.js automatically truncates the key length to 20 characters. For example, `hb_adid_audienceNetwork` is truncated to `hb_adid_audienceNetw`. Note that the key is case-sensitive. To get the exact key-value keys for each bidder, find them at [Bidder Params](/dev-docs/bidders.html).

{: .table .table-bordered .table-striped }
| Default Key   | Scope    | Description                                                                                     | Example   |
| :----         |:----     | :----                                                                                           | :----     |
| `hb_pb_BIDDERCODE`       | Required | The price bucket. Used by the line item to target. Case sensitive and truncated to 20 chars. The `BIDDERCODE` is documented at [Bidder Params](/dev-docs/bidders.html). | `hb_pb_rubicon` = `2.10`    |
| `hb_adid_BIDDERCODE`     | Required | The ad Id. Used by the ad server creative to render ad. Case sensitive and truncated to 20 chars. The `BIDDERCODE` is documented at [Bidder Params](/dev-docs/bidders.html). | `hb_adid_indexExchang` = `234234`  |
| `hb_size_BIDDERCODE`   | Optional | This is not required for adops. Case sensitive and truncated to 20 chars. | `hb_size_appnexus` = `300x250` |

