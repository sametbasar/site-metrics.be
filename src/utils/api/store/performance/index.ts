import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { database } from '../..';
import { Database } from '../../../../@types/enums/database';
import {  ISitePerformance } from '../../../../@types/interfaces/sites';

export const savePerformanceTest = async (data:ISitePerformance): Promise<string> => {
  const docRef = await addDoc(collection(database, Database.PERFORMANCE), {
    ...data,
    createdDate: serverTimestamp(),
  });
  return docRef.id;
};

export const getPerformanceTestByPageName = async (sitename:string, pagename:string, type:'Desktop' | 'Mobile') => {
  try {
    const collectionRef = collection(database, Database.PERFORMANCE);
    const q = query(collectionRef, where('sitename', '==', sitename), where('pagename', '==', pagename), where('type', '==', type), orderBy('createdDate', 'desc'), limit(2) );

    const data = await getDocs(q);
    const result = [] as ISitePerformance[];
    data.docs.forEach((item)=>{
      result.push(item.data() as ISitePerformance);
    });
    return result;
  } catch (e) {
    console.log(e);
  }
};

export const getPerformanceResults = async () => {};
