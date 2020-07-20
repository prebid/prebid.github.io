---
layout: page_v2
sidebarType: 5
title: Prebid Server | Feature | Currency Conversion

---

# Prebid Server | Feature | Currency Conversion

Prebid server supports currency conversions when receiving bids.

- The "desired request currency" is what the request would like all bids to be in
- The "bid response currency" is what the bidder responded with

Some bidders are able to bid in multiple currencies, but cannot, so Prebid Server can normalize the bids for the
client.

## Desired Request Currency

There are several ways to define the request currency:

- The OpenRTB request can define the `cur` parameter. This is an array in OpenRTB, but Prebid Server only looks at the first element of the array.
- PBS-Java can configure the default installation currency (auction.ad-server-currency)
- Otherwise, both versions default to USD

## Loading Currency Conversion Rates

By default, the currency converter uses https://cdn.jsdelivr.net/gh/prebid/currency-file@1/latest.json for currency conversion. This data is updated every 24 hours on prebid.org side.
By default, currency conversions are updated from the endpoint every 30 minutes in prebid server.

Default configuration in PBS-Go:
```
v.SetDefault("currency_converter.fetch_url", "https://cdn.jsdelivr.net/gh/prebid/currency-file@1/latest.json")
v.SetDefault("currency_converter.fetch_interval_seconds", 1800) // 30 minutes
```

Default configuration in PBS-Java:
```
currency-converter:
  external-rates:
    enabled: true
    url: https://cdn.jsdelivr.net/gh/prebid/currency-file@1/latest.json
    default-timeout-ms: 4000
    refresh-period-ms: 900000 // 15 minutes
```

Notes:

- The currency conversion mechanism can be disabled in PBS-Go by setting fetch_interval_seconds to 0.
- Prebid updates the `latest.json` file daily from the European Central Bank. If there's a currency needed for your
installation, you can host your own currency conversion file at a URL using the following JSON schema:
  ```
  {
      "dataAsOf":"2018-09-12",
      "conversions":{
          "USD":{
              "GBP":0.77208
          },
          "GBP":{
              "USD":1.2952
          }
      }
  }
  ```

## Examples

Here are couple examples showing the logic behind the currency converter:

| Bidder bid price | Request Currency    | Rate to USD   | Rate converter is active | Converted bid price (USD) | Valid bid |
| :--------------- | :------------ |:--------------| :------------------------| :-------------------------|:----------|
| 1                | USD           |             1 | YES                      |                         1 | YES       |
| 1                | N/A           |             1 | YES                      |                         1 | YES       |
| 1                | USD           |             1 | NO                       |                         1 | YES       |
| 1                | EUR           |          1.13 | YES                      |                      1.13 | YES       |
| 1                | EUR           |           N/A | YES                      |                       N/A | NO        |
| 1                | EUR           |          1.13 | NO                       |                       N/A | NO        |

## Debug

A dedicated endpoint on the Admin port will allow you to see what's happening within the currency converter.
See [currency rates endpoint](prebid-server/endpoints/pbs-endpoint-admin.html) for more details.
