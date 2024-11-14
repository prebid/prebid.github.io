import { LoadContext, PluginModule } from "@docusaurus/types";
import { DocFrontMatter, LoadedContent, LoadedVersion } from "@docusaurus/plugin-content-docs";
import fs from 'fs';
import path from 'path';

export interface TocPluginOptions {
    /** reference the docusaurus-content-docs plugin id */
    contentDocsId: string;

    /**
     * filter the relevant doc files to generate
     */
    filter: (doc: DocFrontMatter & Record<string, unknown>) => boolean;

    /** where to put the JSON file */
    output: string;
}


export const tocPlugin: PluginModule<TocPluginOptions> = (context: LoadContext, options: TocPluginOptions) => ({
    name: 'toc-plugin',
    allContentLoaded({ allContent, actions }) {
        if (!options.contentDocsId) {
            return Promise.reject('No contentDocsId provided');
        }

        // access the loaded content from the content-docs plugin
        const loadedContent = allContent['docusaurus-plugin-content-docs'][options.contentDocsId] as LoadedContent;

        // TODO: handle multiple versions properly
        const currentVersion = loadedContent.loadedVersions.find((version: LoadedVersion) => version.versionName === 'current');
        if (!currentVersion) {
            return Promise.reject('No current version found');
        }
        const filteredDocs = currentVersion.docs.filter(options.filter);

        const output = filteredDocs.map((doc) => ({
            source: doc.source,
            permalink: doc.permalink, // FIXME seems to be the same for different versions
            title: doc.title,
            meta: doc.frontMatter,
        }));

        const outputPath = path.resolve(context.siteDir, options.output);
        fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');

    },
});