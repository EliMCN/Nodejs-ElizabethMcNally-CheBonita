import { db } from '../config/firebase.config.js';

const deleteAllProductsFromFirestore = async () => {
  try {
    const snapshot = await db.collection('products').get();
    const batch = db.batch();

    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(` Se eliminaron ${snapshot.size} productos de Firestore`);
  } catch (err) {
    console.error(' Error al eliminar productos:', err.message);
  }
};

deleteAllProductsFromFirestore();


//node scripts/deleteAllProductsFromFirestore.js