import { Timestamp } from 'firebase/firestore';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  active: boolean;
  createdDate: Timestamp;
  updatedDate: Timestamp;
}

export interface IAuthorization extends Omit<IUser, 'password'> {
  token: string;
}
