import React from 'react';
import { useLocation } from '@docusaurus/router';
import { useActivePluginAndVersion } from '@docusaurus/plugin-content-docs/client';
import { DocsVersionDropdownNavbarItem } from '@docusaurus/theme-common/DocsVersionDropdownNavbarItem';

interface VersionDropdownProps {
  docsPluginId: string;
  label?: string;
  className?: string;
}

export default function CustomVersionDropdown({
  docsPluginId,
  label,
  className,
}: VersionDropdownProps): JSX.Element | null {
  const location = useLocation();
  const { activePlugin } = useActivePluginAndVersion();

  // Only show if we're in the correct plugin context
  if (!activePlugin || activePlugin.pluginId !== docsPluginId) {
    return null;
  }

  // Get project name from plugin ID
  const getProjectName = (pluginId: string): string => {
    const projectMap: Record<string, string> = {
      prebidjs: 'Prebid.js',
      prebidServer: 'Prebid Server',
      prebidMobile: 'Prebid Mobile',
      tools: 'Tools',
    };
    return projectMap[pluginId] || pluginId;
  };

  const projectName = getProjectName(docsPluginId);

  return (
    <DocsVersionDropdownNavbarItem
      docsPluginId={docsPluginId}
      label={label || projectName}
      className={className}
    />
  );
} 