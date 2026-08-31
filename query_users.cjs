const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// We need to use the default service account since we are on the server
try {
  initializeApp();
  const db = getFirestore();
  
  async function run() {
    const snapshot = await db.collection('users').get();
    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
    });
  }
  run();
} catch (e) {
  console.log(e);
}
