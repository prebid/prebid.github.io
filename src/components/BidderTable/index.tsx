import React from "react";

type BidderEntry = {
  source?: string;
  title: string;
  permalink: string;
  meta: {pbjs?: unknown; pbs?: unknown};
};

// The manifest deliberately retains raw frontmatter. Only explicit true means
// supported, matching the legacy consumer; strings such as "no" are not flags.
export default function BidderTable({bidders}: {bidders: BidderEntry[]}) {
  return <table>
    <thead><tr><th>Bidder</th><th>Client</th><th>Server</th></tr></thead>
    <tbody>{bidders.map(bidder => <tr key={bidder.source ?? bidder.permalink}>
      <td><a href={bidder.permalink}>{bidder.title}</a></td>
      <td>{bidder.meta.pbjs === true ? "true" : "false"}</td>
      <td>{bidder.meta.pbs === true ? "true" : "false"}</td>
    </tr>)}</tbody>
  </table>;
}
