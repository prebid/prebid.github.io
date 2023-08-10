---
layout: userid
title: Lotame Panorama ID
description: Lotame Panorama ID User ID sub-module
useridmodule: lotamePanoramaIdSystem
---


[Lotame Panorama](https://www.lotame.com/panorama/) is a suite of data-enrichment solutions for digital advertising that empowers marketers, agencies, publishers and media companies to transform consumer personas into addressable audiences. At the heart of Lotame Panorama is the Panorama ID, a people-based identifier powered by deterministic and probabilistic data, available across the cookie-challenged web and all browsers.

Lotame’s Panorama ID module sends information from the request to its identity graph in order to successfully generate a Panorama ID. For more information on how the Panorama ID works, please visit [www.lotame.com/panorama/id/](https://www.lotame.com/panorama/id/).

Lotame's privacy policy related to the Panorama ID and the collection of data and how data is used is available at [www.lotame.com/about-lotame/privacy/lotames-products-services-privacy-policy/](https://www.lotame.com/about-lotame/privacy/lotames-products-services-privacy-policy/). Consult with your legal counsel to determine the appropriate user disclosures with respect to use of the Lotame Panorama ID module.

If you have any questions about Panorama ID, please reach out by emailing [prebid@lotame.com](mailto:prebid@lotame.com).

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=lotamePanoramaIdSystem

## Lotame Panorama ID Registration & Implementation

To get started, you will need to register with Lotame in order to receive your unique client ID for the userID module. You can [register here](https://www.cognitoforms.com/LotameSolutionsInc/PanoramaIDOfferingEnrollment) or contact [prebid@lotame.com](mailto:prebid@lotame.com) for any questions that you may have.

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
