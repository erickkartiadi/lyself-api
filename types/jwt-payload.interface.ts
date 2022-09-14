import UserWithoutPass from './user-without-pass.type';

type JwtPaylaod = Pick<UserWithoutPass, 'id'>;

export default JwtPaylaod;
