import config from '../../config.json';


export class ViewerResources {

  getRedirection(documentUri: string): string {
    const contextPath = config.server.contextPath;
    const { uri: pdfViewerUri } = config.resources.pdf.viewer;
    const options = config.resources.pdf.viewer.options || { };

    const queryString = new URLSearchParams({ file: documentUri });
    const hashString = new URLSearchParams({ ...options });
    return `${contextPath}${pdfViewerUri}?${queryString}#${hashString}`;
  }
}
