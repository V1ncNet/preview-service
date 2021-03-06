import Server from './app/infrastructure/server';
import express from 'express';
import config from './config.json';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { CorsUriResolver } from './app/presentation/cors-uri-resolver';
import { PdfjsViewerResources } from './app/infrastructure/pdfjs-viewer-resources';
import { ProxyAuthenticationService } from './app/application/auth/proxy-authentication.service';

export const uriResolver = new CorsUriResolver();
export const viewerResources = new PdfjsViewerResources();
export const proxyAuthenticationService = new ProxyAuthenticationService(config.proxy.auth);

(async () => {
  const server = await Server.getDefault();

  server.app.set('json spaces', 2);
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  if (process.env.NODE_ENV === 'development' || config.NODE_ENV === 'development') {
    server.use(morgan('dev'));
    server.use(cors());
  }

  if (process.env.NODE_ENV === 'production' || config.NODE_ENV === 'production') {
    server.use(helmet());
  }

  server.app.use(config.server.contextPath + '/r', express.static(path.join(__dirname, 'r')));

  server.start();
})();
