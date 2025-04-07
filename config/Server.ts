import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createExpressServer, useContainer } from "routing-controllers";
import config from 'config';
import Container from 'typedi';
import { HttpErrorHandler } from '../middlewares/HttpErrorHandler';
import helmet from 'helmet';
import { RateLimiterMiddleware } from '../middlewares/RateLimiterMiddleware';
import { AuthController } from '../controllers/AuthController'
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

useContainer(Container);

class Server {
	private app: express.Application;

	private initializeMiddlewares: Array<any> = [
		cors(),
		helmet(),
		bodyParser.json(),
		bodyParser.urlencoded({ extended: true }),
		HttpErrorHandler,
		RateLimiterMiddleware
	]

	private initializeControllers: Array<any> = [
		AuthController
		]

	constructor() {
		this.app = createExpressServer({
			cors: true,
			classTransformer: true,
			authorizationChecker: AuthMiddleware,
			routePrefix: '/services',
			defaultErrorHandler: false,
			middlewares: this.initializeMiddlewares,
			controllers: this.initializeControllers,
		});
	}

	public start(): void {
		const PORT = config.get("app.port");
		this.app.listen(PORT, () => {
			console.log(`Server is running on PORT ${PORT}`);
		});
	}
}

export default new Server();