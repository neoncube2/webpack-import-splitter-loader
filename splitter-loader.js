import { processContent, getAbsoluteImportFilepath } from './splitter-utils.js';

async function isEntry(loader, importFilepath) {
    const context = loader.rootContext.replaceAll('\\', '/');

    for (let entry of loader._compilation.entries.values()) {
        for (let entryDependency of entry.dependencies) {
            const entryFilepath = await getAbsoluteImportFilepath(entryDependency.request, loader, context);

            if (entryFilepath === importFilepath)
                return true;
        }
    }

    return false;
}

export default async function asyncLoader(content, map, meta) {
    const {
        exportName = '*',
        importFilepath = this._module.userRequest.replaceAll('\\', '/'),
        mustFindImport = false
    } = this.getOptions();

    const loader = this;

    if (!await isEntry(loader, importFilepath))
        return content;

    // console.log('Exporting ' + exportName + ' from "' + importFilepath + '" (In splitter loader)');

    const processedContent = await processContent(content, exportName, importFilepath, loader, mustFindImport)

    // console.log('Result of exporting ' + exportName + ' from "' + importFilepath + '" (In splitter loader)');

    // console.log(processedContent);

    return processedContent;
}