const conn = require('../../config/database');

const drop_school = {
    drop_school: (req, res) => {

        const { StudentId, TermId, DropDate, Reason, UserId, Remark } = req.body;
        conn.query(`select*From transfer_out where StudentId=${StudentId}`, (err, result) => {
            if (err) throw err;
            if (result.length) {
                res.json({ status: 403, message: 'ລາວນີ້ມີລາຍຊື່ຍ້າຍອອກແລ້ວ' })
            } else {
                conn.query('select*From drop_out_school where StudentId=?', [StudentId], (err, result) => {
                    if (result.length) {
                        res.json({ status: 401, message: "ອອກແຕ່ດົນແລ້ວ" })
                    } else {
                        conn.query('insert into drop_out_school (StudentId, TermId, Dropdate, Reason, UserId, Remark) values (?,?,?,?,?,?) ', [StudentId, TermId, DropDate, Reason, UserId, Remark], (err, result) => {
                            if (err) {
                                console.log(err)
                                res.json({ status: 500, message: 'sql error!!!!' })
                            } else {
                                res.json({ status: 200, message: 'success' })
                            }
                        })
                        // res.json({ status: 200, message: 'success' })
                    }
                });
            }
        })
    },
    findAll: (req, res) => {
        conn.query(`select a.FnameLao,a.LnameLao, a.Gender, b.*, Date_format(b.DropDate, \'%d/%m/%Y\') as DropDate, c.TermName from student_profile as a, drop_out_school as b, school_term as c where a.StudentId=b.StudentId and b.TermId=c.TermId and b.TermId=(select Max(TermId)from drop_out_school)`, (err, result) => {
            if (err) throw err;
            res.json(result)
        })
    },
    findAllBy_TermId: (req, res) => {
        const TermId = req.params.TermId;
        conn.query(`select a.FnameLao,a.LnameLao, a.Gender, b.*, Date_format(b.DropDate, \'%d/%m/%Y\') as DropDate, c.TermName from student_profile as a, drop_out_school as b, school_term as c where a.StudentId=b.StudentId and b.TermId=c.TermId and b.TermId=?`, [TermId], (err, result) => {
            if (err) throw err;
            res.json(result)
        })
    },
    
    // ດືງຂໍ້ມູນສະເພາະ ນັກຮຽນ ມໍໍລະນະກຳ
    findData_Death_Students: (req, res)=> {
        const TermId = req.params.TermId;
        conn.query(`select a.FnameLao,a.LnameLao, a.Gender, b.*, Date_format(b.DropDate, \'%d/%m/%Y\') as DropDate, c.TermName from student_profile as a, drop_out_school as b, school_term as c where a.StudentId=b.StudentId and b.TermId=c.TermId and b.TermId=(select Max(TermId)from drop_out_school) and b.Reason='Death'`, [TermId], (err, result) => {
            if (err) throw err;
            res.json(result)
        })
        
    },
}
module.exports = drop_school