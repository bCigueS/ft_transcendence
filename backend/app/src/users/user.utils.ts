import { UserEntity } from './entities/user.entity';

export function toSafeUser(user: UserEntity): Omit<UserEntity, 'password'> {
  const { password, ...safeUser } = user;
  return safeUser;
}
