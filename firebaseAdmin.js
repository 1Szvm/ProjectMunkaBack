const admin = require("firebase-admin");

// Initialize Firebase Admin SDK (Make sure to replace with your service account key)
const serviceAccount = require("./path/to/your/serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
