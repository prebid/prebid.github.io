### Ad Position

The `adPosition` property allows developers to specify the position of the ad within the publisher's content. This property maps to the `pos` field in the OpenRTB specification under the `imp[].banner` or `imp[].video` objects, depending on the ad format. The possible values for this field could be found in the [respective specification](https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/main/AdCOM%20v1.0%20FINAL.md#list--placement-positions-).

You can set `adPosition` by using the following property: 

```swift
adUnit.adPosition = .footer
```