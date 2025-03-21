import express from "express";
import cors from "cors";
import { removeFromCloud } from "./cloudinaryConfig.js";
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
    }),
  });
}

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// Route to delete a post
app.delete("/post/:id", async (req, res) => {
  try {
    const { id } = req.params;
    removeFromCloud(id);
    res.json({ msg: "Sikeres törlés" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Hiba történt a törlés során" });
  }
});

// Route to get all users
app.get("/api/users", async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers();
    
    const usersArray = listUsersResult.users.map(userRecord => ({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName || "No Name",
      photoURL: userRecord.photoURL || null,
    }));

    res.json(usersArray);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Start server
app.listen(port, () => console.log(`Server listening on port: ${port}`));
