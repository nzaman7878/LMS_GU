import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
  
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});


const resourceFilter = (req, file, cb) => {

  const filetypes = /pdf|doc|docx|zip|rar|txt|pptx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
 
  if (extname) {
    return cb(null, true);
  }
  cb(new Error("Error: Only document files (PDF, DOCX, ZIP, etc.) are allowed!"));
};


const uploadResource = multer({
  storage,
  fileFilter: resourceFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, 
  },
});

export default uploadResource;