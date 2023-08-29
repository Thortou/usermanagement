const express = require('express');
const router = express.Router();
const controller = require('./controller');

const multer = require('multer');
const path = require('path');
// const maxSize = 2 * 1024 * 1024; 

let storage = multer.diskStorage({
    destination: function (req, file, cb) { 
        cb(null, './school/student/student-profiles/img'); 
     }, 
     filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
     }
});

let upload = multer({ 
  storage: storage,
//   limits: { fileSize: maxSize }, 
   limits: 10000
})
function errHandler(err, req, res, next) {
   if(err instanceof multer.MulterError) {
      res.json({status:'err', message:'Img too lagre'})
   }
}

router.post('/create', upload.single('StudentImage'), controller.insert);
// router.post('/create',controller.insert);
router.get('/getparent/:DistrictId/:ProvinceId/:village/:typeNoi/:typeHousTi', controller.getParent)
router.get('/', controller.findAll);
router.get('/getstudentnumber/:StudentNumber', controller.findOne_getStudentNumber);
router.get('/select', controller.findAll_new_with_old); 
router.get('/getfindone/:StudentId', controller.findOne);
// router.get('/getgradeid/:GradeId', controller.findOne);
router.get('/getstudent/:StudentId', controller.get_findOne); 
router.delete('/delete/:StudentId', controller.delet);
// router.put('/update', upload.single('StudentImage'), controller.Edit);
// router.put('/update',controller.updateData);
router.put('/update', controller.updateStudent);

module.exports = router;  