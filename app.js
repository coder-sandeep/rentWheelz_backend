global.__baseDir = __dirname;

const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const ownerRoutes = require("./routes/owner");
const generalRoutes = require("./routes/general");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const cors = require("cors");
const express = require("express");
const app = express();
require("dotenv").config();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json({ extended: false }));

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/owner", ownerRoutes);
app.use("/general", generalRoutes);

app.use("/uploadVehicleImages", (req, res) => {
  return res.send(`<!DOCTYPE html>
        <html>
        <head>
          <title>File Upload</title>
        </head>
        <body>
          <h1>File Upload</h1>
          <form action="/owner/vehicle/addImages" method="POST" enctype="multipart/form-data">
            <input type="file" name="vehicle_image1" id=""><br><br>
            
            <input type="file" name="vehicle_image2" id=""><br><br>
            
            <input type="file" name="vehicle_image3" id=""><br><br>

            <input type="hidden" name="rentalRequestId" value="649291589958039b3174a9b6"><br><br>

            <input type="hidden" name="ownerId" value="6492841473fbb01749bf5fea"><br><br>
            
            <button type="submit">Upload Files</button>
          </form>
        </body>
        </html>
        `);
});

app.use("/uploadOwnerDocs", (req, res) => {
  return res.send(`<!DOCTYPE html>
        <html>
        <head>
          <title>File Upload</title>
        </head>
        <body>
          <h1>File Upload</h1>
          <form action="/owner/ownerRequest/uploadFile" method="POST" enctype="multipart/form-data">

            <label for="profile_photo">Profile Photo</label>
            <input type="file" name="profile_photo" id="profile_photo"><br><br>
            
            <label for="aadhaar_front">Aadhaar Front</label>
            <input type="file" name="aadhaar_front" id="aadhaar_front"><br><br>
            
            <label for="aadhaar_back">Aadhaar Back</label>
            <input type="file" name="aadhaar_back" id="aadhaar_back"><br><br>

            <label for="pan_front">Pan Front/label>
            <input type="file" name="pan_front" id="pan_front"><br><br>

            <label for="pan_back">Pan BackM/label>
            <input type="file" name="pan_back" id="pan_back"><br><br>

            <input type="hidden" name="ownerRequestId" value="6492841473fbb01749bf5fea"><br><br>
            
            <button type="submit">Upload Files</button>
          </form>
        </body>
        </html>
        `);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Listening at port ", port);
  mongoose
    .connect(process.env.DB_SERVER)
    .then(() => {
      console.log("Connected to mongodb...");
    })
    .catch((err) => {
      console.log(err);
    });
});
