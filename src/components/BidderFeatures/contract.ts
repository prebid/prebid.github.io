// Contract for explicit component props, not a raw-frontmatter normalizer.
// Omitted-value defaults remain in the component until domain decisions close.
export type CheckWithBidder = "check with bidder";
export type OptionalFlag = boolean | CheckWithBidder;
export type MediaType = "banner" | "video" | "native";
export type GppSids = "tcfeu" | "tcfca" | "usnat" | "usstate_all" | "usp";
export type MultiFormatSupport = "will-bid-on-any" | "will-bid-on-one" | "will-not-bid" | CheckWithBidder;
export type OrtbBlockingSupport = boolean | "partial" | CheckWithBidder;
export type BidderFeaturesProps = {
  biddercode: string;
  media_types: MediaType[];
  aliasCode?: string;
  tcfeu_supported?: OptionalFlag;
  gvl_id?: number | string;
  usp_supported?: OptionalFlag;
  coppa_supported?: OptionalFlag;
  gpp_sids?: GppSids[];
  schain_supported?: OptionalFlag;
  dchain_supported?: OptionalFlag;
  userIds?: string[];
  safeframes_ok?: OptionalFlag;
  deals_supported?: OptionalFlag;
  floors_supported?: OptionalFlag;
  fpd_supported?: OptionalFlag;
  pbjs?: boolean;
  pbs?: boolean;
  prebid_member?: boolean;
  multiformat_supported?: MultiFormatSupport;
  ortb_blocking_supported?: OrtbBlockingSupport;
};

const flags = ["tcfeu_supported", "usp_supported", "coppa_supported", "schain_supported",
  "dchain_supported", "safeframes_ok", "deals_supported", "floors_supported", "fpd_supported"];
const booleans = ["pbjs", "pbs", "prebid_member"];
const known = new Set(["biddercode", "media_types", "aliasCode", "gvl_id", "gpp_sids", "userIds",
  "multiformat_supported", "ortb_blocking_supported", ...flags, ...booleans]);

export function assertBidderFeaturesProps(input: unknown): asserts input is BidderFeaturesProps {
  const fail = (field: string, expected: string): never => {
    throw new TypeError(`BidderFeatures.${field}: expected ${expected}; raw metadata needs an explicit consumer projection`);
  };
  if (!input || typeof input !== "object" || Array.isArray(input)) fail("props", "an object");
  const values = input as Record<string, unknown>;
  for (const key of Object.keys(values)) if (!known.has(key)) fail(key, "a declared component prop");
  const string = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
  if (!string(values.biddercode)) fail("biddercode", "a nonempty string");
  const array = (key: string, allowed?: string[]) => {
    const value = values[key];
    if (!Array.isArray(value) || !Array.from(value).every(item => string(item) && (!allowed || allowed.includes(item)))) {
      fail(key, allowed ? `an array containing only ${allowed.join(", ")}` : "an array of nonempty strings");
    }
  };
  array("media_types", ["banner", "video", "native"]);
  if ((values.media_types as unknown[]).length === 0) fail("media_types", "at least one supported media type");
  if (values.userIds !== undefined) array("userIds");
  if (values.gpp_sids !== undefined) array("gpp_sids", ["tcfeu", "tcfca", "usnat", "usstate_all", "usp"]);
  for (const key of flags) if (values[key] !== undefined && typeof values[key] !== "boolean" && values[key] !== "check with bidder") fail(key, "boolean or check with bidder");
  for (const key of booleans) if (values[key] !== undefined && typeof values[key] !== "boolean") fail(key, "boolean");
  if (values.aliasCode !== undefined && !string(values.aliasCode)) fail("aliasCode", "a nonempty string");
  if (values.gvl_id !== undefined && !string(values.gvl_id) && !(Number.isSafeInteger(values.gvl_id) && Number(values.gvl_id) >= 0)) fail("gvl_id", "a nonnegative integer or nonempty source text");
  if (values.multiformat_supported !== undefined && (typeof values.multiformat_supported !== "string" || !["will-bid-on-any", "will-bid-on-one", "will-not-bid", "check with bidder"].includes(values.multiformat_supported))) fail("multiformat_supported", "a declared multiformat value");
  if (values.ortb_blocking_supported !== undefined && typeof values.ortb_blocking_supported !== "boolean" && (typeof values.ortb_blocking_supported !== "string" || !["partial", "check with bidder"].includes(values.ortb_blocking_supported))) fail("ortb_blocking_supported", "boolean, partial, or check with bidder");
}
