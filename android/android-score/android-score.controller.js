const conn = require('../../config/database');

const score = {
    // show first score
    findOne: (req, res) => {
        const UserName = req.params.UserName
        conn.query(`SELECT c.ClassroomId, d.TermId, f.GradeId FROM users a INNER JOIN student_profile b ON a.UserId = b.StudentUserId INNER JOIN member_classroom c ON b.StudentId = c.StudentId INNER JOIN invoice_register d ON c.RegisterId = d.RegisterId INNER JOIN classroom e ON c.ClassroomId = e.ClassroomId INNER JOIN grade f ON e.GradeId = f.GradeId WHERE d.GradeId = (SELECT MAX(GradeId) FROM invoice_register) AND d.TermId = (SELECT MAX(TermId) FROM invoice_register) AND a.UserName = "${UserName}" or a.Mobile = "${UserName}" or b.StudentNumber = "${UserName}";`, (err, result) => {
            if (err) throw err
            const ClassroomId = result[0].ClassroomId
            const TermId = result[0].TermId
            const GradeId = result[0].GradeId

            conn.query(`select SubjectName from subject where GradeId=${GradeId} and SubjectId in(select SubjectId from teacherhsubject where TermId=(select Max(TermId) from teacherhsubject))`, (err, resultss) => {
                if (err) throw err;
                const originaSubject = resultss.map(e => e.SubjectName);

                conn.query(`select a.MemberId,b.Fname, b.Lname, b.Gender, c.TermName, d.ClassroomName, e.*, g.* from member_classroom a LEFT JOIN invoice_register b ON a.RegisterId=b.RegisterId INNER JOIN school_term c ON b.TermId = c.TermId  LEFT JOIN classroom d ON a.ClassroomId=d.ClassroomId LEFT JOIN score_subject e ON a.MemberId=e.MemberId INNER JOIN teacherhsubject f ON e.TeacherHsubId = f.TeacherHsubId INNER JOIN subject g ON f.SubjectId = g.SubjectId where d.ClassroomId = ${ClassroomId} and  b.TermId = ${TermId} and e.Monthly = 9 order by g.SubjectId;`, (err, results) => {
                    if (err) throw err;
                    const originalData = results.map((e) => ({
                        TermName: e.TermName,
                        ClassroomName: e.ClassroomName,
                        MemberId: e.MemberId,
                        Fname: e.Fname,
                        Lname: e.Lname,
                        Gender: e.Gender,
                        Monthly: e.Monthly,
                        SubjectName: e.SubjectName,
                        Score: parseInt(e.Score),
                        Subject: originaSubject,
    
                    }));
    
                    const transformedData = originalData.reduce((acc, curr) => {
                        const { TermName, ClassroomName, MemberId, Fname, Lname, Gender, Monthly, SubjectName, Subject } = curr;
                        const { Score } = curr;
    
                        const index = acc.findIndex(item => item.MemberId === MemberId);
                        if (index === -1) {
                            acc.push({
                                TermName,
                                ClassroomName,
                                MemberId,
                                Fname,
                                Lname,
                                Gender,
                                Monthly,
                                Subject,
                                ScoreSubject: [
                                    {
                                        SubjectName,
                                        Score
                                    }
                                ],
    
                            });
                        } else {
                            acc[index].ScoreSubject.push({
                                SubjectName,
                                Score
                            });
                        }
    
                        return acc;
                    }, []);
    
                    const transformedData2 = transformedData.map(member => {
    
                        // create score in an array ສ້າງ array ເກັບຄະແນນທຸກວິຊາ
                        const scores = member.ScoreSubject.reduce((acc, subject) => {
                            const index = member.Subject.indexOf(subject.SubjectName);
                            if (index !== -1) {
                                acc[index] = subject.Score;
                            }
                            return acc;
                        }, Array(member.Subject.length).fill(0));
    
                        // total score ລວມ ຄະແນນ
                        const totals = scores.reduce((acc, score) => acc + score, 0);
    
                        // average score ສະເລ່ຍ ຄະແນນ
                        const averages = totals / scores.length
    
                        return {
                            ...member,
                            Score: scores,
                            Total: totals,
                            Average: averages
                        };
                    });
    
    
                    // this code is making for ranking of students ຈັດທີໃຫ້ນັກຮຽນ
                    const transformedData3 = transformedData2.sort((a, b) => b.Total - a.Total).map((s, i, arr) => ({
                        ...s,
                        Ranking: arr.findIndex(m => m.Total === s.Total) + 1
                    }));
    
    
                    // Result Grade of student
                    const transformedData4 = transformedData3.sort((a, b) => a.MemberId - b.MemberId).map(s => {
                        const lessThanFive = s.Score.some(score => score < 5);
                        const betweenFiveAndEight = s.Score.some(score => score >= 5 && score < 8);
                        const allBetweenEightAndTen = s.Score.every(score => score >= 8);
                        const allEqualTen = s.Score.every(score => score === 10);
    
                        let resultGrade = "";
    
                        if (lessThanFive) {
                            resultGrade = "ອ່ອນ";
                        } else if (betweenFiveAndEight) {
                            resultGrade = "ກາງ";
                        } else if (allBetweenEightAndTen) {
                            resultGrade = "ດີ";
                        } else if (allEqualTen) {
                            resultGrade = "ດີເລີດ";
                        }
                        return {
                            ...s,
                            ResultGrade: resultGrade
                        };
                    });

                    const Output = transformedData4.map(obj => {
                        const newObj = { ...obj };
                        newObj.Subject.forEach((subject, index) => {
                          newObj[`Subject${index + 1}`] = subject;
                          newObj[`Score${index + 1}`] = obj.Score[index];
                        });
                    
                        delete newObj.Score;
                        delete newObj.ScoreSubject;
                    
                        return newObj;
                      });

                    res.json(Output)
                })
            })
        })
    },

    findAll: (req, res) => {
        const { UserName, Monthly, GradeName } = req.params;

        conn.query(`SELECT c.ClassroomId, d.TermId, f.GradeId FROM users a INNER JOIN student_profile b ON a.UserId = b.StudentUserId INNER JOIN member_classroom c ON b.StudentId = c.StudentId INNER JOIN invoice_register d ON c.RegisterId = d.RegisterId INNER JOIN classroom e ON c.ClassroomId = e.ClassroomId INNER JOIN grade f ON e.GradeId = f.GradeId WHERE f.GradeName = "${GradeName}" AND a.UserName = "${UserName}" or a.Mobile = "${UserName}" or b.StudentNumber = "${UserName}";`, (err, result) => {
            if (err) throw err
            const ClassroomId = result[0].ClassroomId
            const TermId = result[0].TermId
            const GradeId = result[0].GradeId

            conn.query(`select SubjectName from subject where GradeId=${GradeId} and SubjectId in(select SubjectId from teacherhsubject where TermId=(select Max(TermId) from teacherhsubject))`, (err, resultss) => {
                if (err) throw err;
                const originaSubject = resultss.map(e => e.SubjectName);

                conn.query(`select a.MemberId,b.Fname, b.Lname, b.Gender, c.TermName, d.ClassroomName, e.*, g.* from member_classroom a LEFT JOIN invoice_register b ON a.RegisterId=b.RegisterId INNER JOIN school_term c ON b.TermId = c.TermId  LEFT JOIN classroom d ON a.ClassroomId=d.ClassroomId LEFT JOIN score_subject e ON a.MemberId=e.MemberId INNER JOIN teacherhsubject f ON e.TeacherHsubId = f.TeacherHsubId INNER JOIN subject g ON f.SubjectId = g.SubjectId where d.ClassroomId = ${ClassroomId} and  b.TermId = ${TermId} and e.Monthly = ${Monthly} order by g.SubjectId;`, (err, results) => {
                    if (err) throw err;
                    const originalData = results.map((e) => ({
                        TermName: e.TermName,
                        ClassroomName: e.ClassroomName,
                        MemberId: e.MemberId,
                        Fname: e.Fname,
                        Lname: e.Lname,
                        Gender: e.Gender,
                        Monthly: e.Monthly,
                        SubjectName: e.SubjectName,
                        Score: parseInt(e.Score),
                        Subject: originaSubject,
    
                    }));
    
                    const transformedData = originalData.reduce((acc, curr) => {
                        const { TermName, ClassroomName, MemberId, Fname, Lname, Gender, Monthly, SubjectName, Subject } = curr;
                        const { Score } = curr;
    
                        const index = acc.findIndex(item => item.MemberId === MemberId);
                        if (index === -1) {
                            acc.push({
                                TermName,
                                ClassroomName,
                                MemberId,
                                Fname,
                                Lname,
                                Gender,
                                Monthly,
                                Subject,
                                ScoreSubject: [
                                    {
                                        SubjectName,
                                        Score
                                    }
                                ],
    
                            });
                        } else {
                            acc[index].ScoreSubject.push({
                                SubjectName,
                                Score
                            });
                        }
    
                        return acc;
                    }, []);
    
                    const transformedData2 = transformedData.map(member => {
    
                        // create score in an array ສ້າງ array ເກັບຄະແນນທຸກວິຊາ
                        const scores = member.ScoreSubject.reduce((acc, subject) => {
                            const index = member.Subject.indexOf(subject.SubjectName);
                            if (index !== -1) {
                                acc[index] = subject.Score;
                            }
                            return acc;
                        }, Array(member.Subject.length).fill(0));
    
                        // total score ລວມ ຄະແນນ
                        const totals = scores.reduce((acc, score) => acc + score, 0);
    
                        // average score ສະເລ່ຍ ຄະແນນ
                        const averages = totals / scores.length
    
                        return {
                            ...member,
                            Score: scores,
                            Total: totals,
                            Average: averages
                        };
                    });
    
    
                    // this code is making for ranking of students ຈັດທີໃຫ້ນັກຮຽນ
                    const transformedData3 = transformedData2.sort((a, b) => b.Total - a.Total).map((s, i, arr) => ({
                        ...s,
                        Ranking: arr.findIndex(m => m.Total === s.Total) + 1
                    }));
    
    
                    // Result Grade of student
                    const transformedData4 = transformedData3.map(s => {
                        const lessThanFive = s.Score.some(score => score < 5);
                        const betweenFiveAndEight = s.Score.some(score => score >= 5 && score < 8);
                        const allBetweenEightAndTen = s.Score.every(score => score >= 8
                            );
                        const allEqualTen = s.Score.every(score => score === 10);
    
                        let resultGrade = "";
    
                        if (lessThanFive) {
                            resultGrade = "ອ່ອນ";
                        } else if (betweenFiveAndEight) {
                            resultGrade = "ກາງ";
                        } else if (allBetweenEightAndTen) {
                            resultGrade = "ດີ";
                        } else if (allEqualTen) {
                            resultGrade = "ດີເລີດ";
                        }
                        return {
                            ...s,
                            ResultGrade: resultGrade
                        };
                    });

                    const Output = transformedData4.map(obj => {
                        const newObj = { ...obj };
                        newObj.Subject.forEach((subject, index) => {
                          newObj[`Subject${index + 1}`] = subject;
                          newObj[`Score${index + 1}`] = obj.Score[index];
                        });
                   
                        delete newObj.Score;
                        delete newObj.ScoreSubject;
                    
                        return newObj;
                      });
                    //   console.log(Output)
                    res.json(Output)
                })
            })
        })
    },
    findGrade: (req, res) => {
        const UserName = req.params.UserName

        conn.query(`select d.ClassroomName, e.GradeId, e.GradeName from users as a inner join student_profile as b on a.UserId=b.StudentUserId inner join member_classroom as c on b.StudentId=c.StudentId inner join classroom as d on c.ClassroomId=d.ClassroomId inner join grade as e on d.GradeId=e.GradeId where a.UserName="${UserName}" or b.StudentNumber = "${UserName}" or a.Mobile = "${UserName}"`, (err, result) => {

            if (err) throw err;

            res.json(result)
// console.log(result.length)

        })
    }
}
module.exports = score;