import { collection, getDocs, query } from 'firebase/firestore';
import { database } from '../..';
import { Database } from '../../../../@types/enums/database';
import { ISite } from '../../../../@types/interfaces/sites';

export const getSiteList = async (): Promise<ISite[]> => {
  const sites = [] as ISite[];
  const collectionRef = collection(database, Database.SITES);
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);

  if (querySnapshot.docs.length > 0) {
    querySnapshot.forEach(doc => {
      sites.push({
        ...(doc.data() as ISite),
        id: doc.id,
      });
    });
  }

  return sites;
};
