---
layout: page_v2
title: Global Targeting Parameters - iOS
description: Prebid Mobile API global targeting parameters for iOS
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# Global Targeting Parameters
{:.no_toc}

Prebid Mobile supports the following global targeting parameters. These targeting parameters are set only once and apply to all Prebid Mobile ad units. They do not change for a given user session.

* TOC
{:toc}

## Global User Targeting

### Gender

```Swift
public var gender:Gender 
```

gender is an enum with the following values: 

```Swift

public enum Gender: String { 
    case unknown
    case male
    case female
}
```

You can retrieve and set the gender for targeting:

```Swift
let gender = Targeting.shared.gender 

//do something with gender
```

```Swift
Targeting.shared.gender = .unknown;
```

### Year of Birth

```Swift
public var yearofbirth:Int? 
```

You can retrieve and set the year of birth for targeting:

```Swift
if let yob = Targeting.shared.yearofbirth { 
    //do something with yob
};

guard let yob = Targeting.shared.yearofbirth else { 
    print("There was an error retrieving year of birth)
    return 
}

//do something with yob
```

```Swift
Targeting.shared.yearofbirth = 1990;
```

### itunes ID

```Swift
public var itunesID:String?
```
You can retrieve and set the itunesID for targeting:

```Swift
if let itunesID = Targeting.shared.itunesID { 
    //do something with itunesID
};

guard let itunesID = Targeting.shared.itunesID else { 
    print("There was an error retrieving itunesID)
    return 
}

//do something with itunesID

```

```Swift
Targeting.shared.ituneID = "abcdefgh123456";
```

### Location

```Swift
public var location:CLLocation?
```

You can retrieve and set the location for targeting:

```Swift
if let location = Targeting.shared.location { 
    //do something with location
};

guard let location = Targeting.shared.location else { 
    print("There was an error retrieving location)
    return 
}

//do something with location

```

```Swift
Targeting.shared.location = CLLocation(latitude: 40.7418968, longitude: -73.9909143);
```

### Location Precision

```Swift
public var locationPrecision:Int?
```

You can retrieve and set the locationPrecision for targeting:

```Swift
if let locationPrecision = Targeting.shared.locationPrecision { 
    //do something with locationPrecision
};

guard let locationPrecision = Targeting.shared.locationPrecision else { 
    print("There was an error retrieving locationPrecision)
    return 
}

//do something with locationPrecision

```

```Swift
Targeting.shared.locationPrecision = 5
```

## GPDR

Prebid Mobile supports the [IAB GDPR recommendations](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/Mobile%20In-App%20Consent%20APIs%20v1.0%20Draft%20for%20Public%20Comment.md). For a general overview of Prebid Mobile support for GDPR, see [Prebid Mobile Guide to European Ad Inventory and Providing Notice, Transparency and Choice]({{site.github.url}}/prebid-mobile/gdpr.html)

### Subject To GPDR

```Swift
public var subjectToGDPR:Bool?
```

You can retrieve and set the subjectToGDPR for targeting:

```Swift
if let subjectToGDPR = Targeting.shared.subjectToGDPR { 
    //do something with subjectToGDPR
};

guard let subjectToGDPR = Targeting.shared.subjectToGDPR else { 
    print("There was an error retrieving subjectToGDPR)
    return 
}

//do something with subjectToGDPR

```

```Swift
Targeting.shared.subjectToGDPR = false
```

### GDPR Consent String

```Swift
public var gdprConsentString?
```

You can retrieve and set the subjectToGDPR for targeting:

```Swift
if let gdprConsentString = Targeting.shared.gdprConsentString { 
    //do something with gdprConsentString
};

guard let gdprConsentString = Targeting.shared.gdprConsentString else { 
    print("There was an error retrieving gdprConsentString)
    return 
}

//do something with gdprConsentString

```

```Swift
Targeting.shared.gdprConsentString = "A String"
```

## Further Reading

- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-ios.html)



