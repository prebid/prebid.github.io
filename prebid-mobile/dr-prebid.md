---
layout: page_v2
title: Dr. Prebid App
description: How to Use the Dr. Prebid App
pid: 4
top_nav_section: prebid-mobile
nav_section: prebid-mobile-ios
sidebarType: 3
---

# Dr. Prebid

{:.no_toc}

Dr. Prebid is a validation and troubleshooting app for publishers implementing Prebid Mobile. With this app you can validate your settings for your ad server setup, your Prebid Server configuration, and your end-to-end Prebid Mobile SDK implementation.

* TOC
{:toc }

## Get the App

This app is available for iOS and Android:

- [Download for iOS](https://itunes.apple.com/us/app/dr-prebid/id1442614692?mt=8)  
  System Requirements: Requires iOS 12.0 or later. Compatible with iPhone, iPad, and iPod touch.

- [Download for Android](https://play.google.com/store/apps/details?id=org.prebid.validation.drprebid)  
  System Requirements: Requires Android 4.2 and up.

Dr. Prebid is an open source app. You can find the source on the Prebid GitHub site:

- [Source for iOS](https://github.com/prebid/prebid-mobile-ios/tree/master/tools/PrebidValidator)
- [Source for Android](https://github.com/prebid/prebid-mobile-android/tree/master/tools/drprebid)

**Review the [Prebid.org Dr. Prebid Terms of Use]({{site.github.url}}/prebid-mobile/dr-prebid-tou.html).**

## Enter Test Values

Enter your test values on the Dr. Prebid Setup screen.

**Dr. Prebid Setup Screen**

![Dr. Prebid Setup]({{site.baseurl}}/assets/images/prebid-mobile/dr-prebid-setup.png){: .pb-sm-img :}

The following are descriptions of the fields available in Dr. Prebid. Tap on a field to change its value. All fields are required.

### General Info

In this section, define the ad format and size of the ad server ad unit you’ll be testing.

**Ad Format**

The type of ad you want to test. This will be the ad type that is associated with the line item you’re testing against in your ad server setup.

Select from:
-    *Banner*
-    *Interstitial*
-    *Native*
-    *Video*

**Ad Size**

The size of the ad for the ad slot you’ll be filling. This field applies only to the Banner ad format.

### Ad Server Info

These settings will enable you to test whether the Prebid Mobile line item in your ad server is set up correctly.

**Ad Server**

The primary ad server you’re using to serve your ads.

Select:
-    *DFP*

**Bid Price**

The decimal value (in USD) of the bid price bucket your line item is targeting. For example, if you have a line item targeting hb_pb:0.50, enter 0.50 in the Bid Price field to test whether this line item can serve.

Note that Dr. Prebid will not round this value using price buckets, so be sure that you have a line item targeting this bid price.

**Ad Unit ID**

The unique, user-defined identifier for the relevant ad slot in the primary ad server. You can find this value in the ad unit ID field of your Prebid Mobile implementation.

You can manually type in your ad unit ID or you can copy/paste via the **Scan QR code** option. (See “QR Code Scanning” below for instructions.)

### Prebid Server Info

These settings will help verify that Prebid Mobile and Prebid Server are connected, and that your demand partners are returning bid responses.

**Server Host**

Select your Prebid Server host:

-    *AppNexus*
-    *Rubicon*
-    *Custom*

**Custom Server Host**
Provide the url of the custom hosted prebid server 

**Account ID**

Your Prebid Server account ID. This is the account ID you were assigned when you registered with your Prebid Server host.

You can manually type in your account ID or you can copy/paste via the **Scan QR code** option. (See “QR Code Scanning” below for instructions.)

**Config ID**

Your Prebid Server configuration ID for the ad unit. This is the ID of the server-side configuration you defined in Prebid Server for the ad unit you’re testing.

You can manually type in your account ID or you can copy/paste via the **Scan QR code** option. (See “QR Code Scanning” below for instructions.)

## QR Code Scanning

IDs for ad units and Prebid Server accounts and configurations are long strings that can be tedious to type manually and are prone to typing errors. To avoid manually entering an ID, you can perform what results in a copy-and-paste action by creating and scanning QR codes for the IDs.

To set up a QR code, follow these steps:

1.    Go to any QR code generator. (There are many free options for QR code generation. Examples include [www.qr-code-generator.com/](https://www.qr-code-generator.com) and [www.the-qrcode-generator.com](https://www.the-qrcode-generator.com/).)

2.    Copy the ID you want to use from your Ad Server or from Prebid Server, depending on which ID you’re working with.

3.    In the QR code generator, select the Text option, paste in the ID, and generate the code.

4.    In Dr. Prebid, tap **Scan QR code** for the appropriate ID. This will open your QR code scanner (your camera).

5.    Scan the code. The ID will now be in the ID field in Dr. Prebid.

{: .alert.alert-info :}
**IMPORTANT:** Make sure you copy the full ID into the QR code generator. Also check to make sure you don’t copy in any extra trailing spaces. These will cause your validation tests to fail.

## Validation Tests

After you’ve entered all the values on the **Setup** screen, tap **Run Tests** to begin your validation.

**Validation Test Summary Screen**

![Dr. Prebid Setup]({{site.baseurl}}/assets/images/prebid-mobile/dr-prebid-summary.png){: .pb-sm-img :}

Three validation tests are performed: Ad Server Setup, Real-Time Demand, and End-to-End SDK Configuration. Each test will be displayed with either a green check mark (passed) or a red X (failed).

| Passed        |     | Failed      |
|:-----------:| --- |:-----------:|
| ![Dr. Prebid Validation Test Passed]({{site.baseurl}}/assets/images/prebid-mobile/dr-prebid-pass.png) |     | ![Dr. Prebid Validation Test Failed]({{site.baseurl}}/assets/images/prebid-mobile/dr-prebid-fail.png) |

<br />

The steps performed within each validation will also be displayed, each signifying whether that step passed or failed.

Tap the step within a validation test for details on the pass or failure results.

### Ad Server Setup Validation

This test determines whether your Prebid Mobile line items are configured correctly in your primary ad server.

The test generates Prebid-specific key-value pairs representing the bid price you specified in the **Bid Price** field of your setup. Based on the **Ad Format** you selected, these key-values are set on the banner ad views or interstitials, and a test ad is loaded to determine whether any matching Prebid line items will be selected.

-    **Ad Server Request sent and Key-Value targeting sent**  
  Verifies that the ad server request was sent. (Note: If Google Ad Manager was selected as the Ad Server on the Setup page and the IDs you entered on the Setup page are incorrect, the request will not be sent.) Tap this entry to see a list of key-value pairs that were sent with this request.
     - Select **Prebid Key-Value Pairs** to view only the key-values sent that apply to prebid.
     - Select **Ad Server Request** to view the full list of key-values sent in the ad request.
-    **Prebid Mobile creative HTML served**  
  Tap this entry to view:
    - The HTML code for the Prebid Mobile creative.
    - A rendering of the creative returned from the ad server (Received Creative) and a rendering of the Prebid.org test creative (Expected Creative). Tap the buttons to view each creative. In a successful test these two creatives will be the same.

**Results**

*Success*: If the test is successful, all steps will display green check marks. Tap into the **Prebid Mobile creative HTML served** screen to compare the ad server creative to the Prebid.org test creative. The **Received Creative** and the **Expected Creative** should be identical.

*Failure*: If the test fails, either no **Received Creative** will appear, or the **Received Creative** will not match the **Expected Creative**. In either case, check the following:
-    The key-value targeting sent to the ad server. Ensure that you have a Prebid Mobile line item targeting the `hb_pb` value with an active creative of the appropriate size and format.
-    Line item contention. Ensure that no other line items are expected to contend with the Prebid Mobile line item during testing.

### Real-Time Demand Validation

This test validates that the real-time requests generated using your Prebid Server Account ID and Prebid Server Configuration ID are reliably returning demand. If the account ID and configuration ID that you entered are successfully resolved on Prebid Server, Dr. Prebid will initiate a test in which 100 bid requests are sent to the demand partners included in your configuration. In a successful test these auctions will produce valid bid responses.

A summary of results will be displayed:

-    **Bid requests sent**  
  The number of bid requests that were sent. Dr. Prebid will always attempt to send 100 requests.
-    **Bid responses received**  
  The number of responses received from demand partners. Tap this entry to view a summary of bid responses from each demand partner. From the summary page you'll be able to navigate to detailed request and response information. NOTE: If your configuration includes more than one demand partner, this number may exceed the number of bid requests sent.
-    **Avg CPM**  
  The average CPM (in USD) of all received bid responses.
-    **Avg response time**  
  The average amount of time (in milliseconds) it took for demand partners to respond.

**Bid Response Summary**

Tap **_n_ bid responses received** to see a breakdown of bid responses by demand partner. For each demand partner you'll see the following details:
-    *# of Requests*  
  The total number of bid requests sent. The test is configured to send 100 requests.
-    *Valid Bid Rate*  
  The percentage of bid requests for which the demand partner returned a valid response.
-    *Avg Bid CPM*  
  The average CPM (in USD) of all valid bid responses from the demand partner.
-    *No-Bid Rate*  
  The percentage of bid requests for which the demand partner did not return a bid response.
-    *Timeout Rate*  
  The percentage of bid requests that timed out before a bid response could be sent.
-    *Error Rate*  
  The percentage of bid requests that resulted in errors from the demand partner.

On the Bid Response Summary screen, tap **Request & Response** for a demand partner to see the bid request sent to the demand partner and a response received (if any).

**Results**

There are three possible outcomes from this validation test:

*Success*: The auctions ran successfully and at least one valid bid response was returned from any one of the demand partners. A bid response will be returned in the results for each bidder.

*Failure*: The auctions ran successfully, but no successful bid responses were returned.

*Failure*: No auctions were run. If no auctions were run, verify the following in your setup:
  - Check to make sure the Prebid Server Account ID and Prebid Server Configuration ID you entered on the Dr. Prebid Setup page are correct. Ensure they don’t contain leading or trailing spaces.
  - Ensure that your Prebid Server Configuration is correct. See [Getting Started with Prebid Mobile]({{site.github.url}}/prebid-mobile/prebid-mobile-getting-started.html#configure-prebid-server) for more information.

### End-to-End SDK Validation

This test is a full end-to-end validation in which the Prebid Mobile SDK communicates with Prebid Server (using your account and configuration details) and with the primary ad server SDK.

The summary screen displays the following information:

-    **Ad unit registered**  
  This first step is successful if the Prebid Mobile API call was made to register the ad unit.
-    **Request to Prebid Server sent**  
  This step is successful if a bid request was sent from Prebid Mobile to Prebid Server.
-    **Prebid Server response received**  
  This test passes if a bid response was received from Prebid Server.
-    **Creative content cached**  
  This test passes if the creative content from the bid received from Prebid Server was cached.
-    **Ad server request sent and Key-value targeting sent**  
  Verifies whether the bid request was sent. (Note: If your ad server is Google Ad Manager, the request will not be sent if the IDs you entered on the Setup page are incorrect.) Tap this entry to see a list of key-value pairs that were sent with this request.
    - Select **Prebid Key-Value Pairs** to view the specific key-value pairs that were generated by Prebid Mobile and sent to the ad server.
    - Select **Ad Server Request** to view the full ad request sent to the ad server.
-    **Prebid Mobile creative HTML served**  
  Tap this entry to view:
    - Prebid Mobile creative HTML.
    - The rendering of the creative returned from the ad server.

**Results**

Possible outcomes from this test:

*Success*: This is a full, end-to-end validation of your Prebid Mobile implementation using your Prebid Server account ID and configuration ID. The validation succeeds if every step passes.

*Failure*: There are many steps throughout this validation. If a problem is encountered at any step, the validation will be marked as failed.
Some general things to check if this test fails include:
-    Check all your settings on the Setup screen. In particular, make sure all the IDs you entered are correct and valid.
-    Make sure your ad unit has been registered correctly. (See [Code Integration]({{site.github.url}}/prebid-mobile/prebid-mobile-pbs.html#configure-prebid-server) for more information.)
-    Verify that your Prebid Mobile line items are set up correctly on your ad server.
-    Look through your bid request and bid response (if any). Check the key-value targeting.
-    If a creative was returned, ensure that the HTML returned is the same as the Prebid Mobile creative code associated with your Prebid Mobile line item. (NOTE: The ad server should have replaced the macro placeholder for `hb_cache_id` with an alphanumeric GUID.)

Here are some more specific things to look for and actions to take based on which step(s) of the validation failed.
-    **Ad unit registered**  
  Be sure you’ve implemented your ad unit code correctly. See [Ad Unit Setup for iOS]({{site.github.url}}/prebid-mobile/pbm-api/ios/code-integration-ios.html) or [Ad Unit Setup for Android]({{site.github.url}}/prebid-mobile/pbm-api/android/code-integration-android.html) for information.
-    **Request to Prebid Server sent**  
  Make sure your account ID and configuration ID were entered correctly on the Setup screen. For more on integrating with Prebid Server see [Getting Started with Prebid Mobile]({{site.github.url}}/prebid-mobile/prebid-mobile-pbs.html).
-    **Prebid Server response received**  
  Review the requests and responses from the Real-Time Demand Validation.
-    **Creative content cached**  
  This step is built into Dr. Prebid and should always pass. If it doesn’t, contact your account team.
-    **Ad server request sent and Key-value targeting sent**  
  Tap on this step for more information. Review the Prebid-specific key-value targeting and verify that they match the values targeted by the Prebid Mobile line item in your ad server.
-    **Prebid Mobile creative HTML served**  
  Tap on this step to review the HTML and to see the creative that served (if any). Ensure that the HTML returned is the same as the Prebid Mobile creative code associated with your Prebid Mobile line item. NOTE: The ad server should have replaced the macro placeholder for `hb_cache_id` with an alphanumeric GUID.

## Further Reading

- [Prebid Mobile Overview](/prebid-mobile/prebid-mobile.html)
- [Getting Started with Prebid Mobile](/prebid-mobile/prebid-mobile-pbs.html)
- [AdOps – Before You Start](/adops/before-you-start.html)
