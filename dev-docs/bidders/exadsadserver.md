---
layout: bidder
title: EXADS
description: EXADS Bidder Adapter
pbjs: true
pbs: false ?
biddercode: exadsadserver
gvl_id: 1084 ? // found here https://iabeurope.eu/vendor-list-tcf/
tcfeu_supported: true?
usp_supported: false?
media_types: banner, video, native
gpp_sids: ?
schain_supported: ?
dchain_supported: ?
safeframes_ok: ?
deals_supported: ?
floors_supported: ?
ortb_blocking_supported: ?
---

### Note

Module that connects to EXADS’ bidder for bids.

### Configuration

Use `setConfig` to instruct Prebid.js to initilize the exadsBidAdapter, as specified below. 
* Set "debug" as true if you need to read logs;
* Set "gdprApplies" as true if you need to pass gdpr consent string;
* The tcString is the iabtcf consent string for gdpr;
* Uncomment the cache instruction if you need to configure a cache server (e.g. for instream video)

```
pbjs.setConfig({
    debug: false,
    //cache: { url: "https://prebid.adnxs.com/pbc/v1/cache" },
    consentManagement: {
        gdpr: {
            cmpApi: 'static',
            timeout: 1000000,
            defaultGdprScope: true,
            consentData: {
                getTCData: {
                    tcString: consentString,
                    gdprApplies: false // set to true to pass the gdpr consent string
                }
            }
        }
    }
});
```
Add the `video` config if you need to render videos using the video module.
For more info navigate to https://docs.prebid.org/prebid-video/video-module.html.
```
pbjs.setConfig({
    video: {
        providers: [{
            divId: 'player', // the id related to the videojs tag in your body
            vendorCode: 2, // videojs, 
            playerConfig: {
                params: {
                    adPluginConfig: {
                        numRedirects: 10
                    },
                    vendorConfig: {
                        controls: true,
                        autoplay: true,
                        preload: "auto",
                    }
                }
            }
        },]
    },
});
```

#### RTB Banner 2.4

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `zoneID`      | required | You can get it from the endpoint created after configuring the zones          | `12345`    | `'integer'` |
| `fid`      | required | You can get it from the endpoint created after configuring the zones          | `'829a896f011475d50da0d82cfdd1af8d9cdb07ff'`    | `'string'` |
| `partner`      | required | Currently we support rtb 2.4 (“ortb_2_4”) only           | `'ortb_2_4'`    | `'string'` |
| `siteId`      | recommended |  Unique Site ID           | `'123'`    | `'string'` |
| `siteName`      |  |  Site name            | `'test.com'`    | `'string'` |
| `banner.sizes`      | required |  [width, height]          | `[145,256]`    | `'integer array'` |
| `userIp`      | required |  IP address of the user, ipv4 or ipv6          | `'0.0.0.0'`    | `'string'` |
| `userId`      | *required |  Unique user ID (string). *If you cannot generate a user ID, you can leave it empty (""). The request will get a response as long as “user” object is included in the request          | `''`    | `'string'` |
| `country`      |  |  country ISO3          | `'IRL'`    | `'string'` |
| `impressionId`      | required |  Unique impression ID within this bid request           | `'abcde'`    | `'string'` |
| `keywords`      |  |  Keywords can be used to ensure ad zones get the right type of advertising. Keywords should be a string of comma-separated words           | `'lifestyle, humour'`    | `'string'` |
| `bidfloor`      |  |  Minimum bid for this impression (CPM) / click (CPC) and account currency           | `0.00000011`    | `'float'` |
| `bidfloorcur`      |  |  Currency for minimum bid value specified using ISO-4217 alpha codes           | `'EUR'`    | `'string'` |
| `bcat`      |  |  Blocked advertiser categories using the IAB content categories           | `['IAB25', 'IAB7-39','IAB8-18','IAB8-5','IAB9-9']`    | `'string array'` |
| `badv`      |  |  Block list of advertisers by their domains            | `['first.com', 'second.com']`    | `'string array'` |
| `mimes`      |  |   List of supported mime types. We support: image/jpeg, image/jpg, image/png, image/png, image/gif, image/webp, video/mp4            | `['image/jpg']`    | `'string array'` |
| `dsa`      |  |   DSA transparency information. To see the specific paragraph for more details.            | `{ dsarequired: 3, pubrender: 0, datatopub: 2 }`    | `object` |
| `endpoint`      | required |   EXADS endpoint (URL)            | `https://your-ad-network.com/rtb.php`    | `string` |

##### DSA

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `dsarequired`      |  |  flag to indicate if DSA information should be made available          | `3`    | `'integer'` |
| `pubrender`      |  | flag to indicate if the publisher will render the DSA Transparency info          | `0`    | `'integer'` |
| `datatopub`      |  | ndependent of pubrender, the publisher may need the transparency data for audit purposes           | `2`    | `'integer'` |

##### RTB Banner 2.4 (Image)

```javascript

adUnits = 
    [{  code: 'postbid_iframe', // the frame where to render the creative
        mediaTypes: {
            banner: {
                sizes: [300, 250]
            }
        },
        bids: [{
            bidder: 'exadsadserver',
            params: {
                    zoneId: 12345,
                    fid: '829a896f011475d50da0d82cfdd1af8d9cdb07ff',
                    partner: 'ortb_2_4',
                    siteId: '123',
                    siteName: 'test.com',
                    userIp: '0.0.0.0',
                    userId: '1234',
                    country: 'IRL',
                    impressionId: impression_id.toString(),
                    keywords: 'lifestyle, humour',
                    bidfloor: 0.00000011,
                    bidfloorcur: 'EUR',
                    bcat: ['IAB25', 'IAB7-39','IAB8-18','IAB8-5','IAB9-9'],
                    badv: ['first.com', 'second.com'],
                    mimes: ['image/jpg'],
                    dsa: {
                        dsarequired: 3, 
                        pubrender: 0,
                        datatopub: 2
                    },
                    endpoint: 'https://your-ad-network.com/rtb.php'
                }
            }]
        }];
```

##### RTB Banner 2.4 (Video)

```javascript
adUnits = 
    [{  code: 'postbid_iframe', // the frame where to render the creative
        mediaTypes: {
            banner: {
                sizes: [900, 250]
            }
        },
        bids: [{
            bidder: 'exadsadserver',
            params: {
                    zoneId: 12345,
                    fid: '829a896f011475d50da0d82cfdd1af8d9cdb07ff',
                    partner: 'ortb_2_4',
                    siteId: '123',
                    siteName: 'test.com',
                    userIp: '0.0.0.0',
                    userId: '1234',
                    country: 'IRL',
                    impressionId: '1234',
                    keywords: 'lifestyle, humour',
                    bidfloor: 0.00000011,
                    bidfloorcur: 'EUR',
                    bcat: ['IAB25', 'IAB7-39','IAB8-18','IAB8-5','IAB9-9'],
                    badv: ['first.com', 'second.com'],                      
                    mimes: ['image/jpg'],
                    dsa: {
                        dsarequired: 3, 
                        pubrender: 0,
                        datatopub: 2
                    },
                    endpoint: 'https://your-ad-network.com/rtb.php'
                }
            }]
        }];
```

#### RTB 2.4 Video (Instream/OutStream/Video Slider) - VAST XML or VAST TAG (url)

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `zoneID`      | required | You can get it from the endpoint created after configuring the zones          | `12345`    | `'integer'` |
| `fid`      | required | You can get it from the endpoint created after configuring the zones          | `'829a896f011475d50da0d82cfdd1af8d9cdb07ff'`    | `'string'` |
| `partner`      | required | Currently we support rtb 2.4 (“ortb_2_4”) only           | `'ortb_2_4'`    | `'string'` |
| `siteId`      | recommended |  Unique Site ID           | `'123'`    | `'string'` |
| `siteName`      |  |  Site name            | `'test.com'`    | `'string'` |
| `userIp`      | required |  IP address of the user, ipv4 or ipv6          | `'0.0.0.0'`    | `'string'` |
| `userId`      | *required |  Unique user ID (string). *If you cannot generate a user ID, you can leave it empty (""). The request will get a response as long as “user” object is included in the request          | `''`    | `'string'` |
| `country`      |  |  country ISO3          | `'IRL'`    | `'string'` |
| `impressionId`      | required |  Unique impression ID within this bid request           | `'abcde'`    | `'string'` |
| `keywords`      |  |  Keywords can be used to ensure ad zones get the right type of advertising. Keywords should be a string of comma-separated words           | `'lifestyle, humour'`    | `'string'` |
| `bidfloor`      |  |  Minimum bid for this impression (CPM) / click (CPC) and account currency           | `0.00000011`    | `'float'` |
| `bidfloorcur`      |  |  Currency for minimum bid value specified using ISO-4217 alpha codes           | `'EUR'`    | `'string'` |
| `bcat`      |  |  Blocked advertiser categories using the IAB content categories           | `['IAB25', 'IAB7-39','IAB8-18','IAB8-5','IAB9-9']`    | `'string array'` |
| `badv`      |  |  Block list of advertisers by their domains            | `['first.com', 'second.com']`    | `'string array'` |
| `mediaTypes`      | required |   To see the specific paragraph for details            | `{ video: { mimes: ['video/mp4'], context: 'instream', protocols: [3, 6] }}`    | `'object'` |
| `dsa`      |  |   DSA transparency information. To see paragraph for more info           | `{ dsarequired: 3, pubrender: 0, datatopub: 2 }`    | `object` |
| `endpoint`      | required |   EXADS endpoint (URL)            | `https://your-ad-network.com/rtb.php`    | `string` |

##### MediaTypes.video

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `mimes`      | required | list of supported mime types          | `['video/mp4']`    | `'string array'` |
| `protocols`      | required | list of supported video bid response protocols          | `[3, 6]`    | `'integer array'` |
| `context`      | recommended | the video context, either ‘instream’, ‘outstream’. Defaults to ‘instream’          | `'instream'`    | `'string'` |

##### DSA

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `dsarequired`      |  |  flag to indicate if DSA information should be made available          | `3`    | `'integer'` |
| `pubrender`      |  | flag to indicate if the publisher will render the DSA Transparency info          | `0`    | `'integer'` |
| `datatopub`      |  | ndependent of pubrender, the publisher may need the transparency data for audit purposes           | `2`    | `'integer'` |

```javascript
adUnits = [{
    code: 'postbid_iframe',
    mediaTypes: {
        video: {
            mimes: ['video/mp4'],
            context: 'instream',
            protocols: [3, 6]
        }
    },
    bids: [{
        bidder: 'exadsadserver',
        params: {
            zoneId: 12345,
            fid: '829a896f011475d50da0d82cfdd1af8d9cdb07ff',
            partner: 'ortb_2_4',
            siteId: '123',
            siteName: 'test.com',
            userIp: '0.0.0.0',
            userId: '1234',
            impressionId: '1234',
            imp: {
                ext: {
                    video_cta: 0
                }
            },
            dsa: {
                dsarequired: 3, 
                pubrender: 0,
                datatopub: 2
            },
            country: 'IRL',
            keywords: 'lifestyle, humour',
            bidfloor: 0.00000011,
            bidfloorcur: 'EUR',
            bcat: ['IAB25', 'IAB7-39','IAB8-18','IAB8-5','IAB9-9'],
            badv: ['first.com', 'second.com'],            
            endpoint: 'https://your-ad-network.com/rtb.php'
        }
    }]
}];
```

#### RTB 2.4 Native

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `zoneID`      | required | You can get it from the endpoint created after configuring the zones          | `12345`    | `'integer'` |
| `fid`      | required | You can get it from the endpoint created after configuring the zones          | `'829a896f011475d50da0d82cfdd1af8d9cdb07ff'`    | `'string'` |
| `partner`      | required | Currently we support rtb 2.4 (“ortb_2_4”) only           | `'ortb_2_4'`    | `'string'` |
| `siteId`      | recommended |  Unique Site ID           | `'123'`    | `'string'` |
| `siteName`      |  |  Site name            | `'test.com'`    | `'string'` |
| `userIp`      | required |  IP address of the user, ipv4 or ipv6          | `'0.0.0.0'`    | `'string'` |
| `userId`      | *required |  Unique user ID (string). *If you cannot generate a user ID, you can leave it empty (""). The request will get a response as long as “user” object is included in the request          | `''`    | `'string'` |
| `country`      |  |  country ISO3          | `'IRL'`    | `'string'` |
| `impressionId`      | required |  Unique impression ID within this bid request           | `'abcde'`    | `'string'` |
| `keywords`      |  |  Keywords can be used to ensure ad zones get the right type of advertising. Keywords should be a string of comma-separated words           | `'lifestyle, humour'`    | `'string'` |
| `bidfloor`      |  |  Minimum bid for this impression (CPM) / click (CPC) and account currency           | `0.00000011`    | `'float'` |
| `bidfloorcur`      |  |  Currency for minimum bid value specified using ISO-4217 alpha codes           | `'EUR'`    | `'string'` |
| `bcat`      |  |  Blocked advertiser categories using the IAB content categories           | `['IAB25', 'IAB7-39','IAB8-18','IAB8-5','IAB9-9']`    | `'string array'` |
| `badv`      |  |  Block list of advertisers by their domains            | `['first.com', 'second.com']`    | `'string array'` |
| `native.plcmtcnt`      |  |   the number of identical placements in this Layout             | `4`    | `'integer'` |
| `assets`      |  |   To see the specific paragraph for more info             | `{}`    | `'object'` |
| `dsa`      |  |   DSA transparency information. To see paragraph for more info           | `{ dsarequired: 3, pubrender: 0, datatopub: 2 }`    | `object` |
| `endpoint`      | required |   EXADS endpoint (URL)            | `https://your-ad-network.com/rtb.php`    | `string` |

##### Assets

* **assets (title)**
    * **id** - unique asset ID, assigned by exchange. Typically a counter for the array (integer): 
        * 1 - image asset ID
        * 2 - title asset ID
        * 3 - description asset ID
    * **required** - set to 1 if asset is required or 0 if asset is optional (integer)
    * **title**
        * len (required) - maximum length of the text in the title element (integer)
* **assets (data)**
    * **id** - unique asset ID, assigned by exchange. Typically a counter for the array (integer):
        * 1 - image asset ID
        * 2 - title asset ID
        * 3 - description asset ID
    * **data**
        * **type** - type ID of the element supported by the publisher (integer). We support: 
            * 1 - sponsored - sponsored By message where response should contain the brand name of the sponsor
            * 2 - desc - descriptive text associated with the product or service being advertised
        * **len** - maximum length of the text in the element’s response (integer)
* **assets (img)**
    * **id** - unique asset ID, assigned by exchange. Typically a counter for the array (integer): 
        * 1 - image asset ID
        * 2 - title asset ID
        * 3 - description asset ID
    * **required** - set to 1 if asset is required or 0 if asset is optional (integer)
    * **img**
        * **type** - type ID of the image element supported by the publisher. We support: 
            * 1 - icon image (integer)
            * 3 - large image preview for the ad (integer)
        * **w** - width of the image in pixels, optional (integer)
        * **h** - height of the image in pixels, optional (integer)

##### DSA

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `dsarequired`      |  |  flag to indicate if DSA information should be made available          | `3`    | `'integer'` |
| `pubrender`      |  | flag to indicate if the publisher will render the DSA Transparency info          | `0`    | `'integer'` |
| `datatopub`      |  | ndependent of pubrender, the publisher may need the transparency data for audit purposes           | `2`    | `'integer'` |

```javascript
adUnits = [{
    code: 'postbid_iframe',
    mediaTypes: {
        native: {
            ortb: {
                assets: [{
                    id: 2,
                    required: 1,
                    title: {
                        len: 124
                    }
                },
                {
                    id: 3,
                    data: {
                        type: 1,
                        len: 50
                    }
                },
                {
                    id: 1,
                    required: 1,
                    img: {
                        type: 3,
                        w: 300,
                        h: 300
                    }
                }]
            }
        }
    },
    bids: [{
        bidder: 'exadsadserver',
        params: {
                zoneId: 12345,
                fid: '829a896f011475d50da0d82cfdd1af8d9cdb07ff',
                partner: 'ortb_2_4',
                siteId: '123',
                siteName: 'test.com',
                userIp: '0.0.0.0',
                userId: '1234',
                impressionId: '1234',
                native: {
                    plcmtcnt: 4
                },
                dsa: {
                    dsarequired: 3, 
                    pubrender: 0,
                    datatopub: 2
                },
                country: 'IRL',
                keywords: 'lifestyle, humour',
                bidfloor: 0.00000011,
                bidfloorcur: 'EUR',
                bcat: ['IAB25', 'IAB7-39','IAB8-18','IAB8-5','IAB9-9'],
                badv: ['first.com', 'second.com'],                
                endpoint: 'https://your-ad-network.com/rtb.php'
            }
        }]
}];
```

# DSA Transparency
All DSA information, returned by the ad server, can be found into the **meta** tag of the response. As:
```
"meta": {
    "dsa": {
        "behalf": "...",
        "paid": "...",
        "transparency": [
            {
                "params": [
                    ...
                ]
            }
        ],
        "adrender": ...
    }
}
```
For more information navigate to https://docs.prebid.org/dev-docs/bidder-adaptor.html.

# Tools and suggestions
This section contains some suggestions that allow to set some parameters automatically.

### User Ip / Country
In order to detect the current user ip there are different approaches. An example is using public web services as ```https://api.ipify.org```.

Example of usage (to add to the publisher websites):

```
<script>
    let userIp = '';
    let ip_script = document.createElement("script");
    ip_script.type = "text/javascript";
    ip_script.src = "https://api.ipify.org?format=jsonp&callback=userIpCallback";
    
    function userIpCallback(user_ip) {
        userIp = user_ip.ip;
    }
</script>
```

The same service gives the possibility to detect the country as well. Check the official web page about possible limitations of the free licence. 

### Impression Id
Each advertising request has to be identified uniquely by an id.
One possible approach is using a classical hash function.

```
<script>
    let impression_id = hashCode(new Date().getTime().toString());
    
    // MurmurHash3 hash function
    function hashCode(str, seed = 0) {
        let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
        for (let i = 0, ch; i < str.length; i++) {
            ch = str.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
        return 4294967296 * (2097151 & h2) + (h1 >>> 0);
    }
</script>
```

### User Id
The approach used for impression id could be used for generating a unique user id.
Also, it is recommended to store the id locally, e.g. by the browser localStorage.

```
<script>
let userId = localStorage.getItem('prebidJS.user_id');

if(!userId) {
    localStorage.setItem('prebidJS.user_id', hashCode('user_id' + new Date().getTime().toString()));
    userId =  localStorage.getItem('prebidJS.user_id');
}
</script>
```

### Build
If you don't need to use the prebidJS video module, please remove the videojsVideoProvider module.
```
gulp build --modules=consentManagement,exadsBidAdapter,videojsVideoProvider 
```