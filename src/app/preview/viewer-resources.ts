import config from '../../config';

export class ViewerResources {

  getRedirection(documentUri: string): string {
    const contextPath = config.server.contextPath;
    const { entrypoint: pdfViewerEntrypoint } = config.resources.pdf.viewer;
    const options = config.resources.pdf.viewer.options || { };

    const queryString = new URLSearchParams({ file: documentUri });
    const hashString = new URLSearchParams({ ...options });
    return `${contextPath}${pdfViewerEntrypoint}?${queryString}#${hashString}`;
  }
}
