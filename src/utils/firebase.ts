import * as admin from 'firebase-admin';
import serviceAccount from '../utils/firebaseService.json';

// Initialize Firebase Admin only once
if (!admin.apps.length) {
 admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});
}





export default admin;
