import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDgXUu5XZBxR3hPE-6PdcOBE29lhQl9UoE',
  authDomain: 'pagespeeddb.firebaseapp.com',
  projectId: 'pagespeeddb',
  storageBucket: 'pagespeeddb.appspot.com',
  messagingSenderId: '303527264316',
  appId: '1:303527264316:web:9129bda8828073307e0339',
  measurementId: 'G-CEEZPPW1MT',
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

export { database };
