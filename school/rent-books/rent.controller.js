const conn = require('../../config/database')

const RentBooks = {
    rentbooks: (req, res) => {
        const FullName = [req.body];
        const Gender = [req.body];
        const GradeId = [req.body];
        const TermId = [req.body];
        const Selected = [req.body];
        const Prices = [req.body];
        const UserId = [req.body];
        const Remark = [req.body];

        const fullname = FullName[0].FullName;
        const gender = Gender[0].Gender;
        const grade = GradeId[0].GradeId;
        const term = TermId[0].TermId;
        const subjects = Selected[0].Selected;
        const prices = Prices[0].Prices;
        const user = UserId[0].UserId;
        const remark = Remark[0].Remark;
        const curdate = new Date()
        // const curdate = mydate.toLocaleDateString();
        // const RentDates = new Date(curdate)
        // console.log(RentDates)
        conn.query(`select*from rentbooks`, (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                const RentNumber = ["0001"]
                const rentb = subjects.map((subject) => [
                    RentNumber,
                    fullname,
                    gender,
                    grade,
                    term,
                    subject,
                    prices,
                    curdate,
                    user,
                    remark
                ])
                conn.query(`INSERT INTO rentbooks (RentNumber, FullName, Gender, GradeId, TermId, SubjectId, Prices, RentDate, UserId, Remark)VALUES ?`, [rentb], (err, result) => {
                    if (err) throw err;
                    res.json({ status: 200, message: 'insert success' })
                })
            } else {
                conn.query(`select RentNumber from rentbooks where RentbId=(Select Max(RentbId) from rentbooks)`, (err, result) => {
                    if (err) throw err;
                    const rentnum = result[0].RentNumber;
                    const rentIn = parseInt(rentnum)
                    const RentNumbers = rentIn + 1;
                    const mynumber = RentNumbers.toString();
                    const sql = `INSERT INTO rentbooks (RentNumber, FullName, Gender, GradeId, TermId, SubjectId, Prices, RentDate, UserId, Remark)VALUES ?`;
                    if (mynumber <= 9) {
                        const RentNumber = "000" + mynumber
                        const rentb = subjects.map((subject) => [
                            RentNumber,
                            fullname,
                            gender,
                            grade,
                            term,
                            subject,
                            prices,
                            curdate,
                            user,
                            remark
                        ])
                        conn.query(sql, [rentb], (err, result) => {
                            if (err) throw err;
                            res.json({ status: 200, message: 'insert success' })
                        })
                    }
                    if (mynumber >= 10 && mynumber <= 99) {

                        const RentNumber = "00" + mynumber
                        const rentb = subjects.map((subject) => [
                            RentNumber,
                            fullname,
                            gender,
                            grade,
                            term,
                            subject,
                            prices,
                            curdate,
                            user,
                            remark
                        ])
                        conn.query(sql, [rentb], (err, result) => {
                            if (err) throw err;
                            res.json({ status: 200, message: 'insert success' })
                        })
                    }
                    if (mynumber >= 100 && mynumber <= 999) {
                        const RentNumber = "0" + mynumber
                        const rentb = subjects.map((subject) => [
                            RentNumber,
                            fullname,
                            gender,
                            grade,
                            term,
                            subject,
                            prices,
                            curdate,
                            user,
                            remark
                        ])
                        conn.query(sql, [rentb], (err, result) => {
                            if (err) throw err;
                            res.json({ status: 200, message: 'insert success' })
                        })
                    }
                    if (mynumber >= 1000) {
                        const RentNumber = mynumber
                        const rentb = subjects.map((subject) => [
                            RentNumber,
                            fullname,
                            gender,
                            grade,
                            term,
                            subject,
                            prices,
                            curdate,
                            user,
                            remark
                        ])
                        conn.query(sql, [rentb], (err, result) => {
                            if (err) throw err;
                            res.json({ status: 200, message: 'insert success' })
                        })
                    }

                })
            }
        })
    },
    findAll: (req, res) => {
        conn.query(`SELECT a.*, Date_format(a.RentDate, \'%d/%m/%Y\') as RentDate,b.GradeName, c.TermName, d.SubjectName, f.* FROM rentbooks as a, grade as b, school_term as c, subject as d, Users as e, profiles as f where a.UserId=e.UserId and e.UserId=f.UserId and a.GradeId=b.GradeId and a.TermId=c.TermId and a.SubjectId=d.SubjectId`, (err, result) => {
            if (err) throw err;
            res.json(result)
        })
    },
    findOne: (req, res) => {
        const RentbId = req.params.RentbId;
        conn.query(`SELECT a.*, Date_format(a.RentDate, \'%d/%m/%Y\') as RentDate,b.GradeName, c.TermName, d.SubjectName, f.* FROM rentbooks as a, grade as b, school_term as c, subject as d, Users as e, profiles as f where a.UserId=e.UserId and e.UserId=f.UserId and a.GradeId=b.GradeId and a.TermId=c.TermId and a.SubjectId=d.SubjectId and a.RentbId=${RentbId}`, (err, result) => {
            if (err) throw err;
            res.json(result[0])
        })
    },
    findOne_RentNumber: (req, res) => {
        const RentNumber = req.params.RentNumber;
        conn.query(`SELECT a.*, Date_format(a.RentDate, \'%d/%m/%Y\') as RentDate,b.GradeName, c.TermName, d.SubjectName, f.* FROM rentbooks as a, grade as b, school_term as c, subject as d, Users as e, profiles as f where a.UserId=e.UserId and e.UserId=f.UserId and a.GradeId=b.GradeId and a.TermId=c.TermId and a.SubjectId=d.SubjectId and a.RentNumber=${RentNumber}`, (err, result) => {
            if (err) throw err;
            res.json(result)  
        }) 
    },
    findOne_by_maxId: (req, res) => {
        conn.query(`SELECT a.*, Date_format(a.RentDate, \'%d/%m/%Y\') as RentDate,b.GradeName, c.TermName, d.SubjectName, f.* FROM rentbooks as a, grade as b, school_term as c, subject as d, Users as e, profiles as f where a.UserId=e.UserId and e.UserId=f.UserId and a.GradeId=b.GradeId and a.TermId=c.TermId and a.SubjectId=d.SubjectId and a.RentNumber=(select Max(RentNumber) from rentbooks)`, (err, result) => {
            if (err) throw err;
            res.json(result)
        })
    },
    findall_by_gradeId: (req, res) => {
        const GradeId = req.params.GradeId;
        conn.query(`SELECT a.*, Date_format(a.RentDate, \'%d/%m/%Y\') as RentDate,b.GradeName, c.TermName, d.SubjectName, f.* FROM rentbooks as a, grade as b, school_term as c, subject as d, Users as e, profiles as f where a.UserId=e.UserId and e.UserId=f.UserId and a.GradeId=b.GradeId and a.TermId=c.TermId and a.SubjectId=d.SubjectId and a.GradeId=${GradeId}`, (err, result) => { 
            if (err) throw err;
            res.json(result)
        })
    },
    total_money: (req, res) => {
        conn.query(`SELECT sum(Prices) as Prices FROM rentbooks `, (err, result) => {
            if (err) throw err;
            res.json(result[0])
        })
    },
    deleted: (req, res) => {
        const RentNumber = req.params.RentNumber;
        conn.query(`delete FROM rentbooks where RentNumber=${RentNumber}`, (err, result) => {
            if (err) throw err;
            
            res.json({status: 200, message: "ສົ່ງປີ້ມສຳເລັດ"})
        })
    },
    updated: (req, res) => {

    }
}
module.exports = RentBooks