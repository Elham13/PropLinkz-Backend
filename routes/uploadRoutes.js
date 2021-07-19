import express from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import aws from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// console.log(process.env.ACCESS_KEY_ID);
const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${uuidv4()}.png`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: "proplinkz",
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(
        null,
        `${file.originalname}${uuidv4()}.${file.mimetype.split("/")[1]}`
      );
    },
  }),
});

// router.post("/single", upload.single("image"), (req, res) => {
//   // console.log(req.file);
//   const url = req.protocol + "://" + req.get("host");
//   res.status(201).send(url + "/" + req.file.path);
// });

router.post("/single", uploadS3.single("image"), (req, res) => {
  const fileName = req.file.location;
  // console.log("Body: ", req.body);
  // console.log("Files: ", req.file);
  res.status(201).send(fileName);
});

export default router;
