import { Router } from 'express';

import AuthenticateUserService from '@modules/users/services/Session/AuthenticateUserService';
import RefreshAccessTokenService from '@modules/users/services/Session/RefreshAccessTokenService';
import ensureAuthenticated from '@middlewares/ensureAuthenticated';
import GetAuthenticatedUserProfileService from '@modules/users/services/Session/GetAuthenticatedUserProfileService';

const sessionRouter = Router();

sessionRouter.post('/authenticate', async (request, response) => {
  const { login, password } = request.body;

  const authenticateUser = new AuthenticateUserService();

  const authenticatedUser = await authenticateUser.execute({
    login,
    password,
  });

  return response.json({ status: 'success', data: authenticatedUser });
});

sessionRouter.get(
  '/getAuthenticatedUserProfile',
  ensureAuthenticated,
  async (request, response) => {
    const loggedUserId = request.user.id;

    const getAuthenticatedUser =
      new GetAuthenticatedUserProfileService();

    const authenticatedUser = await getAuthenticatedUser.execute(
      loggedUserId,
    );

    return response.json({ status: 'success', data: authenticatedUser });
  },
);

sessionRouter.post('/refreshAccessToken', async (request, response) => {
  const { refreshToken } = request.body;
  const refreshAccessTokenService = new RefreshAccessTokenService();
  const newCredentials = await refreshAccessTokenService.execute(
    refreshToken,
  );
  return response.json({ status: 'sucess', data: newCredentials });
});

export default sessionRouter;
