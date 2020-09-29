const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: "./public/img",
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, callBack) => {
        const fileType = /jpeg|jpg|png|gif/;
        const extname = fileType.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileType.test(file.mimetype);

        if(extname && mimeType){
            return callBack(null, true);
        }
        else {
            callBack("Error: Image only!");
        }
    }
}).single("image");

module.exports = upload;