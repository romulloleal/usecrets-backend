import { Router } from 'express';

import userRouter from '@modules/users/infra/http/routes/user.routes';
import sessionRouter from '@modules/users/infra/http/routes/session.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import followRouter from '@modules/users/infra/http/routes/follow.routes';
import postRouter from '@modules/posts/infra/http/routes/post.routes';

const routes = Router();

routes.use('/user', userRouter);
routes.use('/session', sessionRouter);
routes.use('/profile', profileRouter);
routes.use('/follow', followRouter);
routes.use('/post', postRouter);

export default routes;
