---
layout: bidder
title: Ozone Project
description: Prebid Ozone Project Bidder Adaptor
biddercode: ozone 
pbjs: true
media_types: banner, video
tcfeu_supported: true
userIds: criteo, id5Id, tdid, identityLink, liveIntentId, parrableId, pubCommonId, lotamePanoramaId, sharedId, fabrickId
gvl_id: 524
deals_supported: true
schain_supported: true
coppa_supported: true
usp_supported: true
floors_supported: true
prebid_member: true
sidebarType: 1

---

#### Bid Params

{: .table .table-bordered .table-striped }

| Name      | Scope    | Description               | Example    | Type     |
|-----------|----------|---------------------------|------------|----------|
| `siteId`    | required | The site ID from ozone.  | `"OZONENUK0001"` | `string` |
| `publisherId`    | required | The publisher ID.  | `"4204204201"` | `string` |
| `placementId`    | required | The placement ID.  | `"0420420421"` | `string` |
| `customData`     | optional | publisher key-values used for targeting | `[{"settings":{},"targeting":{"key1": "value1", "key2": "value2"}}],` | `array` |

### Disclosure

```legal
Ozone Bid Adapter sets cookies without purpose one consent. They support essential technical functions such as load balancing traffic and identifying bot activity. These cookies are not set by Ozone's application but by our cloud providers – Cloudflare for security and performance, and Amazon Web Services for load balancing.

Our immediate recommendation is to include information about these cookies in your CMP and privacy policy. This ensures transparency regarding the essential technical cookies that support site functionality and security. Given the nature and purpose of these cookies, they are typically categorised as strictly necessary and do not require user consent under regulations like GDPR or the ePrivacy Directive.Below is an example entry for your privacy policy:

Strictly Necessary Cookies:
Our website uses certain cookies that are essential for its operation and security. These cookies are automatically placed on your device when you access the site, ensuring that it functions properly and remains protected from malicious activity.

Cookie Name: __cf_bm
Provider: Cloudflare

Purpose: This cookie is set by Cloudflare, our security and performance partner. It distinguishes between humans and bots to protect the website from automated malicious traffic. The cookie supports performance optimization and security features such as bot management and threat mitigation.

Duration: Expires after 30 minutes of inactivity

Data Collected: Encrypted, non-personally identifiable information used solely for security and performance purposes. No tracking of users across different websites or sessions.

Consent: As this cookie is strictly necessary for the functioning and security of the website, it is exempt from consent requirements under applicable data protection laws, including the UK GDPR and ePrivacy Directive.

Cookie Names: AWSALBG & AWSALBGTCORS
Provider: Amazon Web Services (via our load balancing service)

Purpose: These cookies are used to maintain session stickiness for load balancing purposes. When a load balancer receives a client request, it routes the request to a specific target server using a chosen algorithm.

AWSALBG:

Encodes and encrypts information about the selected target server.

Is automatically included in the response to the client with a fixed expiry of 7 days, which is non-configurable.

AWSALBGTCORS:

For cross-origin resource sharing (CORS) requests, some browsers require cookies with SameSite=None; Secure attributes.

This cookie is generated alongside AWSALBG and carries the same target information with the required SameSite attribute.

Duration: Both cookies expire after 7 days.

Data Collected: The cookies store information related to load balancing. The data is encrypted and used solely to ensure consistent session routing.

Consent: As these are strictly necessary technical cookies, they are exempt from user consent requirements under applicable data protection laws.

Technical Breakdown:

__cf_bm:
Cloudflare’s __cf_bm cookie is used to identify and mitigate automated traffic. It is essential for Cloudflare’s bot management and threat mitigation functions. Each end-user device visiting a protected site gets a unique __cf_bm cookie that expires after 30 minutes of inactivity. The content (except for time-related data) is encrypted and used only for computing a proprietary bot score and a session identifier if Anomaly Detection is enabled.

AWSALBG & AWSALBGTCORS:
When Amazon Web Services' load balancer receives a request, it routes the request to a target server based on a predetermined algorithm. The AWSALBG cookie encodes and encrypts information about the selected target server and is set with a fixed expiry of 7 days. For browsers that require cookies with SameSite=None; Secure attributes to support CORS, the AWSALBGTCORS cookie is generated alongside AWSALBG, containing the same target information with the necessary security attributes.
```

To require purpose one consent for Ozone, one could include the following

```javascript
pbjs.setConfig({
    allowActivities: {
        fetchBids: {
            rules: [
                {
                    condition({componentType, adapterCode, gdprConsent}) {
                        return (
                            componentType === 'bidder' &&
                            adapterCode === 'ozone' &&
                            gdprConsent?.gdprApplies &&
                            !gdprConsent?.vendorData?.purpose?.consents?.[1]
                        )
                    },
                    allow: false
                }
            ]
        }
    }
})
```

### Test Parameters

A test ad unit that will consistently return test creatives:

```javascript
//Banner adUnit

const adUnits = [{
                    code: 'id-of-your-banner-div',
                    mediaTypes: {
                      banner: {
                        sizes: [[300, 250], [300,600]]
                      }
                    },
                    bids: [{
                        bidder: 'ozone',
                        params: {
                            publisherId: 'OZONETST0001', /* an ID to identify the publisher account  - required */
                            siteId: '4204204201', /* An ID used to identify a site within a publisher account - required */
                            placementId: '8000000125', /* an ID used to identify the piece of inventory - required - for appnexus test use 13144370. */
                            customData: [{"settings": {}, "targeting": {"key": "value", "key2": ["value1", "value2"]}}],/* optional array with 'targeting' placeholder for passing publisher specific key-values for targeting. */                            
                        }
                    }]
                }];
                
                
//Outstream adUnit

adUnits = [{
                    code: 'id-of-your-banner-div',
                    mediaTypes: {
                            video: {
                            playerSize: [640, 360],
                            mimes: ['video/mp4'],
                            context: 'outstream'
                      }
                    },
                    bids: [{
                        bidder: 'ozone',
                        params: {
                            publisherId: 'OZONETST0001', /* an ID to identify the publisher account  - required */
                            siteId: '4204204201', /* An ID used to identify a site within a publisher account - required */
                            placementId: '8000000328', /* an ID used to identify the piece of inventory - required. */
                            customData: [{"settings": {}, "targeting": {"key": "value", "key2": ["value1", "value2"]}}],/* optional array with 'targeting' placeholder for passing publisher specific key-values for targeting. */                            
                        }
                    }]
                }];
                
//Instream adUnit

adUnits = [{
                    code: 'id-of-your-banner-div',
                    mediaTypes: {
                            video: {
                            playerSize: [640, 480],
                            mimes: ['video/mp4'],
                            context: 'instream'
                      }
                    },
                    bids: [{
                        bidder: 'ozone',
                        params: {
                            publisherId: 'OZONETST0001', /* an ID to identify the publisher account  - required */
                            siteId: '4204204201', /* An ID used to identify a site within a publisher account - required */
                            placementId: '8000000327', /* an ID used to identify the piece of inventory - required. */
                            customData: [{"settings": {}, "targeting": {"key": "value", "key2": ["value1", "value2"]}}],/* optional array with 'targeting' placeholder for passing publisher specific key-values for targeting. */                            
                        }
                    }]
                }];
```
