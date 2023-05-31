import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { database } from '../..';
import { Database } from '../../../../@types/enums/database';
import { IConfigration } from '../../../../@types/interfaces/configration';


export const getConfigration = async (key:string): Promise<string> => {
  const collectionRef = collection(database, Database.CONFIGRATION);
  const q = query(collectionRef, where('key', '==', key), limit(1));

  const querySnapshot = await getDocs(q);
  if (querySnapshot.docs.length > 0) {
    const docSnap = querySnapshot.docs[0];
    const configration: IConfigration = docSnap.data() as IConfigration;

    return configration.value;
  }
  return '';
};
