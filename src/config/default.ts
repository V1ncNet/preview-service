import path from 'path';

export = {
  port: 3000,
  server: {
    contextPath: '',
    storageRoot: path.join(__dirname, 'storage'),
  },
  resources: {
    pdf: {
      viewer: {
        entrypoint: '/r/pdfjs/build/minified/web/viewer.html',
        options: {},
      },
    },
  },
  proxy: {
    auth: {
      basic: [],
    },
  },
};
