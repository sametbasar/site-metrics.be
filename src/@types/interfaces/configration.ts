import { Timestamp } from 'firebase/firestore';

export interface IConfigration {
  id: string;
  key: string;
  value: string;
  createdDate: Timestamp;
  updatedDate: Timestamp;
}
