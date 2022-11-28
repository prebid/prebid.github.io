---
layout: page_v2
page_type: module
title: ID Import Library
description: Retrieve user ids deployed on your site, and return them to a configurable endpoint for ID Graphing.
module_code : currency
display_name : ID Import Library
enable_download : true
sidebarType : 1
Maintainer: eng-dmp@magnite.com

---


# ID Import Library
{:.no_toc}

The ID Import Library module gathers and generates a map of identities present on the page.  The primary usecase for this adapter is for Publishers who have included multiple UserId subadapters in their prebid.js implementation, and want to store the resulting user ids serverside for modeling or graphing purposes.  The ID Library module, anchors the response of `refreshUserIds()` to a persistant identifier (md5 encrypted) and returns an map of uids.  This map of uids comes in the form of a POST message in JSON format and must be output to a publisher configured endpoint. 

The module attempts to extract a persistant identifier in the following ways:

1. From a publisher defined target element
2. Searches for HTML input (text/email) element
3. Searches entire document for email using regex

To get started, add the module to your Prebid.js wrapper. From the command line:

{: .alert.alert-info :}
gulp build --modules=idImportLibrary


## Application Flow

In the idLibrary module, the persistant id is fetched from the page and synced with the user ids as follows:

1. Check for a valid 'idLibrary' configuration
1. If the configuration defines `target`, get the HTML element with the named id
   1. If a valid ID entry (e.g. email) exists in the target element, we're good, go on to step 5.
   1. Otherwise if no valid value is found, add a listener on the element
       1. Once the listener finds a valid value, go on to step 5.
1. Else, scan the values of all text and email input elements on the page. If one of them has a valid persistent ID value, we found it. Go on to step 5.
1. Else, scan the whole body tag for a valid persistent ID value. If one is found go on to step 5. This step is off by default, as it can lead to false postives. For example if a publisher has embedded customerservice@acme.com this value would be captured by the full body scan and anchored to the user id values present on the page. Turning on this feature should be done with care. 
1. If a valid persistent ID value has been found, then MD5 hash it, combine it with user IDs from the user ID module and POST to the specified endpoint.
  

## Configuration:

{: .table .table-bordered .table-striped }
| Param  | Required | Description |
| --- | --- | --- |
| url | yes | The url endpoint is used to post the MD5 hasheds|
| target | yes | Contains the element id from which the presistant value is to be read.|
| debounce | no | Time in milliseconds the module will wait before searching for the presistant value and user ids|
| fullscan | no | Allows the publisher to turn off the full page scan |

Please note, A full scan (Step 4 above) of the body element is configured on by default but can be disabled by setting `"fullscan: false"`

## Example

```javascript
 pbjs.setConfig({
    idImportLibrary:{
        url: 'url',
        target: 'username',
	debounce: 250
    }
});
```

### Post data format

After the data is collected, it will be POSTed to the configured URL in this format:

```json
{
  "hid": "MD5 hash",
  "uids": "user ids array"
}
```

```json
{
	"hid":"5dd72a98c8146bafa84313fc15eb27c2",
	"uids":
	{
		"id5id":"ID5-ZHMOQ7afBOa_gZxzTSelo5KFcVwCQgM7d-BUkWtjAA",
		"sharedid":
			{
				"id":"01EE77EKRHXEZVJYMSQVRJ9536",
				"third":"01EE77EKRHXEZVJYMSQVRJ9536"
			}
	}
}
```
