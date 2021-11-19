import dotenv from 'dotenv';
dotenv.config();

import App from './app'
import express from "express";
import * as bodyParser from 'body-parser';
import path from "path";
import { middlewareLogger } from "./middleware/logger";

import HomeController from './controllers/home.controller'

const app = new App({
  port: Number.parseInt(process.env.PORT) || 3001,
  controllers: [
    new HomeController()
  ],
  middleWares: [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    express.static(path.join(__dirname, 'app')),
    middlewareLogger
  ]
})

app.listen()