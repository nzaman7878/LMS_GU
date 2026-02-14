import multer from "multer";

const storage = multer.diskStorage({});

const uploadVideo = multer({ storage });

export default uploadVideo;
