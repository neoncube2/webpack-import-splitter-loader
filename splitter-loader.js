import { processContent, getNormalizedImportFilepath } from './splitter-utils.js';

async function isEntry(loader, importFilepath) {
    const entryContext = loader._compiler.options.context;

    for (let entry of loader._compilation.entries.values()) {
        for (let entryDependency of entry.dependencies) {
            const entryFilepath = await getNormalizedImportFilepath(entryDependency.request, entryContext, loader);

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
        context = this.rootContext.replaceAll('\\', '/'),
        mustFindImport = false
    } = this.getOptions();

    const loader = this;

    if (!await isEntry(loader, importFilepath))
        return content;

    const processedContent = await processContent(content, exportName, importFilepath, context, loader, mustFindImport)

    console.log('In splitter loader, exporting ' + exportName + ' from ' + importFilepath + ' with context ' + context);
    console.log(processedContent);

    return processedContent;
}