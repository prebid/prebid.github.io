---
layout: userid
title: Lotame Panorama ID
description: Lotame Panorama ID User ID sub-module
useridmodule: lotamePanoramaIdSystem
bidRequestUserId: lotamePanoramaId
eidsource: crwdcntrl.net
example: '"e4b9..."'
---


[Lotame Panorama ID™](https://www.lotame.com/panorama-id/) is a pseudonymous ID that represents devices for the purposes of audience enrichment and campaign activation. It is powered by the Lotame Panorama Graph, which is built on hashed emails and browser and device data and combined with machine learning and predictive models to estimate the likelihood that a group of devices may be used by the same user or are in the same household.

Lotame’s Panorama ID module sends the IP address, user agent, and timestamp from the request to Lotame in order to successfully generate a Panorama ID. For more information on how the Panorama ID works, please visit [https://www.lotame.com/panorama-identity/](https://www.lotame.com/panorama-identity/).

Through registering above, your organization will execute Lotame’s Panorama ID Enrollment Terms for Prebid.org. Lotame’s [Services Privacy Notice](https://www.lotame.com/privacy/privacy-notices/services/) describes the processing of personal data by Lotame.

If you have any questions about Panorama ID, please reach out by emailing [prebid@lotame.com](mailto:prebid@lotame.com).

Add it to your Prebid.js package with:

```bash
gulp build --modules=lotamePanoramaIdSystem
```

## Lotame Panorama ID Registration & Implementation

To get started, you will need to [register](https://www.cognitoforms.com/LotameSolutionsInc/PanoramaIDOfferingEnrollment) with Lotame in order to receive your unique client ID for the userID module. Please contact [prebid@lotame.com](mailto:prebid@lotame.com) for any questions that you may have.

Once you sign up, you will receive an email with your client ID and instructions for implementation.

## Lotame Panorama ID Example

{: .table .table-bordered .table-striped }

| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of the module | "lotamePanoramaId" |
| params | Required | Object | Configuration options for the Lotame Panorama ID Module | |
 | params.clientId | Required | String | The Lotame Client ID provided as part of your registration as noted above | "1001" |

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "lotamePanoramaId",
            params: {
                clientId: "1001"
            }
        }]
    }
});
```

{: .alert.alert-info :}
NOTE: For optimal performance, the Lotame Panorama Id module should be called at every opportunity. It is best not to use params.storage with this module as the module has its own optimal caching mechanism.
