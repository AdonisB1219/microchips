import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

export const setupMiddlewares = app => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static('./src/public'));

  app.use(compression()).use(helmet());
  app.use(morgan('dev'));

  // Other middlewares
  app.use(cookieParser());
};
