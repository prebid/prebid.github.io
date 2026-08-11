import MDXComponents from '@theme-original/MDXComponents';
import {
  StorageAllowed,
  PbjsAdapterRequiredForPbs,
  Fingerprinting,
  LegalWarning,
  SendAllBidsKeywordTargeting,
  DefaultKeywordTargeting,
} from '../components/DevDocs';
import IncludeTodo  from '../components/IncludeTodo';

export default {
    // Keep Docusaurus's own MDX mappings (h1-h6 -> Heading, a -> Link, admonitions,
    // code blocks, ...). Swizzling this file REPLACES the map rather than extending
    // it, so omitting the spread silently drops all of them.
    ...MDXComponents,
    // Add our custom components
    StorageAllowed,
    PbjsAdapterRequiredForPbs,
    Fingerprinting,
    LegalWarning,
    SendAllBidsKeywordTargeting,
    DefaultKeywordTargeting,
    IncludeTodo,
} 