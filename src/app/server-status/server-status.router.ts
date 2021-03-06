import { Request, Response, Router } from 'express';
import { SERVER_STATUS_ENDPOINT } from '../application/endpoints';
import { getRoutes } from './server.status.service';


export const router: Router = Router();

// getStatus
router.get(SERVER_STATUS_ENDPOINT + '/', (req: Request, res: Response) => {
  res.status(200).send({
    'status': 'server is running',
  });
});

// getRoutes
router.get(SERVER_STATUS_ENDPOINT + '/routes', (req: Request, res: Response) => {
  const routes = getRoutes();
  res.status(200).send({
    numberOfRoutes: routes.length,
    routes: routes,
  });
});


