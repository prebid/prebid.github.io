---
layout: page_v2
page_type: module
title: ID Library
description: ID Graphing Adapter
module_code : currency
display_name : ID Library
enable_download : true
sidebarType : 1
Maintainer: eng-dmp@magnite.com

---


# ID Library
{:.no_toc}

The ID Library module gathers and generates a map of identities present on the page.  The primary usecase for this adapter is for Publishers who have included multiple UserId subadapters in their prebid.js implementation, and want to store the resulting user ids serverside for modeling or graphing purposes.  The ID Library module, anchors the response of `refreshUserIds()` to a presistant identifier (md5 encrypted) and returns an map of uids.  This map of uids comes in the form of a POST message in JSON format and must be outputed to a publisher configured endpoint. 

A presistant identifier can be extraced in the following ways:

1. From a generic `<div>` element
2. a publisher configured element, for example when configuration `target='username'`, the value is extracted from an element having id `'username'`
3. from the `<input>` element of type text/email

To get started add the module to your prebid.js wrapper 


{: .alert.alert-info :}
gulp build --modules=idLibrary


## Application Flow

In the idLibrary module, the presistant id is fetched from the page and synced with the user ids as follows:

1. Checks for a valid configurations
   1. conf.url is a mandatory field
   1. conf.target and conf.debounce is optional field
1. If the configuration has conf.options.target, get the element with the target
   1. If valid entry (ex. email) exists in the target element, MD5 hash the value and get the user ids from user id module and post data to the configured url
1. If no valid value found, add an observer/listener on the element.
   1. Once the observer/listener finds a valid value, the value is MD5 hashed
   1. used ids are posted along side the resulting MD5 hash to the url provided
   1. listener is removed from the input element.
1. Check if the input element of type text/input has a valid email
   1. If the input listener gets a valid email, it is MD5 hashed 
      1. used ids are posted along side the resulting MD5 hash to the url provided
      1. listener is removed from the input element.
   1. The mutation observer is called on every page reload and changes on the input element. Once the mutation observer finds a valid value in the body of the page, the hashed MD5 value and user ids are posted to configured url and mutation observer is disconnected from the body.
      1. If email is not found, add a listener on the input element and mutation observer on the body of the page
  
![Image of IDLibrary](/assets/images/dev-docs/IDlib.png)

## Configuration:

| Param  | Required | Description |
| --- | --- | --- |
| url | yes | The url endpoint is used to post the MD5 hasheds|
| target | no | Contains the element id from which the presistant value is to be read.|
| debounce | no | Time in milliseconds the module will wait before searching for the presistant value and user ids|

## Example

```javascript
pbjs.enableAnalytics([
          {
            provider: 'detGraph',
            options: {
              url: 'url',
              target: 'username',
			  debounce: 250 
            }
          }
        ]);
```

### Post data format

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
