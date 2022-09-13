import { User } from '@prisma/client';

type UserWithoutPass = Omit<User, 'password'>;

export default UserWithoutPass;
