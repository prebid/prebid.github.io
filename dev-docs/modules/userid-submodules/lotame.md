---
layout: userid
title: Lotame Panorama ID
description: Lotame Panorama ID User ID sub-module
useridmodule: lotamePanoramaIdSystem
---


[Lotame Panorama](https://www.lotame.com/panorama/) is a suite of data-enrichment solutions for digital advertising that empowers marketers, agencies, publishers and media companies to transform consumer personas into addressable audiences. At the heart of Lotame Panorama is the Panorama ID, a people-based identifier powered by deterministic and probabilistic data, available across the cookie-challenged web and all browsers.

Lotame’s Panorama ID module sends information from the request to its identity graph in order to successfully generate a Panorama ID. For more information on how the Panorama ID works, please visit [https://www.lotame.com/panorama/id/](https://www.lotame.com/panorama/id/).

**Ease of Implementation**: Deployment of the Lotame Panorama ID module has been optimized for ease by not requiring any registration to utilize. Simply add the generic module to start producing the Panorama ID across your inventory.

Lotame's privacy policy related to the Panorama ID and the collection of data and how data is used is available at [https://www.lotame.com/about-lotame/privacy/lotames-products-services-privacy-policy/](https://www.lotame.com/about-lotame/privacy/lotames-products-services-privacy-policy/). Consult with your legal counsel to determine the appropriate user disclosures with respect to use of the Lotame Panorama ID module.

If you have any questions about Panorama ID, please reach out by emailing [PanoramaID@lotame.com](mailto:PanoramaID@lotame.com).

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=lotamePanoramaIdSystem

## Lotame Panorama ID Configuration

The Lotame Panorama ID module does not require any configuration parameters. It should work as-is provided that bidders use it in their adapters.

{: .alert.alert-info :}
NOTE: For optimal performance, the Lotame Panorama Id module should be called at every opportunity. It is best not to use `params.storage` with this module as the module has its own optimal caching mechanism.

## Lotame Panorama ID Example

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of the module | "lotamePanoramaId" |

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "lotamePanoramaId",
        }]
    }
});
{% endhighlight %}
