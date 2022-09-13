import UserWithoutPass from './user-without-pass.type';

type JwtPaylaod = Pick<UserWithoutPass, 'id' | 'email' | 'isConfirmed'>;

export default JwtPaylaod;
