import config from '../../../config.json';

export class PdfjsViewerResources {

  getRedirection(documentUri: string): string {
    const { uri: pdfViewerUri } = config.resources.pdf.viewer;
    const options = config.resources.pdf.viewer.options || { };

    const queryString = new URLSearchParams({ file: documentUri });
    const hashString = new URLSearchParams({ ...options });
    const viewerUrl = `${pdfViewerUri}?${queryString}#${hashString}`;

    return viewerUrl;
  }
}
