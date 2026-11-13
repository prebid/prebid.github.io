---
layout: page_v2
title: Using Prebid.js with TypeScript
description: Type definitions for Prebid.js, and checking bidder and module parameters with TypeScript
sidebarType: 1
---

# Using Prebid.js with TypeScript

{: .no_toc }

* TOC
{:toc}

## Type definitions

The [`prebid.js` npm package](https://www.npmjs.com/package/prebid.js) includes type definitions for the `pbjs` API, its configuration, and every module. To use only the types, for example with a Prebid.js bundle loaded from a CDN, import them in a TypeScript file:

```typescript
import 'prebid.js/types.d.ts';
import 'prebid.js/global.d.ts';

pbjs.que.push(() => {
  pbjs.setConfig({ debug: true });
});
```

`global.d.ts` declares the `pbjs` global. If your bundle uses a different global name, declare it with the `PrebidJS` type instead:

```typescript
import type { PrebidJS } from 'prebid.js/types.d.ts';

declare global {
  interface Window {
    myCustomPrebidGlobal: PrebidJS;
  }
}
```

The type definitions require TypeScript 5.7 or later, with `moduleResolution` set to `bundler`, `node16` or `nodenext`. See the [Prebid.js README](https://github.com/prebid/Prebid.js#typescript-configuration) for the full `tsconfig.json` requirements.

## Checking bidder and module parameters

Bid adapters, User ID modules and Real-Time Data modules that declare their parameter types have them checked when you name them. When you pass configuration to `setConfig`, `mergeConfig`, `setBidderConfig` or `mergeBidderConfig`, or ad units to `addAdUnits` or `requestBids`, directly in the call, the names are inferred from it:

```typescript
pbjs.setConfig({
  userSync: {
    // error: `create` must be a boolean
    userIds: [{ name: 'sharedId', params: { create: 'yes' } }]
  }
});

pbjs.addAdUnits({
  code: 'slot',
  // error: `placementId` must be a number or a string
  bids: [{ bidder: 'appnexus', params: { placementId: true } }]
});
```

Bidders and modules that don't declare types (custom bidders, aliases, and modules without typed parameters) accept any parameters.

### Configuration built in a variable

If you build configuration or ad units in a variable before passing them, TypeScript widens their names to `string`, and their parameters are not checked. To keep the checks, name the bidders or modules in the variable's type, with `satisfies` or a type annotation:

```typescript
import type { AdUnitDefinition, Config } from 'prebid.js/types.d.ts';

const config = {
  userSync: { userIds: [{ name: 'sharedId', params: { create: true } }] },
  realTimeData: { dataProviders: [{ name: 'geolocation' }] }
} satisfies Partial<Config<'sharedId' | 'geolocation'>>;

const adUnits = [
  { code: 'slot', bids: [{ bidder: 'appnexus', params: { placementId: 123 } }] }
] satisfies AdUnitDefinition<'appnexus'>[];

pbjs.setConfig(config);
pbjs.addAdUnits(adUnits);
```

* A name that isn't listed in the type is rejected, so list custom ones too, for example `Config<'sharedId' | 'myCustomId'>`.
* Without names (`satisfies Partial<Config>` or `AdUnitDefinition[]`), parameters are not checked.
* `as const` doesn't work, because Prebid.js's types expect mutable arrays.

{: .alert.alert-info :}
Parameter checking for inline configuration, and naming bidders and modules in `Config` and `AdUnitDefinition`, need a Prebid.js release that includes [prebid/Prebid.js#16122](https://github.com/prebid/Prebid.js/pull/16122).

## Further reading

* [Publisher API Reference](/dev-docs/publisher-api-reference.html)
* [Prebid.js README: usage as an npm dependency](https://github.com/prebid/Prebid.js#usage-as-a-npm-dependency)
