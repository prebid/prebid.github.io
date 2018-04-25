---
layout: page
title: Add Targeting Parameters
description: Add Targeting Parameters
pid: 1
top_nav_section: prebid-mobile
nav_section: prebid-mobile-ios
---


<div class="bs-docs-section" markdown="1">

# Targeting Parameters

## User location

By default, the iOS PBM SDK does not automatically send location information. In order for the PBM to use location information for targeting, the app developer must explicitly pass the location information to PBM.

Note: Developers should ensure adequate consent is obtained before sharing location information. Developers can control whether location is collected and sent by the PBM.

In this snippet, we implement the CLLocationManagerDelegate delegate. Create a location manager object as

```
@property (nonatomic, readwrite) CLLocationManager *locationManager;

```

Initialize the location manager as

```
- (void)setupPrebidLocationManager {
self.locationManager = [[CLLocationManager alloc] init];
self.locationManager.delegate = self;
self.locationManager.distanceFilter = kCLDistanceFilterNone;
self.locationManager.desiredAccuracy = kCLLocationAccuracyKilometer;
// Check for iOS 8. Without this guard the code will crash with "unknown selector" on iOS 7.
if ([self.locationManager respondsToSelector:@selector(requestWhenInUseAuthorization)]) {
[self.locationManager requestWhenInUseAuthorization];
}
[self.locationManager startUpdatingLocation];
}

```

Implement the location delegate as
```
// Location Manager Delegate Methods
- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations {
[[PBTargetingParams sharedInstance] setLocation:[locations lastObject]];
}
```

## Age and Gender
{:.no_toc}

Age and gender can be added to the targeting params directly as shown below.

```
[[PBTargetingParams sharedInstance] setAge:25];
[[PBTargetingParams sharedInstance] setGender:PBTargetingParamsGenderFemale];
```


## Pass Custom Keywords
{:.no_toc}

Custom keywords are used to attach arbitrary key-value pairs to the ad call. These are used for adding users to segments
On PBM, custom keywords are passed on as below:

We have 2 API's to set the custom Keywords.
```
[[PBTargetingParams sharedInstance] setUserKeywords:@"foo" withValue:@"bar"];
[[PBTargetingParams sharedInstance] setUserKeywords:@"foo" withValue:@"baz"];
[[PBTargetingParams sharedInstance] setUserKeywords:@"foo" withValue:@"bay"];
[[PBTargetingParams sharedInstance] setUserKeywords:@"foo" withValue:@"bee"];
```
If the values are set for the same keyword then the value for the key is replaced with the new value.

If the key needs to have an array of values then they can be set with a new API
```
[[PBTargetingParams sharedInstance] setUserKeywords:@"boo" withValues:@[@"bar",@"baz",@"bay",@"bee"]];

```
will result in the request json body constructed as

```user =     {
keywords = "foo=bee,boo=bar,boo=bay,boo=baz,boo=bee";
};
```

## GDPR Support

Prebid Mobile supports the IAB's GDPR recommendations, which can be found here.

Two API's are provided to get the consent from the publisher & also the consent string.

To enable publishers to provide the consent
```
[[PBTargetingParams sharedInstance] setSubjectToGDPR:YES];
```
To enable publishers to set the consent string

```
[[PBTargetingParams sharedInstance] setGdprConsentString:@"sample_consent_string"];
```

Prebid mobile also checks if the values are present in the NSUserDefaults keys specified by the IAB here

if the values are set in these objects too they will be passed in the openRTB request object


</div>
