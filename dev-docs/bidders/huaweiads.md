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

The Example Bidding adapter requires setup and approval before implementation. Please contact us at <developereu@huawei.com>, also you can [submit a ticket online](https://developer.huawei.com/consumer/en/support/feedback/#/).

1. The following parameters need to be registered on the HuaweiAds platform, and at the same time, the permission to access the server interface needs to be opened on the HuaweiAds platform.
2. You can find ( publisherid, signkey, keyid ) on the platform after registration.
3. You need to create your advertising creative on the platform and get the corresponding ( slotid, adtype ).
4. We need OAID or GAID in our request (OAID: Open Advertising ID, GAID: Google Advertising ID, An OAID or GAID is a non-permanent device identifier, based on which personalized ads can be served to users on the premise of protecting user data privacy. In most cases, OAID is used for HMS phones and GAID is used for GMS phones.), GAID is collected by default, for OAID specifically for HMS phones, please call the static AdvertisingIdClient.getAdvertisingIdInfo(mContext) method to [obtain the OAID](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides/identifier-service-obtaining-oaid-sdk-0000001050064988), then add the OAID to the request like "TargetingParams.addUserData(“oaid”, AdvertisingIdClient.Info info = AdvertisingIdClient.getAdvertisingIdInfo(getApplicationContext()).getId())".
5. You can also send the clientTime to the HuaweiAds Adx server, like "TargetingParams.addUserData("clientTime", "2018-11-02 16:34:07.981+0800")". if not, it will use the prebid server time and zone.

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

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description  | Example   | Type     |
|---------------|----------|--------------|-----------|----------|
| `publisherid` | required | Publisher Id | `'2001000399'` | `string` |
| `signkey` | required | Sign Key | `'5d********82c38594f8b2bdfd9f********a398dca734932898e3********8d'` | `string` |
| `keyid` | required | Key Id | `'2'` | `string` |
| `slotid` | required | Slot Id | `'u42ohmaufh'` | `string` |
| `adtype` | required | Ad Type | `'banner','native','interstitial','rewarded'` | `string` |
