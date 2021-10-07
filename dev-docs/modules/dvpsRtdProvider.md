The purpose of this real-time data provider is to allow publishers to set DoubleVerify Publisher Solution targeting on ad units.

**Usage for Publishers:**

Compile the DVPS provider into your Prebid build:

```
gulp build --modules=dvpsRtdProvider
```

Add the DVPS provider configuration by setting up a Prebid config:

```javascript
pbjs.setConfig({
  ...,
  realTimeData: {
    dataProviders: [
      {
        name: "dvps",
        params: {
          ctx: "11111111",
          cmp: "22222222",
          signals: ["ids", "bsc", "vlp", "tvp"]
        }
      }
    ]
  }
});
```

where:
- `ctx` (required) - ID associated with the publisher.
- `cmp` (required) - Tag ID.
- `signals` (optional) - Array of signal names. Possible values are: `"ids"`, `"bsc"`, `"vlp"`, `"tvp"`. By default all signals available to the publisher are requested.

**Example:**

To view an example:

- in your CLI run:

  `gulp serve --modules=dvpsRtdProvider,appnexusBidAdapter,rubiconBidAdapter,trustxBidAdapter`

  You can also use any other bid adapters.

- in your browser, navigate to:

  http://localhost:9999/integrationExamples/gpt/dvpsRtdProvider_example.html
