---
layout: bidder
title: HuaweiAds
description: Prebid HuaweiAds Bidder Adapter
biddercode: huaweiads
gvl_id: 856
media_types: banner, video, native
tcfeu_supported: true
coppa_supported: true
safeframes_ok: false
deals_supported: true
pbjs: false
pbs: true
pbs_app_supported: true
prebid_member: false
sidebarType: 1
---

### Note

The Huawei Bidding adapter requires setup and approval before implementation. Please contact us at [developereu@huawei.com](mailto:developereu@huawei.com), also you can [submit a ticket online](https://developer.huawei.com/consumer/en/support/feedback/#/).

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description  | Example   | Type     |
|---------------|----------|--------------|-----------|----------|
| `publisherid` | required | Publisher Id | `'2001000399'` | `string` |
| `signkey` | required | Sign Key | `'5d********82c38594f8b2bdfd9f********a398dca734932898e3********8d'` | `string` |
| `keyid` | required | Key Id | `'2'` | `string` |
| `slotid` | required | Slot Id | `'u42ohmaufh'` | `string` |
| `adtype` | required | Ad Type | `'banner','native','interstitial','rewarded'` | `string` |

Notes:

1. The following parameters need to be registered on the HuaweiAds platform, and at the same time, the permission to access the server interface needs to be opened on the HuaweiAds platform.
2. You can find publisherid, signkey, and keyid on the platform after registration.
3. You need to create your advertising creative on the platform and get the corresponding slotid and adtype.
4. We require OAID (Open Advertising ID) or GAID (Google Advertising ID) in the request. OAID and GAID are non-permanent device identifiers that allow personalized ads to be served to users while protecting user data privacy. In most cases, OAID is used for HMS phones and GAID is used for GMS phones. GAID is collected by default. For OAID on HMS phones, app developers should call the AdvertisingIdClient.getAdvertisingIdInfo(mContext) method to [obtain the OAID](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides/identifier-service-obtaining-oaid-sdk-0000001050064988), then add the OAID to the request using the Prebid SDK as shown below.
5. The auction will use the Prebid Server time zone, but this can be by developers if they send the `clientTime` targeting parameter to the HuaweiAds Adx server using the Prebid SDK. For example: `TargetingParams.addUserData("clientTime", "2018-11-02 16:34:07.981+0800")`. 

### Obtain the OAID

```java
// Add the OAID to user data in prebid initialization
if ( isHmsAvailable() ) {
    TargetingParams.addUserData(“oaid”, AdvertisingIdClient.Info info = AdvertisingIdClient.getAdvertisingIdInfo(getApplicationContext()).getId());
}

//Determine the HMS availability
public static boolean isHmsAvailable(Context context) {
    boolean isAvailable = false;
    if (null != context) {
        int result = HuaweiApiAvailability.getInstance().isHuaweiMobileServicesAvailable(context);
        isAvailable = (com.huawei.hms.api.ConnectionResult.SUCCESS == result);
    }
    Log.i(TAG, "isHmsAvailable: " + isAvailable);
    return isAvailable;
}
```

