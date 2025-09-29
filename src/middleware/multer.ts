import multer from "multer";

// just keep in memory or tmp, we don’t need a disk folder
const storage = multer.diskStorage({});

const upload = multer({ storage });

export default upload;
