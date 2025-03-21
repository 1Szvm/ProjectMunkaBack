import express from "express";
import cors from "cors";
import { removeFromCloud } from "./cloudinaryConfig.js";
import admin from "firebase-admin";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const serviceAccount = require("./serviceAccountKey.json"); // Correct JSON import

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
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
