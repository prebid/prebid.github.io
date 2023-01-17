---
layout: userid
title: Parrable ID
description: Parrable ID User ID sub-module
useridmodule: parrableIdSystem
---


The Parrable ID is a Full Device Identifier that can be used to identify a device across different browsers and webviews on a single device including browsers that have third party cookie restrictions.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=parrableIdSystem

## Parrable ID Registration

Please contact Parrable to obtain a Parrable Partner Client ID and/or use the Parrable Partner Client ID provided by the vendor for each Parrable-aware bid adapter you will be using.  Note that if you are working with multiple Parrable-aware bid adapters you may use multiple Parrable Partner Client IDs.

The Parrable privacy policy as at [https://www.parrable.com/privacy-policy/](https://www.parrable.com/privacy-policy/).

## Parrable ID Configuration

In addition to the parameters documented above in the Basic Configuration section the following Parrable specific configuration is required:

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| params | Required | Object | Details for the Parrable ID. | |
| params.partners | Required | Array[String] | A list of one or more Parrable Partner Client IDs for the Parrable-aware bid adapters you are using.  Please obtain Parrable Partner Client IDs from them and/or obtain your own. | `[ '30182847-e426-4ff9-b2b5-9ca1324ea09b' ]` |
| params.timezoneFilter | Optional | Object | Configures a timezone or timezone offset filter | |
| params.timezoneFilter.allowedZones | Optional | Array[String] | description | `[ 'America/Anchorage' ]` |
| params.timezoneFilter.allowedOffsets | Optional | Array[Number] | description | `[ -4 ]` |
| params.timezoneFilter.blockedZones | Optional | Array[String] | description | `[ 'America/New_York' ]` |
| params.timezoneFilter.blockedOffsets | Optional | Array[Number] | description | `[ -5 ]` |


{: .alert.alert-info :}
NOTE: The Parrable ID that is delivered to Prebid is encrypted by Parrable with a time-based key and updated frequently in the browser to enforce consumer privacy requirements and thus will be different on every page view, even for the same user.

The Parrable ID system manages a cookie with the name of `_parrable_id` containing the ID and optout states of the user.
This cookie is used also by standalone Parrable integrations outside of Prebid.
It is for this reason that the cookie name is not configurable for the Parrable ID system.

## Timezone and Timezone Offset Filtering

The Parrable ID system enables a publisher to configure lists of **allowed** timezones (eg. `Europe/Dublin`) and/or timezone offsets (eg. `-4`) as well as a lists of **blocked** timezones and timezone offsets.

- With no configuration (`params.timezoneFilter` not set, or all of the lists are empty) all impressions are permitted.
- With only allow lists configured a browser must match either a timezone or timezone offset for it to not be filtered.
- With only block lists configured an impression will be filtered only if it is from a browser matching a blocked timezone or timezone offset.
- An impression from a browser that matches any allowed timezone or timezone offset, but does not match a blocked timezone or timezone offset will engage in the Parrable ID syncronization process.
- If a browser has a stored Parrable ID then it will not be filtered even if the browser is in a timezone or timezone offset that is blocked.

All configured timezones should follow the `TZ database name` column from the [IANA tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

## Parrable ID Examples

{% highlight javascript %}
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: `'parrableId'`,
            params: {
              partners: [
                '30182847-e426-4ff9-b2b5-9ca1324ea09b',
                'b07cf20d-8b55-4cd7-9e84-d804ed66b644'
              ], // change to the Parrable Partner Client ID(s) you received from the Parrable Partners you are using
              timezoneFilter: {
                  allowedZones: ['America/New_York', 'Europe/Madrid']
              }
            }
        }],
        syncDelay: 1000
    }
});
{% endhighlight %}
