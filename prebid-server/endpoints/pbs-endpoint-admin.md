---
layout: page_v2
sidebarType: 5
title: Prebid Server | Admin Endpoints

---

# Prebid Server | Admin Endpoints
{: .no_toc}

There are several endpoints on the special `admin` port that a host company may utilize that aren't available to external users. This port defaults to 8060, but can be set in the `admin.port` config.

* TOC
{:toc}

## GET /currency/rates

This endpoint exposes active currency rate converter information in the server.
Information are:
- `info.active`: true if currency converter is active
- `info.source`: URL from which rates are fetched
- `info.fetchingIntervalNs`: Fetching interval from source in nanoseconds
- `info.lastUpdated`: Datetime when the rates where updated
- `info.rates`: Internal rates values

### Sample responses
#### Rate converter active
```json
{
    "active": true,
    "info": {
        "source": "https://cdn.jsdelivr.net/gh/prebid/currency-file@1/latest.json",
        "fetchingIntervalNs": 60000000000,
        "lastUpdated": "2019-03-02T14:18:41.221063+01:00",
        "rates": {
            "GBP": {
                "AUD": 1.8611576401,
                "BGN": 2.2750325703,
                "BRL": 5.0061650847,
                "CAD": 1.7414619393,
                "CHF": 1.3217708915,
                "CNY": 8.8791178113,
                "CZK": 29.8203982877,
                "DKK": 8.6791596873,
                "EUR": 1.163223525,
                "GBP": 1,
                "HKD": 10.3927042621,
                "HRK": 8.645077238,
                "HUF": 367.6484273218,
                "IDR": 18689.5123766983,
                "ILS": 4.8077191513,
                "INR": 93.8663223525,
                "ISK": 158.0820770519,
                "JPY": 148.1365159129,
                "KRW": 1491.3921459148,
                "MXN": 25.5839382096,
                "MYR": 5.394332775,
                "NOK": 11.3144425833,
                "NZD": 1.9374651033,
                "PHP": 68.6139028476,
                "PLN": 5.0130281035,
                "RON": 5.5172855016,
                "RUB": 87.2333891681,
                "SEK": 12.2141959799,
                "SGD": 1.7908989391,
                "THB": 42.0074911595,
                "TRY": 7.1224176438,
                "USD": 1.3240973385,
                "ZAR": 18.7774520752
            },
            "USD": {
                "AUD": 1.4056048493,
                "BGN": 1.7181762277,
                "BRL": 3.7808134938,
                "CAD": 1.3152068875,
                "CHF": 0.9982429939,
                "CNY": 6.705789335,
                "CZK": 22.5213036985,
                "DKK": 6.554774664,
                "EUR": 0.8785030308,
                "GBP": 0.7552314855,
                "HKD": 7.8488974787,
                "HRK": 6.5290345252,
                "HUF": 277.6596679259,
                "IDR": 14114.9081964333,
                "ILS": 3.6309408767,
                "INR": 70.8908020733,
                "ISK": 119.3885618905,
                "JPY": 111.8773609769,
                "KRW": 1126.3463058948,
                "MXN": 19.3217956602,
                "MYR": 4.0739699552,
                "NOK": 8.5450232803,
                "NZD": 1.4632346482,
                "PHP": 51.8193797769,
                "PLN": 3.7859966617,
                "RON": 4.1668277256,
                "RUB": 65.8814020908,
                "SEK": 9.2245453747,
                "SGD": 1.3525432663,
                "THB": 31.7253799526,
                "TRY": 5.3790740578,
                "USD": 1,
                "ZAR": 14.1813230256
            }
        }
    }
}
```

#### Rate converter set with constant rates
```json
{
    "active": true,
    "source": "",
    "fetchingIntervalNs": 0,
    "lastUpdated": "0001-01-01T00:00:00Z"
}
```

#### Rate converter not set
```json
{
    "active": false
}
```

## /logging/httpinteraction

(PBS-Java only)
 
This endpoint turns on temporary logging of raw HTTP requests and responses, mainly for troubleshooting production issues.

Interaction is logged at INFO level using http-interaction logback logger so make sure this logger has at least INFO or more verbose level set (logback configuration bundled in JAR file sets this logger to INFO level).

Query Params
- endpoint - endpoint to be affected; valid values: auction, amp; if omitted all valid endpoints will be affected
- statusCode - specifies that only interactions resulting in this response status code should be logged; valid values: >=200 and <=500
- account - specifies that only interactions involving this account should be logged
- limit - number of interactions to log; there is an upper threshold for this value set in configuration
- bidder - name of the bidder whose adapter request will be logged

## /logging/changelevel

(PBS-Java only)

This endpoint allows changing org.prebid.server logger level temporarily, mainly for troubleshooting production issues.

Query Params
- level - desired logging level to set; must be one of error, warn, info, debug
- duration - for how long (in milliseconds) to change level before it gets reset to original; there is an upper threshold for this value set in configuration

