import { Request } from 'express';

import UserWithoutPassword from './userWithoutPassword.interface';

interface RequestWithUser extends Request {
  user: UserWithoutPassword;
}

export default RequestWithUser;
