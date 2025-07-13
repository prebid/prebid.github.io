import MDXComponents from '@theme/MDXComponents';
import {
  StorageAllowed,
  PbjsAdapterRequiredForPbs,
  Fingerprinting,
  LegalWarning,
  SendAllBidsKeywordTargeting,
  DefaultKeywordTargeting,
} from '../components/DevDocs';

export default {
    // Allows customizing built-in components, e.g. to add styling.
    ...MDXComponents,
    // Add our custom components
    StorageAllowed,
    PbjsAdapterRequiredForPbs,
    Fingerprinting,
    LegalWarning,
    SendAllBidsKeywordTargeting,
    DefaultKeywordTargeting,
} 