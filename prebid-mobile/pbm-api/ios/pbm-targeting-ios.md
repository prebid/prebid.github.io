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

```
public var gender:Gender 
```

gender is an enum with the following values: 

```

public enum Gender: String { 
    case unknown
    case male
    case female
}
```

You can retrieve and set the gender for targeting:

```
let gender = Targeting.shared.gender 

//do something with gender
```

```
Targeting.shared.gender = .unknown;
```

### Year of Birth

```
public var yearofbirth:Int? 
```

You can retrieve and set the year of birth for targeting:

```
if let yob = Targeting.shared.yearofbirth { 
    //do something with yob
};

guard let yob = Targeting.shared.yearofbirth else { 
    print("There was an error retrieving year of birth)
    return 
}

//do something with yob
```

```
Targeting.shared.yearofbirth = 1990;
```
## Global Application Targeting


### Domain 

Retrieve and set the domain of your app with the following commands:

```
Targeting.shared.domain
```
```
Targeting.shared.domain = domain
```
### Store URL

Retrieve and set the domain of your store URL with the following commands: 

```
Targeting.shared.itunesID
```

```
Targeting.shared.itunesID = itunesID
```

## GPDR

Prebid Mobile supports the [IAB GDPR recommendations](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/Mobile%20In-App%20Consent%20APIs%20v1.0%20Draft%20for%20Public%20Comment.md). For a general overview of Prebid Mobile support for GDPR, see [Prebid Mobile Guide to European Ad Inventory and Providing Notice, Transparency and Choice]({{site.github.url}}/prebid-mobile/gdpr.html)

### Subject To GPDR

```
public var subjectToGDPR:Bool?
```

You can retrieve and set the subjectToGDPR for targeting:

```
if let subjectToGDPR = Targeting.shared.subjectToGDPR { 
    //do something with subjectToGDPR
};

guard let subjectToGDPR = Targeting.shared.subjectToGDPR else { 
    print("There was an error retrieving subjectToGDPR)
    return 
}

//do something with subjectToGDPR

```

```
Targeting.shared.subjectToGDPR = false
```

### GDPR Consent String

```
public var gdprConsentString?
```

You can retrieve and set the subjectToGDPR for targeting:

```
if let gdprConsentString = Targeting.shared.gdprConsentString { 
    //do something with gdprConsentString
};

guard let gdprConsentString = Targeting.shared.gdprConsentString else { 
    print("There was an error retrieving gdprConsentString)
    return 
}

//do something with gdprConsentString

```

```
Targeting.shared.gdprConsentString = "A String"
```

## Further Reading

- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-ios.html)
- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)




