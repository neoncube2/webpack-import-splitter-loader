import { processContent, getSplitterLoader } from './splitter-utils.js';

export default async function asyncLoader(content, map, meta) {
    const {
        exportName,
        importFilepath,
        context,
        mustFindImport
    } = this.getOptions();

    const loader = this;

    if (await getSplitterLoader(loader, context) == null)
        return content;

    const processedContent = await processContent(content, exportName, importFilepath, context, loader, mustFindImport);

    console.log('In inner splitter loader, exporting ' + exportName + ' from ' + importFilepath + ' with context ' + context);
    console.log(processedContent);

    return processedContent;
}