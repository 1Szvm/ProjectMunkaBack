import dotenv from "dotenv";
import cloudinary from "cloudinary";

// Load environment variables
dotenv.config();

// Cloudinary configuration
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});


// Function to remove from Cloudinary
export const removeFromCloud = (id) => {
  cloudinary.v2.uploader.destroy(id, () => {
    console.log("törlés", `${id}`);
  });
};