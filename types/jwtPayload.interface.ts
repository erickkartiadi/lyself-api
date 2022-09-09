import UserWithoutPassword from './userWithoutPassword.interface';

type JwtPaylaod = Pick<UserWithoutPassword, 'id' | 'email'>;

export default JwtPaylaod;
