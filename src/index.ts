import config from './config';
import Server from './app/server';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { CorsUriResolver } from './app/proxy';
import { ViewerResources } from './app/preview';
import { ProxyAuthenticationService } from './app/proxy/auth';
import { ProxyFactory } from './app/proxy/proxy.factory';

export const uriResolver = new CorsUriResolver();
export const viewerResources = new ViewerResources();
export const proxyAuthenticationService = new ProxyAuthenticationService(config.proxy.auth);
export const proxyFactory = new ProxyFactory();


Server.getDefault().then(server => {
  server.app.set('json spaces', 2);
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  if (config.environment === 'development') {
    server.use(morgan('dev'));
    server.use(cors());
  }

  if (config.environment === 'production') {
    server.use(helmet());
  }

  server.app.use(config.server.contextPath + '/r', express.static(path.join(__dirname, 'r')));

  server.start();
});
