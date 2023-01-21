---
layout: bidder
title: HuaweiAds
description: Prebid HuaweiAds Bidder Adapter
biddercode: huaweiads
gvl_id: 856
media_types: banner, video, native
gdpr_supported: true
coppa_supported: true
safeframes_ok: false
deals_supported: true
pbjs: false
pbs: true
pbs_app_supported: true
prebid_member: false
sidebarType: 1
---

### Note:

The Example Bidding adapter requires setup before beginning. Please contact us at hwads@huawei.com.
1. The following parameters need to be registered on the HuaweiAds platform, and at the same time, the permission to access the server interface needs to be opened on the HuaweiAds platform.
2. You can find ( publisherid, signkey, keyid ) on the platform after registration.
3. You need to create your advertising creative on the platform and get the corresponding ( slotid, adtype ).
4. We need OAID, GAID, IMEI (One must not be empty, you can collect OAID first, or use GAID) in our request, so when using prebidmobile, please add something like "TargetingParams.addUserData("oaid", "oaid-test") TargetingParams.addUserData("gaid", "gaid-test") TargetingParams.addUserData("imei", "imei-test")".
5. You can also send the clientTime to the HuaweiAds Adx server, like "TargetingParams.addUserData("clientTime", "2018-11-02 16:34:07.981+0800")". if not, it will use the prebid server time and zone.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description  | Example   | Type     |
|---------------|----------|--------------|-----------|----------|
| `publisherid` | required | Publisher Id | `'2001000399'` | `string` |
| `signkey` | required | Sign Key | `'5d********82c38594f8b2bdfd9f********a398dca734932898e3********8d'` | `string` |
| `keyid` | required | Key Id | `'2'` | `string` |
| `slotid` | required | Slot Id | `'u42ohmaufh'` | `string` |
| `adtype` | required | Ad Type | `'native'` | `string` |
