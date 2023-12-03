import React from "react";
import styles from "./styles.module.css";

type CheckWithBidder = "check with bidder";
type OptionalFlag = boolean | CheckWithBidder;

type GppSids = "tcfeu" | "tcfca" | "usnat" | "usstate_all" | "usp";

type MediaType = "banner" | "video" | "native";

type MultiFormatSupport =
  | "will-bid-on-any"
  | "will-bid-on-one"
  | "will-not-bid"
  | CheckWithBidder;

type OrtbBlockingSupport = boolean | "partial" | CheckWithBidder;

type BidderFeaturesProps = {
  biddercode: string;
  media_types: MediaType[];
  aliasCode?: string;
  tcfeu_supported?: boolean;
  gvl_id?: number;
  usp_supported?: boolean;
  coppa_supported?: boolean;
  gpp_sids?: GppSids[];
  schain_supported?: OptionalFlag;
  dchain_supported?: OptionalFlag;
  userIds: string[];
  safeframes_ok?: OptionalFlag;
  deals_supported?: OptionalFlag;
  floors_supported?: OptionalFlag;
  fpd_supported?: OptionalFlag;
  pbjs?: boolean;
  pbs?: boolean;
  prebid_member?: boolean;
  multiformat_supported: MultiFormatSupport;
  ortb_blocking_supported: OrtbBlockingSupport;
};

const BidderFeatures: React.FC<BidderFeaturesProps> = ({
  biddercode,
  media_types,
  aliasCode,
  tcfeu_supported = false,
  gvl_id,
  usp_supported = false,
  coppa_supported = false,
  gpp_sids,
  userIds = [],
  safeframes_ok = "check with bidder",
  deals_supported = "check with bidder",
  fpd_supported = "check with bidder",
  floors_supported = "check with bidder",
  pbjs = false,
  pbs = false,
  prebid_member = false,
  multiformat_supported = "check with bidder",
  ortb_blocking_supported = "check with bidder",
  schain_supported = "check with bidder",
  dchain_supported = "check with bidder",
}) => {
  const OptionalFlagComponent: React.FC<{
    title?: string;
    flag: OptionalFlag;
  }> = ({ flag, title }) => {
    switch (flag) {
      case true:
        return (
          <span aria-label="yes" className="badge badge--success">
            {title ? title : "yes"}
          </span>
        );
      case false:
        return (
          <span aria-label="no" className="badge badge--danger">
            {title ? title : "no"}
          </span>
        );
      case "check with bidder":
        return (
          <span
            aria-label="check with bidder"
            className="badge badge--secondary"
          >
            {title ? title : "check with bidder"}
          </span>
        );
    }
  };

  const MultiformatComponent: React.FC<{ mfs: MultiFormatSupport }> = ({
    mfs,
  }) => {
    switch (mfs) {
      case "will-bid-on-any":
        return (
          <span aria-label="will bid on any" className="badge badge--success">
            will bid on any
          </span>
        );
      case "will-bid-on-one":
        return (
          <span aria-label="will bid on one" className="badge badge--warning">
            will bid on one
          </span>
        );
      case "will-not-bid":
        return (
          <span aria-label="will not bid" className="badge badge--danger">
            will not bid
          </span>
        );
      case "check with bidder":
        return (
          <span
            aria-label="check with bidder"
            className="badge badge--secondary"
          >
            check with bidder
          </span>
        );
    }
  };

  const OrtbBlockingComponent: React.FC<{ support: OrtbBlockingSupport }> = ({
    support,
  }) => {
    switch (support) {
      case true:
        return (
          <span aria-label="yes" className="badge badge--success">
            yes
          </span>
        );
      case false:
        return (
          <span aria-label="no" className="badge badge--danger">
            no
          </span>
        );
      case "partial":
        return (
          <span aria-label="partial" className="badge badge--warning">
            partial
          </span>
        );
      case "check with bidder":
        return (
          <span
            aria-label="check with bidder"
            className="badge badge--secondary"
          >
            check with bidder
          </span>
        );
    }
  };

  const consentFeatures: [OptionalFlag, React.JSX.Element][] = [
    [
      tcfeu_supported,
      <OptionalFlagComponent title={`🇪🇺 TCF EU`} flag={tcfeu_supported} />,
    ],
    [
      usp_supported,
      <OptionalFlagComponent title="🇺🇸 USP CCPA" flag={usp_supported} />,
    ],
    [
      coppa_supported,
      <OptionalFlagComponent title="🇺🇸 US COPPA" flag={coppa_supported} />,
    ],
  ];
  const consentSupportedFeatures = consentFeatures.filter(([flag]) => flag);
  const consentUnsupportedFeatures = consentFeatures.filter(([flag]) => !flag);
  const consentCheckWithBidderFeatures = consentFeatures.filter(
    ([flag]) => flag === "check with bidder"
  );

  return (
    <>
      <h2>Features</h2>
      <div className="row margin-bottom--sm">
        <div className="col">
          <span className={styles.metaName}>Bidder Code</span>
          <span className="badge badge--primary">{biddercode}</span>
        </div>
        <div className="col">
          <span className={styles.metaName}>Media Types</span>
          {media_types.map((media_type) => (
            <span className="badge badge--primary margin-right--sm">
              {media_type}
            </span>
          ))}
        </div>
      </div>

      <div className="row margin-bottom--sm">
        <div className="col">
          <span className={styles.metaName}>Prebid Member</span>
          <OptionalFlagComponent flag={prebid_member} />
        </div>
        <div className="col">
          <span className={styles.metaName}>Multiformat Support</span>
          <MultiformatComponent mfs={multiformat_supported} />
        </div>
      </div>

      <div className="row margin-bottom--sm">
        <div className="col">
          <span className={styles.metaName}>Prebid.js</span>
          <OptionalFlagComponent flag={pbjs} />
        </div>
        <div className="col">
          <span className={styles.metaName}>Prebid Server</span>
          <OptionalFlagComponent flag={pbs} />
        </div>
      </div>
      <h3>🤝 Consent</h3>

      {gvl_id && (
        <div className={styles.meta}>
          <div className={styles.metaName}>GVL ID</div>
          <div className="badge badge--primary">{gvl_id}</div>
        </div>
      )}

      <div className={styles.meta}>
        <div className={styles.metaName}>Supported</div>
        <div className="">
          {consentSupportedFeatures.length === 0 ? (
            <span>-</span>
          ) : (
            consentSupportedFeatures.map(([, component]) => component)
          )}
        </div>
      </div>

      <div className={styles.meta}>
        <div className={styles.metaName}>Unsupported</div>
        <div className={styles.metaMultipleValues}>
          {consentUnsupportedFeatures.length === 0 ? (
            <span>-</span>
          ) : (
            consentUnsupportedFeatures.map(([, component]) => component)
          )}
        </div>
      </div>

      {consentCheckWithBidderFeatures.length > 0 && (
        <div className={styles.meta}>
          <div className={styles.metaName}>Unsupported</div>
          <div className={styles.metaMultipleValues}>
            {consentUnsupportedFeatures.map(([, component]) => component)}
          </div>
        </div>
      )}

      <div className={styles.meta}>
        <div className={styles.metaName}>GPP Section IDs</div>
        <div className={styles.metaMultipleValues}>
          {gpp_sids ? (
            gpp_sids.map((sid) => (
              <span className="badge badge--primary">{sid}</span>
            ))
          ) : (
            <span className="badge badge--secondary">check with bidder</span>
          )}
        </div>
      </div>

      <h3>🎯 Adressability & Identity</h3>

      <div className={styles.meta}>
        <div className={styles.metaName}>User IDs</div>
        <div className={styles.metaMultipleValues}>
          {userIds.length === 0 ? (
            <span className="badge badge--danger">none</span>
          ) : (
            userIds.map((userId) => (
              <span className="badge badge--primary margin-right--sm">
                {userId}
              </span>
            ))
          )}
        </div>
      </div>

      <div className={styles.meta}>
        <div className={styles.metaName}>First party data</div>
        <div className="">
          <OptionalFlagComponent flag={fpd_supported} />
        </div>
      </div>

      <h3>💵 Yield</h3>
      <div className={styles.meta}>
        <div className={styles.metaName}>Floor price module</div>
        <div className="">
          <OptionalFlagComponent flag={floors_supported} />
        </div>
      </div>
      <div className={styles.meta}>
        <div className={styles.metaName}>Deals</div>
        <div className="">
          <OptionalFlagComponent flag={deals_supported} />
        </div>
      </div>

      <h3>🛡️ Protection</h3>
      <div className={styles.meta}>
        <div className={styles.metaName}>Safeframes</div>
        <div className="">
          <OptionalFlagComponent flag={safeframes_ok} />
        </div>
      </div>
      <div className={styles.meta}>
        <div className={styles.metaName}>ORTB Blocking</div>
        <div className="">
          <OrtbBlockingComponent support={ortb_blocking_supported} />
        </div>
      </div>
      <div className={styles.meta}>
        <div className={styles.metaName}>DSchain</div>
        <div className="">
          <OrtbBlockingComponent support={dchain_supported} />
        </div>
      </div>
      <div className={styles.meta}>
        <div className={styles.metaName}>Schain</div>
        <div className="">
          <OrtbBlockingComponent support={schain_supported} />
        </div>
      </div>
    </>
  );
};

export default BidderFeatures;
