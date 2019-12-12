---
layout: page_v2
title: Module - DigiTrust
description: Addition of DigiTrust to the Prebid package
module_code : digitTrust
display_name : DigiTrust
enable_download : false
sidebarType : 1
---



# DigiTrust Module
{:.no_toc}

[DigiTrust](http://digitru.st) is a consortium of publishers, exchanges, and DSPs that provide a standard
user ID for display advertising similar in concept to ID-for-Ads in the mobile world. Subscribers to the ID service get an anonymous, persistent and secure identifier for publishers and trusted third parties on all browser platforms, including those which do not support third party cookies by default. See the [DigiTrust integration guide](https://github.com/digi-trust/dt-cdn/wiki/Integration-Guide) for more details.

DigiTrust is now integrated as an optional module in the Prebid ecosystem. DigiTrust ties in to the new UserId module. 
In order to use DigiTrust ID you must sign up as a member publisher at: http://www.digitru.st/signup/. When utilizing the
integrated DigiTrust ID support with Prebid, your site will be able to access your users' DigiTrust ID values through the official
DigiTrust ID first party cookie. Supporting bidder-adpters will also have access to the encrypted DigiTrust ID value.
Approved bidder systems will need to [decrypt the ID as per official DigiTrust documentation](https://github.com/digi-trust/dt-cdn/wiki/ID-encryption).

## Building Prebid with DigiTrust Support
Your Prebid build must include the modules for both **userId** and **digitrustIdLoader**. Follow the build instructions for Prebid as
explained in the top level README.md file of the Prebid source tree.

ex: $ gulp build --modules=userId,digitrustIdLoader

### Step by step Prebid build instructions for DigiTrust 

1. Download the Prebid source from [Prebid Git Repo](https://github.com/prebid/Prebid.js)
2. Set up your environment as outlined in the [Readme File](https://github.com/prebid/Prebid.js/blob/master/README.md#Build)
3. Execute the build command either with all modules or with the `userId` and `digitrustIdLoader` modules.
   ```
   $ gulp build --modules=userId,digitrustIdLoader
   ```
4. (Optional) Concatenate the DigiTrust source code to the end of your `prebid.js` file for a single source distribution.
5. Upload the resulting source file to your CDN.


## Deploying Prebid with DigiTrust ID support
**Precondition:** You must be a DigiTrust member and have registered through the [DigiTrust Signup Process](http://www.digitru.st/signup/).
Your assigned publisher ID will be required in the configuration settings for all deployment scenarios.

There are three supported approaches to deploying the Prebid-integrated DigiTrust package:

* "Bare bones" deployment using only the integrated DigiTrust module code.
* Full DigiTrust with CDN referenced DigiTrust.js library.
* Full DigiTrust packaged with Prebid or site js.

### Bare Bones Deployment

This deployment results in the smallest Javascript package and is the simplest deployment. 
It is appropriate for testing or deployments where simplicity is key. This approach
utilizes the REST API for ID generation. While there is less Javascript in use,
the user may experience more network requests than the scenarios that include the full
DigiTrust library.

1. Build your Prebid package as above, skipping step 4.
2. Add the DigiTrust init section to your Prebid initialization object as below, 
   using your Member ID and Site ID.
3. Add a reference to your Prebid package and the initialization code on all pages you wish
   to utilize Prebid with integrated DigiTrust ID.




### Full DigiTrust with CDN referenced DigiTrust library

Both "Full DigiTrust" deployments will result in a larger initial Javascript payload,
but the end user may experience fewer overall network requests as the encrypted and anonymous
DigiTrust ID can often be generated fully in client-side code. Utilizing the CDN reference
to the official DigiTrust distribution insures you will be running the latest version of the library.

The Full DigiTrust deployment is designed to work with both new DigiTrust with Prebid deployments, and with
Prebid deployments by existing DigiTrust members. This allows you to migrate your code in steps
without losing DigiTrust support in the process.

1. Deploy your built copy of `prebid.js` to your CDN.
2. On each page reference both your `prebid.js` and a copy of the **DigiTrust** library. 
   This may either be a copy downloaded from the [DigiTrust CDN](https://cdn.digitru.st/prod/1/digitrust.min.js) to your CDN, 
   or directly referenced from the URL https://cdn.digitru.st/prod/1/digitrust.min.js. These may be added to the page in any order.
3. Add a configuration section for Prebid that includes the `userSync` settings and the `digitrust` settings.

### Full DigiTrust packaged with Prebid

1. Deploy your built copy of `prebid.js` to your CDN. Be sure to perform *Step 4* of the build to concatenate or 
   integrate the full DigiTrust library code with your Prebid package.
2. On each page reference your `prebid.js`
3. Add a configuration section for Prebid that includes the `userSync` settings and the `digitrust` settings. 
   This code may also be appended to your Prebid package or placed in other initialization methods.


## Example Configuration Object ##

In the below example, replace the value **example_member_id** with your assigned DigiTrust Publisher Id and **example_site_id**
with the Id for your website. The `callback` function allows error handling from the DigiTrust initialization method. 
The Prebid UserId system handles passing the DigiTrust ID to (supporting) bidders adapters.

```javascript
pbjs.que.push(function() {
	pbjs.setConfig({
		consentManagement: {
			cmpApi: 'iab',
			timeout: 5000,
			allowAuctionWithoutConsent: true
		},
		userSync: {
			userIds: [
			{
				name: "digitrust",
				params: {
					init: {
						member: 'example_member_id',
						site: 'example_site_id'
					},
					callback: function (digiTrustResult) {
						if (digiTrustResult.success) {
							var el = document.getElementById('dtidOutput');
							console.log('Success',  digiTrustResult.identity);
						}
						else {
							console.error('Digitrust init failed');
						}
					}
				},
				storage: {
					type: "html5",
					name: "pbjsdigitrust",
					expires: 60
				}
			}
			]
		}
	});
	/* ... */
});
```

## Parameter Descriptions for the `userSync` Configuration Section
The below parameters apply only to the DigiTrust ID integration.

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | ID value for the DigiTrust module - `"digitrust"` | `"digitrust"` |
| params | Required | Object | Details for DigiTrust initialization. | |
| params.init | Required | Object | Initialization parameters, including the DigiTrust Publisher ID and Site ID. |  |
| params.init.member | Required | String | DigiTrust Publisher Id | "A897dTzB" |
| params.init.site | Required | String | DigiTrust Site Id | "MM2123" |
| params.callback | Optional | Function | Callback method to fire after initialization of the DigiTrust framework. The argument indicates failure and success and the identity object upon success. |  |
| storage | Required | Object | The publisher must specify the local storage in which to store the results of the call to get the user ID. This can be either cookie or HTML5 storage. | |
| storage.type | Required | String | This is where the results of the user ID will be stored. The recommended method is `localStorage` by specifying `html5`. | `"html5"` |
| storage.name | Required | String | The name of the cookie or html5 local storage where the user ID will be stored. | `"pbjsdigitrust"` |
| storage.expires | Optional | Integer | How long (in days) the user ID information will be stored. Default is 30 for UnifiedId and 1825 for PubCommonID | `365` |
| value | Optional | Object | Used only if the page has a separate mechanism for storing the Unified ID. The value is an object containing the values to be sent to the adapters. In this scenario, no URL is called and nothing is added to local storage | `{"tdid": "D6885E90-2A7A-4E0F-87CB-7734ED1B99A3"}` |



## Further Reading

+ [DigiTrust Home Page](http://digitru.st)
+ [DigiTrust integration guide](https://github.com/digi-trust/dt-cdn/wiki/Integration-Guide)
+ [DigiTrust ID Encryption](https://github.com/digi-trust/dt-cdn/wiki/ID-encryption)

