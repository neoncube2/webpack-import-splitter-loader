import { processContent, getSplitterLoader } from './splitter-utils.js';

export default async function asyncLoader(content, map, meta) {
    const {
        exportName,
        importFilepath,
        mustFindImport
    } = this.getOptions();

    const loader = this;

    if (await getSplitterLoader(loader) == null) {
        // console.log('Skipping "' + importFilepath + '", because it didn\'t have a splitter loader');

        return content;
    }

    // console.log('Exporting ' + exportName + ' from "' + importFilepath + '" with context "' + context + '" (In inner splitter loader)');

    const processedContent = await processContent(content, exportName, importFilepath, loader, mustFindImport);

    // console.log('Result of exporting ' + exportName + ' from "' + importFilepath + '" with context "' + context + '" (In inner splitter loader)');

    // console.log(processedContent);

    return processedContent;
}