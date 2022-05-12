const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
      cb(null, './uploads/')
    },
    filename: (req, file, cb)=>{
        // console.log(req.file.originalname);
        cb(null, `${file.originalname}`);
      },
})

module.exports = {
    storage: storage
};