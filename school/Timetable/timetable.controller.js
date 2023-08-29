const conn = require('../../config/database');

const timetable = {
    insert: (req, res) => {
        const { startTime, endTime } = req.body;
        const Time = startTime + " - " + endTime;
        const { SubjectId, Day, TimeName, ClassroomId, UserId, Remark } = req.body;
        const sqlInsert = "INSERT INTO timetable(SubjectId, Day, Time, TimeName, ClassroomId, UserId, Remark) VALUES (?,?,?,?,?,?,?)";

        conn.query(sqlInsert, [SubjectId, Day, Time, TimeName, ClassroomId, UserId, Remark], (err, result) => {
            if(err){
                console.log(err)
                res.json({status:500, message:'insert error!!!!'});
            }else{
                res.json({status:200, message:'insert sucess fully...'});
            }
        })
    },
    findAll: (req, res) => {
        conn.query("select a.*, b.*, c.* from timetable as a, subject as b, classroom as c where a.SubjectId=b.SubjectId and a.ClassroomId=c.ClassroomId", (err, result) => {
            if(err)throw err;
            res.json(result)
        })
    },
    findAll_Classroom_Only: (req, res) => {
        const ClassroomId = req.params.ClassroomId;
        conn.query("select a.*, b.*, c.* from timetable as a, subject as b, classroom as c where a.SubjectId=b.SubjectId and a.ClassroomId=c.ClassroomId and a.ClassroomId=?",[ClassroomId], (err, result) => {
            if(err)throw err;
            res.json(result)
        })
    },
    findOne: (req, res) => {
        const TimetableId = req.params.TimetableId;
        conn.query("select a.*, b.*, c.* from timetable as a, subject as b, classroom as c where a.SubjectId=b.SubjectId and a.ClassroomId=c.ClassroomId and TimetableId=?", [TimetableId], (err, result) => {
            if(err)throw err;
            res.json(result[0]);
        })
    },
    update: (req, res) => {
        const { startTime, endTime } = req.body;
        const Time = startTime + " - " + endTime;
        const {TimetableId, SubjectId, Day, TimeName, ClassroomId, UserId, Remark} = req.body;
        const updated = "UPDATE timetable set SubjectId=?, Day=?, Time=?, TimeName=?, ClassroomId=?, UserId=?, Remark=? where TimetableId=?";

        conn.query(updated, [SubjectId, Day, Time, TimeName, ClassroomId, UserId, Remark, TimetableId], (err, result) => {
            if(err) {
                console.log(err);
                res.json({status:500, message:'update error!!!'});
            }else{
                res.json({status:200, message: 'update success fully.....'});
            }
        })
    },
    dele : (req, res) => {
        const TimetableId = req.params.TimetableId;
        const deleted = "DELETE FROM timetable WHERE TimetableId=?";

        conn.query(deleted, [TimetableId], (err, result) => {
            if(err){
                res. json({status: 500, message:'delete error!!!!'});
            }else{
                res.json({status:200, message:'delete success....'})
            }
        })
    },
    sl_cr_gradeOnly: (req, res) => {
        const ClassroomId = req.params.ClassroomId;

        conn.query("select a.*, b.* from Grade as a, classroom as b where a.GradeId=b.GradeId and b.ClassroomId=?", [ClassroomId], (err, result) => {
            if(err)throw err;
            conn.query("select a.*,b.* from subject as a, grade as b where a.GradeId=b.GradeId and b.GradeId=?",[result[0].GradeId], (err, result) => {
                if(err)throw err;
                res.json(result);
            })
        })
    }
}
module.exports= timetable;