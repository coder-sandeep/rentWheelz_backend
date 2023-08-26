const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const basePath = getBasePath(req);

    console.log(file.fieldname);

    const uploadPathByFileType = getUploadPathByFileType(
      file.fieldname,
      basePath
    );

    cb(null, uploadPathByFileType.toString());
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1]
    );
  },
});

function getBasePath(req) {
  let folderName;

  switch (req.url) {
    case "/ownerRequest/uploadFile":
    case "/owner":
      folderName = `/ownerFiles`;
      break;
    case "/user":
      folderName = `/userFiles`;
      break;
    case "/admin":
      folderName = `/adminFiles`;
    default:
      folderName = "others";
  }

  const basePath = path.join("/uploads", folderName);

  fs.mkdirSync(basePath, { recursive: true });

  return basePath;
}

function getUploadPathByFileType(fieldname, basePath) {
  let folderName;
  switch (fieldname) {
    case "profile_photo_owner":
      folderName = "profile";
      break;
    case "aadhaar_front":
    case "aadhaar_back":
      folderName = "aadhaar";
      break;
    case "pan_front":
    case "pan_back":
      folderName = "pan";
      break;
    case "vehicle_image1":
    case "vehicle_image2":
    case "vehicle_image3":
      folderName = "vehicle_images";
    default:
      folderName = "others";
  }

  const uploadPath = path.join(basePath, folderName);

  fs.mkdirSync(uploadPath, { recursive: true });

  return uploadPath;
}

const upload = multer({ storage: storage });

module.exports = {
  upload,
};
