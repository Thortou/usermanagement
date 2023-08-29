const conn = require('../../../config/database');

const move_out = {
    move_out: (req, res) => {
        const { StudentId, TermId, NextSchoolName, Village, DistrictId, ProvinceId, OutDate, UserId, Remark } = req.body;
        conn.query(`select*From transfer_out where StudentId=${StudentId}`, (err, result) => {
            if (err) throw err;
            if (result.length) {
                res.json({ status: 403, message: 'already exist...' })
            } else {
                conn.query("insert into transfer_out (StudentId, TermId, NextSchoolName, Village, DistrictId, ProvinceId, OutDate, UserId, Remark) values (?,?,?,?,?,?,?,?,?) ", [StudentId, TermId, NextSchoolName, Village, DistrictId, ProvinceId, OutDate, UserId,Remark], (err, result) => {
                    if (err) {
                        console.log(err)
                        res.json({ status: 500, message: 'sql error!!!' })
                    } else {
                        res.json({ status: 200, message: 'insert success...' })
                    }
                })
            }
        })

    },
    findAll: (req, res) => {
        conn.query(`select a.FnameLao, a.LnameLao, a.Gender, b.*, Date_format(b.OutDate,\'%d/%m/%Y\') as OutDate, c.TermName, d.ProvinceName,e.DistrictName from student_profile as a, transfer_out as b, school_term as c, provinces as d, districts as e where a.StudentId=b.StudentId and b.TermId=c.TermId and b.ProvinceId=d.ProvinceId and b.DistrictId=e.DistrictId;`, (err, result) => {
            if(err) throw err;
            res.json(result)
        })
    }
}
module.exports = move_out;