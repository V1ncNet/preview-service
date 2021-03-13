export = {
  port: 3000,
  server: {
    contextPath: '',
  },
  resources: {
    pdf: {
      viewer: {
        uri: '/r/pdfjs/build/minified/web/viewer.html',
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

