import { User } from '@prisma/client';

type UserWithoutPassword = Omit<User, 'password'>;

export default UserWithoutPassword;
