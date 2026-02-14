import multer from "multer";

const storage = multer.diskStorage({});

const uploadResource = multer({ storage });

export default uploadResource;
