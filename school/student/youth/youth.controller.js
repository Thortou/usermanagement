const conn = require('../../../config/database');

const oganization_youth = {
    create: (req, res) => {
        const MassOrgName = "Youth";
        const { StudentId, DateEntry, UserId, Remark } = req.body;

        conn.query(`select*from mass_organization where StudentId=${StudentId} and MassOrgName='Youth'`, (err, result) => {
            if (err) throw err;
            console.log(result)

            if (result.length) {
                res.json({ status: 403, message: 'Already exist...' })
            } else {
                const sql = `INSERT INTO mass_organization (StudentId, MassOrgName, DateEntry, UserId, Remark) VALUES (?,?,?,?,?)`

                //check insert into
                conn.query(sql, [StudentId, MassOrgName, DateEntry, UserId, Remark], (err, result) => {
                    if (err) {
                        // console.log(err);
                        res.json({ status: 500, message: 'errr' })
                    } else {
                        res.json({ status: 200, message: 'success...' })
                    }
                })
            }
        })

    },
    findAll: (req, res) => {
        const Youth = "Youth";
        const sql = `SELECT a.FnameLao, a.StudentImage, a.LnameLao, a.FnameEng, a.LnameEng, a.Gender, Date_format(a.Dob, \'%m/%d/%Y\') as Dob, b.*, Date_format(b.DateEntry, \'%m/%d/%Y\') as DateEntry FROM student_profile as a, mass_organization as b where a.StudentId=b.StudentId and b.MassOrgName=?`;

        //check insert into
        conn.query(sql, [Youth], (err, result) => {
            if (err) throw err;
            res.json(result)
        })
    },
    findOne: (req, res) => {
        const MassOrgId = req.params.MassOrgId;
        const sql = `SELECT a.FnameLao, a.StudentImage, a.LnameLao, a.FnameEng, a.LnameEng, a.Gender, Date_format(a.Dob, \'%m/%d/%Y\') as Dob, b.*, Date_format(b.DateEntry, \'%m/%d/%Y\') as DateEntry FROM student_profile as a, mass_organization as b where a.StudentId=b.StudentId and b.MassOrgId=?`;

        //check insert into
        conn.query(sql, [MassOrgId], (err, result) => {
            if (err) throw err;
            res.json(result[0])
        })
    },
    updated: (req, res) => {
        const { DateEntry, Remark, MassOrgId } = req.body;

        const sql = `update mass_organization set DateEntry=?, Remark=? where MassOrgId=?`;

        //check insert into
        conn.query(sql, [DateEntry, Remark, MassOrgId], (err, result) => {
            if (err) {
                console.log(err);
                res.json({ status: 500, message: 'errr' })
            } else {
                res.json({ status: 200, message: 'success...' })
            }
        })

    },
    getDataForRoom: (req, res) => {
        const Woman = "Youth";
        const ClassroomId = req.params.ClassroomId;
        const sql = `SELECT a.FnameLao, a.StudentImage, a.LnameLao, a.FnameEng, a.LnameEng, a.Gender, Date_format(a.Dob, \'%m/%d/%Y\') as Dob, b.*, Date_format(b.DateEntry, \'%m/%d/%Y\') as DateEntry FROM student_profile as a, mass_organization as b, member_classroom as c where a.StudentId=b.StudentId and b.MassOrgName=? and a.StudentId=c.StudentId and ClassroomId=?`;

        // ການສົ່ງ response ໄປຫາ Client ເພື່ອສະແດງຜົນຢູ່ໜ້າເວັບ
        conn.query(sql, [Woman, ClassroomId], (err, result) => {
            if (err) throw err;
            res.json(result)
        })
    }
}
module.exports = oganization_youth