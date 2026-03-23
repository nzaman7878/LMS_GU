import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
  
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});


const videoFilter = (req, file, cb) => {

  const filetypes = /mp4|mov|avi|mkv|wmv|jpg|jpeg|png|webp|pdf|zip/; 
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname || mimetype) {
    return cb(null, true);
  }
  
  cb(new Error("Error: File type not supported in course creation!"));
};


const uploadVideo = multer({
  storage,
  fileFilter: videoFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, 
  },
});

export default uploadVideo;