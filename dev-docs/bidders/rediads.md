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
| **Supply Chain Support**   | yes                        |
| **Demand Chain Support**   | no                        |
| **Safeframes OK**          | no                       |
| **Supports Deals**         | no                        |
| **Floors Module Support**  | yes                       |
| **First Party Data Support** | yes                     |
| **User IDs**               | none                      |
| **ORTB Blocking Support**  | partial (`bcat` only)     |
| **Privacy Sandbox**        | no                        |
| **Prebid Server App Support** | no                     |

---

### Bid Params

| Name         | Scope    | Description                                                                 | Example              | Type           |
|--------------|----------|-----------------------------------------------------------------------------|----------------------|----------------|
| `account_id` | required | Account ID generated on the Rediads Platform.                              | `'12345'`            | `string`       |
| `site`       | optional | Site domain name.                                                          | `'rediads.com'`      | `string`       |
| `slot`       | optional | Unique identifier for the ad slot generated on the platform.               | `'54321'`            | `string`       |

---

### Enabling Test Bids 

To enable test bids for the Rediads Bidder Adapter, append `rediads-test-bid` to the hash of the page URL. 

For example: - 

**Localhost:** `http://localhost:8000/xyz#rediads-test-bid`

**Production URL:** `https://domain.com/page#rediads-test-bid` 
This will activate test bids for debugging and validation purposes. ---

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
            playerSize: [640, 480],           	    // required
            context: 'instream',			       // required
            mimes: ['video/mp4'],   			  // optional
            startdelay: 5,                        // optional
            playbackmethod: [1,3],                // optional
            api: [ 1, 2, 3, 4 ],                  // optional
            protocols: [ 2, 3 ],                  // optional
            linearity: 1,                         // optional            
            placement: 2,                         // required
            plcmt: 1,                             // required
            skip: 1,                              // optional
            minduration: 5,                       // optional
            maxduration: 30,                      // optional
           
        }
    },
    bids: [{
      bidder: 'rediads',
      params: {
        site: 'rediads.com',                     // required
        slot: '54321'              			    
      }
    }]
}]
```

### First Party Data Support

The following fields are supported for First Party Data (FPD):

-   `ortb2.site.*`
-   `ortb2.publisher.*`
-   `ortb2.content.*`
-   `ortb2.devices.locations parameters`


### Supported Features

- **Media Types:** `banner`, `video`, `native`
- **Floors Supported:** Yes
- **Deals Supported:** No
- **First Party Data (FPD):** Supports `site`, `publisher`, and `content` objects.
- **OpenRTB Blocking Parameters:** Partial (supports `bcat`).

For additional implementation or support, contact us at <support@rediads.com>.
