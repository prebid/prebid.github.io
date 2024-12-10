# Rediads Bidder Adapter

## Features

| Attribute                  | Value                     |
|----------------------------|---------------------------|
| **Bidder Code**            | rediads                  |
| **Prebid.org Member**      | no                        |
| **Prebid.js Adapter**      | yes                       |
| **Prebid Server Adapter**  | no                        |
| **Media Types**            | banner, video, native     |
| **Multi Format Support**   | will-bid-on-one           |
| **TCF-EU Support**         | yes                       |
| **IAB GVL ID**             | none                      |
| **GPP Support**            | no                        |
| **USP/CCPA Support**       | yes                       |
| **COPPA Support**          | no                        |
| **Supply Chain Support**   | yes                       |
| **Demand Chain Support**   | no                        |
| **Safeframes OK**          | no                        |
| **Supports Deals**         | no                        |
| **Floors Module Support**  | yes                       |
| **First Party Data Support** | yes                     |
| **User IDs**               | none                      |
| **ORTB Blocking Support**  | partial (bcat only)       |
| **Privacy Sandbox**        | no                        |
| **Prebid Server App Support** | no                     |

---

### Bid Params

| Name         | Scope    | Description                                                                 | Example              | Type           |
|--------------|----------|-----------------------------------------------------------------------------|----------------------|----------------|
| account_id   | required | Account ID generated on the Rediads Platform.                              | '12345'              | string         |
| site         | optional | Site domain name.                                                          | 'rediads.com'        | string         |
| slot         | optional | Unique identifier for the ad slot generated on the platform.               | '54321'              | string         |

---

### Enabling Test Bids

To enable test bids for the Rediads Bidder Adapter, append `rediads-test-bid` to the hash of the page URL.

This will activate test bids for debugging and validation purposes.

---

### AdUnit Examples

#### AdUnit Format for Banner

```javascript
var adUnits = [
  {
    code: 'test-div',
    mediaTypes: {
      banner: {
        sizes: [[300, 250], [300, 600]]
      }
    },
    bids: [
      {
        bidder: 'rediads',
        params: {
          account_id: '12345',
          site: 'rediads.com',
          slot: '54321'
        }
      }
    ]
  }
];
```

#### AdUnit Format for Video

```javascript
var videoAdUnits = [
{
    code: 'test-div-video',
    mediaTypes: {
        video: {
            playerSize: [640, 480],
            context: 'instream',
            mimes: ['video/mp4'],
            startdelay: 5,
            playbackmethod: [1,3],
            api: [1, 2, 3, 4],
            protocols: [2, 3],
            linearity: 1,                    
            placement: 2,                    
            plcmt: 1,                        
            skip: 1,
            minduration: 5,
            maxduration: 30               
        }
    },
    bids: [{
      bidder: 'rediads',
      params: {
        site: 'rediads.com',
        slot: '54321'
      }
    }]
}
];
```

### First Party Data Support

The following fields are supported for First Party Data (FPD):

- ortb2.site.*
- ortb2.publisher.*
- ortb2.content.*
- ortb2.devices.locations parameters

### Supported Features

- **Media Types:** banner, video, native
- **Floors Supported:** Yes
- **Deals Supported:** No
- **First Party Data (FPD):** Supports site, publisher, and content objects.
- **OpenRTB Blocking Parameters:** Partial (supports bcat).

For additional implementation or support, contact us at <support@rediads.com>.
