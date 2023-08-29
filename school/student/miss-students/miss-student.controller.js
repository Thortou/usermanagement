const conn = require('../../../config/database');
const missDate = {
    Teacherroom_only: (req, res) => {
        const UserId = req.params.UserId;
        conn.query(`select a.*, b.*, c.*, d.*, e.*,e.MemberId as RmemberId, f.MemberId as StudentId,f.* from invoice_register as a inner join grade as b on a.GradeId=b.GradeId inner join school_term as c on a.TermId=c.TermId left join member_classroom as e on a.RegisterId=e.RegisterId inner join classroom as d on d.ClassroomId=e.ClassroomId left join miss_class as f on e.MemberId=f.MemberId inner join teacherroom as g on d.ClassroomId=g.ClassroomId inner join Users_has_roles as j on j.UserhRoleId=g.UserhRoleId inner join Users as aa on aa.UserId=j.UserId where aa.UserId=?`, [UserId], (err, result) => {
            if (err) throw err;
            const data = [];
            result.forEach((item) => {
                const index = data.findIndex((resultItem) => resultItem.RmemberId === item.RmemberId);
                if (index === -1) {
                    data.push(item);
                } else {
                    if (item.HourReason !== null) {
                        data[index] = item;
                    }
                }
            });
            console.log(data);
            res.json(data)
        })
    }, 
    Teacherroom_by_miss: (req, res) => {
        const {ClassroomId, Month} = req.params;
        conn.query(`select a.*, b.*, c.*, d.*, e.*,e.MemberId as RmemberId, f.MemberId as StudentId,f.* from invoice_register as a inner join grade as b on a.GradeId=b.GradeId inner join school_term as c on a.TermId=c.TermId left join member_classroom as e on a.RegisterId=e.RegisterId inner join classroom as d on d.ClassroomId=e.ClassroomId inner join miss_class as f on e.MemberId=f.MemberId inner join teacherroom as g on d.ClassroomId=g.ClassroomId inner join Users_has_roles as j on j.UserhRoleId=g.UserhRoleId inner join Users as aa on aa.UserId=j.UserId where d.ClassroomId=? and f.Month=?`, [ClassroomId, Month], (err, result) => {
            if (err) throw err;
            const data = [];
            result.forEach((item) => {
                const index = data.findIndex((resultItem) => resultItem.RmemberId === item.RmemberId);
                if (index === -1) {
                    data.push(item);
                } else {
                    if (item.HourReason !== null) {
                        data[index] = item;
                    }
                }
            });
            console.log(data);
            res.json(data)
        })
    }, 
    Teacherroom_by_missall: (req, res) => {
        conn.query(`select a.*, b.*, c.*, d.*, e.*,e.MemberId as RmemberId, f.MemberId as StudentId,f.* from invoice_register as a inner join grade as b on a.GradeId=b.GradeId inner join school_term as c on a.TermId=c.TermId inner join member_classroom as e on a.RegisterId=e.RegisterId inner join classroom as d on d.ClassroomId=e.ClassroomId inner join miss_class as f on e.MemberId=f.MemberId inner join teacherroom as g on d.ClassroomId=g.ClassroomId inner join Users_has_roles as j on j.UserhRoleId=g.UserhRoleId inner join Users as aa on aa.UserId=j.UserId order by f.MissClassId desc`, (err, result) => {
            if (err) throw err;
            const data = [];
            result.forEach((item) => {
                const index = data.findIndex((resultItem) => resultItem.RmemberId === item.RmemberId);
                if (index === -1) {
                    data.push(item);
                } else {
                    if (item.HourReason !== null) {
                        data[index] = item;
                    }
                }
            });
            console.log(data);
            res.json(data)
        })
    }, 
    insertMissDay: (req, res) => {
        const UserId = req.body.UserId;
        conn.query(`select TeacherroomId from Users as a, Users_has_roles as b, Teacherroom as c where a.UserId=b.UserId and b.UserhRoleId=c.UserhRoleId and a.UserId=${UserId}`, (err, result) => {
            if(err) throw err;
            const TeacherroomId = result[0].TeacherroomId
            const { Month, MemberId, HourNoReason, HourReason, Remark } = req.body;
            const sql = "insert into miss_class (TeacherroomId, Month, MemberId, HourNoReason, HourReason, Remark) value (?,?,?,?,?,?)";
    
            conn.query(sql, [TeacherroomId, Month, MemberId, HourNoReason, HourReason, Remark], (err, result) => {
                if (err) {
                    console.log(err)
                    res.json({ status: 500, message: 'sql error!!!' })
                } else {
    
                    res.json({ status: 200, message: "INSERT success.." })
                    const deductpoint = 5;
                    const deductpointToahour = HourNoReason * deductpoint;
                    conn.query(`update student_point set Point=Point-${deductpointToahour} where MemberId=${MemberId}`);
                    //check point
                    conn.query(
                        "select Point from student_point where MemberId in (?)",
                        [MemberId],
                        (err, result) => {
                            if (err) throw err;
                            if (result.length) {
                                //start check Point
                                const yet = result[0].Point;
                                if (yet <= 305 && yet >= 288) {
                                    conn.query(
                                        `update student_point set PointScore=9 where MemberId=${MemberId}`
                                    );
                                } else if (yet <= 288 && yet >= 270) {
                                    conn.query(
                                        `update student_point set PointScore=8 where MemberId=${MemberId}`
                                    );
                                } else if (yet <= 269 && yet >= 220) {
                                    conn.query(
                                        `update student_point set PointScore=7 where MemberId=${MemberId}`
                                    );
                                } else if (yet <= 219 && yet >= 170) {
                                    conn.query(
                                        `update student_point set PointScore=6 where MemberId=${MemberId}`
                                    );
                                } else if (yet <= 169 && yet >= 120) {
                                    conn.query(
                                        `update student_point set PointScore=5 where MemberId=${MemberId}`
                                    );
                                } else if (yet < 119) {
                                    conn.query(
                                        `update student_point set PointScore=4 where MemberId=${MemberId}`
                                    );
                                }
                                //End check point
                            }
                        }
                    );
                }
            })
        })
       
    }
}
module.exports = missDate;