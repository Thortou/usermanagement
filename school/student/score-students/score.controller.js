const { json } = require("express");
const conn = require("../../../config/database");

const score = {
  findData: (req, res) => {
    const MemberId = req.params.MemberId;
    conn.query(
      `SELECT a.*,b.*,c.*,d.* FROM  member_classroom as a, invoice_register as b, classroom as c, student_point as d where a.MemberId=d.MemberId and a.RegisterId=b.RegisterId and a.ClassroomId=c.ClassroomId and a.MemberId=${MemberId}`,
      (err, result) => {
        if (err) throw err;
        res.json(result[0]);
      }
    );
  },
  create: (req, res) => {
    conn.query("set foreign_key_checks=0");
    const { MemberId, TeacherHsubId, MonthId, Score } = req.body;


    // chect already exist... 

    conn.query(`SELECT * FROM score_subject WHERE MemberId = ${MemberId} AND TeacherHsubId = ${TeacherHsubId} AND Monthly = ${MonthId}`, (err, result) => {
      if (err) throw err;
      if (result.length) {
        //   res.json({ status: 403, message: 'already' });
        // console.log(result[0].Monthly)
        conn.query(`UPDATE score_subject SET Score = ${Score} WHERE MemberId=${MemberId} AND TeacherHsubId = ${TeacherHsubId} AND Monthly = ?`, [MonthId], (err, result) => {
          if (err) {
            console.log(err);
            res.json({ status: 500, message: "sql err" });
          } else {
            res.json({ status: 200, message: "update..." });
          }
        })
      } else {
        const sql = `INSERT INTO score_subject (MemberId, TeacherHsubId, Monthly, Score ) VALUES (${MemberId}, ${TeacherHsubId}, ${MonthId}, ${Score})`;

        conn.query(sql, (err, result) => {
          if (err) {
            console.log(err);
            res.json({ status: 500, message: "sql err" });
          } else {
            res.json({ status: 200, message: "success..." });
          }
        });
      }
    });



  },
  findDateByclassroomId: (req, res) => {
    // const UserId = req.params.UserId;
    const { TeacherHsubId } = req.params;

    const checkTeacherHsubId = parseInt(TeacherHsubId)

    // const sql_query = `select c.TeacherHsubId from users as a, users_has_roles as b,teacherhsubject as c where a.UserId=b.UserId and b.UserhRoleId = c.UserhRoleId and a.UserId = ${UserId} and c.ClassroomId=${ClassroomId} and c.TermId = (select max(TermId) from teacherhsubject) group by c.TeacherHsubId`
    const sqlQuery = `select a.ClassroomId, a.SubjectId, c.SubjectName from teacherhsubject as a INNER JOIN classroom as b ON a.ClassroomId = b.ClassroomId INNER JOIN subject as c ON a.SubjectId= c.SubjectId WHERE a.TeacherHsubId = ${TeacherHsubId} and a.TermId = (select max(TermId) from teacherhsubject)`
    conn.query(sqlQuery, (err, result) => {
      if (err) throw err;

      const ClassroomId = result[0].ClassroomId
      const SubjectId = result[0].SubjectId
      const SubjectName = result[0].SubjectName

      // console.log(typeof(checkTeacherHsubId))

      conn.query(
        `select a.MemberId,b.Fname,b.Lname,b.Gender,d.*,c.TeacherHsubId,c.Monthly, c.Score from member_classroom a LEFT JOIN invoice_register b ON a.RegisterId = b.RegisterId LEFT JOIN classroom d ON a.ClassroomId = d.ClassroomId LEFT JOIN score_subject c ON a.MemberId = c.MemberId where a.ClassroomId = ${ClassroomId} and b.TermId=(select max(TermId) from invoice_register)`,
        (err, results) => {
          if (err) throw err;
          const data = results.map((user) => ({
            MemberId: user.MemberId,
            TeacherHsubId: user.TeacherHsubId,
            Fname: user.Fname,
            Lname: user.Lname,
            Gender: user.Gender,
            ClassroomName: user.ClassroomName,
            SubjectId: SubjectId,
            SubjectName: SubjectName,
            Monthly: user.Monthly,
            Score: user.Score,

          }));

          const groupedData = data.reduce((acc, curr) => {
            const memberId = curr.MemberId;
            if (!acc[memberId]) {
              acc[memberId] = {
                MemberId: memberId,
                Fname: curr.Fname,
                Lname: curr.Lname,
                Gender: curr.Gender,
                ClassroomName: curr.ClassroomName,
                SubjectId: SubjectId,
                SubjectName: SubjectName,
                MonthlyScore: {}
              };
            }
            if (curr.TeacherHsubId === checkTeacherHsubId) {
              const monthlyScore = acc[memberId].MonthlyScore;
              if (curr.Monthly && curr.Score) {
                monthlyScore[curr.Monthly] = curr.Score;
              }
            }
            return acc;
          }, {});

          // Convert grouped data back to array
          const myScore = Object.values(groupedData);

          res.json(myScore);
        }
      );

    })

  },
  findDateByclassroomId_and_memberId: (req, res) => {
    // const UserId = req.params.UserId;
    const { ClassroomId, UserId, MemberId } = req.params;

    conn.query(`select c.TeacherHsubId from users as a, users_has_roles as b,teacherhsubject as c where a.UserId=b.UserId and b.UserhRoleId = c.UserhRoleId and a.UserId = ${UserId} and c.ClassroomId=${ClassroomId} and c.TermId = (select max(TermId) from teacherhsubject) group by c.TeacherHsubId`, (err, result) => {
      if (err) throw err;

      const checkTeacherHsubId = result[0].TeacherHsubId
      // console.log(checkTeacherHsubId)
      conn.query(
        `select a.MemberId,b.Fname,b.Lname,b.Gender,d.*,c.TeacherHsubId,c.Monthly, c.Score from member_classroom a LEFT JOIN invoice_register b ON a.RegisterId = b.RegisterId LEFT JOIN classroom d ON a.ClassroomId = d.ClassroomId LEFT JOIN score_subject c ON a.MemberId = c.MemberId where a.ClassroomId = ${ClassroomId} and c.TeacherHsubId=${checkTeacherHsubId} and c.MemberId=${MemberId} and b.TermId=(select max(TermId) from invoice_register)`,
        (err, results) => {
          if (err) throw err;
          const data = results.map((user) => ({
            MemberId: user.MemberId,
            TeacherHsubId: user.TeacherHsubId,
            Fname: user.Fname,
            Lname: user.Lname,
            Gender: user.Gender,
            ClassroomName: user.ClassroomName,
            Monthly: user.Monthly,
            Score: user.Score,

          }));
          const groupedData = data.reduce((acc, curr) => {
            const memberId = curr.MemberId;
            if (!acc[memberId]) {
              acc[memberId] = {
                MemberId: memberId,
                Fname: curr.Fname,
                Lname: curr.Lname,
                Gender: curr.Gender,
                ClassroomName: curr.ClassroomName,
                MonthlyScore: {}
              };
            }
            if (curr.TeacherHsubId === checkTeacherHsubId) {
              const monthlyScore = acc[memberId].MonthlyScore;
              if (curr.Monthly && curr.Score) {
                monthlyScore[curr.Monthly] = curr.Score;
              }
            }
            return acc;
          }, {});

          // Convert grouped data back to array
          const myScore = Object.values(groupedData);

          // console.log(data); 

          res.json(myScore);
        }
      );

    })

  },

  findScore: (req, res) => {

    const Monthly = req.params.Monthly;

    if (Monthly === "1") {
      const sql_subject = `select SubjectName from subject inner join grade on subject.GradeId = grade.GradeId where grade.GradeName = "7"  and SubjectId in(select SubjectId from teacherhsubject where TermId=(select Max(TermId) from teacherhsubject))`
      conn.query(sql_subject, (err, result) => {
        if (err) throw err;
        const sql = `select a.MemberId,b.Fname, b.Lname, b.Gender, c.TermName, d.ClassroomName, e.*, g.* from member_classroom a LEFT JOIN invoice_register b ON a.RegisterId=b.RegisterId INNER JOIN school_term c ON b.TermId = c.TermId  LEFT JOIN classroom d ON a.ClassroomId=d.ClassroomId LEFT JOIN score_subject e ON a.MemberId=e.MemberId INNER JOIN teacherhsubject f ON e.TeacherHsubId = f.TeacherHsubId INNER JOIN subject g ON f.SubjectId = g.SubjectId where d.ClassroomName = '1/1' and  b.TermId = (select Max(TermId) from invoice_register) and e.Monthly in (9,10,11,12,1) order by g.SubjectId`

        const originaSubject = result.map(e => e.SubjectName);

        conn.query(sql, (err, results) => {
          if (err) throw err;
          const originalData = results.map((e) => ({
            TermName: e.TermName,
            ClassroomName: e.ClassroomName,
            MemberId: e.MemberId,
            Fname: e.Fname,
            Lname: e.Lname,
            Gender: e.Gender,
            SubjectName: e.SubjectName,
            Monthly: e.Monthly,
            Score: parseInt(e.Score),
            Subject: originaSubject,

          }));

          const transformedScore1 = originalData.reduce((acc, curr) => {
            const { TermName, ClassroomName, MemberId, Fname, Lname, Gender, Subject } = curr;
            const { SubjectName, Score, Monthly } = curr;

            const index = acc.findIndex(item => item.MemberId === MemberId);
            if (index === -1) {
              acc.push({
                TermName,
                ClassroomName,
                MemberId,
                Fname,
                Lname,
                Gender,
                Subject,
                ScoreSubject: [
                  {
                    SubjectName,
                    Score,
                    Monthly
                  }
                ],

              });
            } else {
              acc[index].ScoreSubject.push({
                SubjectName,
                Score,
                Monthly
              });
            }

            return acc;
          }, []);

          const transformedScore2 = transformedScore1.map(student => {
            const subjectNames = Array.from(new Set(student.ScoreSubject.map(sub => sub.SubjectName)));

            const scoreSubject = subjectNames.map(subject => {

              // ສະແດງຂໍ້ມູນຄະແນນ ສະເພາະ ຄະແນນປະຈຳເດືອນ 9, 10, 11, 12
              const subjectScores = student.ScoreSubject.filter(sub => sub.SubjectName === subject && sub.Score !== null && [9, 10, 11, 12].includes(sub.Monthly));

              // ສະແດງຂໍ້ມູນຄະແນນ ສະເພາະ ຄະແນນສອບເສັງ
              const subjectScoreExam = student.ScoreSubject.filter(sub => sub.SubjectName === subject && sub.Score !== null && [1].includes(sub.Monthly));
              const totalScoreMonthly = subjectScores.reduce((total, sub) => total + sub.Score, 0); // ລວມຄະແນນປະຈຳເດືອນ 9, 10, 11, 12
              const scoreExam = subjectScoreExam.length > 0 ? subjectScoreExam[0].Score : 0;     // ຄະແນນສອບເສັງ
              const averageScoreMonthly = totalScoreMonthly / 4       // ສະເລ່ຍຄະແນນປະຈຳເດືອນ 9, 10, 11, 12
              const scoreTermI = (averageScoreMonthly + scoreExam) / 2   // ຄະແນນ ພາກຮຽນ I

              return { SubjectName: subject, TotalScoreMonthly: totalScoreMonthly, AverageScoreMonthly: averageScoreMonthly, ScoreExam: scoreExam, ScoreTermI: scoreTermI };
            });
            return { TermName: student.TermName, ClassroomName: student.ClassroomName, MemberId: student.MemberId, Fname: student.Fname, Lname: student.Lname, Gender: student.Gender, ScoreSubject: scoreSubject, Subject: student.Subject };
          });

          const transformedScore3 = transformedScore2.map(member => {

            // create score in an array ສ້າງ array ເກັບຄະແນນທຸກວິຊາ ພາກຮຽນ I
            const scores = member.ScoreSubject.reduce((acc, subject) => {
              const index = member.Subject.indexOf(subject.SubjectName);
              if (index !== -1) {
                acc[index] = subject.ScoreTermI;
              }
              return acc;
            }, Array(member.Subject.length).fill(0));

            // total score ລວມ ຄະແນນ ພາກຮຽນ I
            const totals = scores.reduce((acc, score) => acc + score, 0);

            // average score ສະເລ່ຍ ຄະແນນ ພາກຮຽນ I
            const averages = totals / scores.length

            return {
              ...member,
              Score: scores,
              Total: totals,
              Average: averages
            };
          });

          // this code is making for ranking of students ຈັດທີໃຫ້ນັກຮຽນ
          const transformedScore4 = transformedScore3.sort((a, b) => b.Total - a.Total).map((s, i, arr) => ({
            ...s,
            Ranking: arr.findIndex(m => m.Total === s.Total) + 1
          }));


          // Result Grade of student
          const Output = transformedScore4.sort((a, b) => a.MemberId - b.MemberId).map(s => {
            const lessThanFive = s.Score.filter(score => score < 5);
            const betweenFiveAndTen = s.Score.every(score => score >= 5);
            let countSubjectFail = lessThanFive.length;

            let resultGrade = "";

            if (lessThanFive.length >= 3) {
              resultGrade = "ຕົກ";
            } else if (lessThanFive.length < 3 && lessThanFive.length > 0) {
              resultGrade = "ໄດ້ອະນຸໂລມ";
            } else if (betweenFiveAndTen) {
              resultGrade = "ໄດ້";
            }
            return {
              ...s,
              CountSubjectFail: countSubjectFail,
              ResultGrade: resultGrade
            };
          });


          res.json(Output)
        })

      })

    }
    else {
      const sql_subject = `select SubjectName from subject inner join grade on subject.GradeId = grade.GradeId where grade.GradeName = "7" and SubjectId in(select SubjectId from teacherhsubject where TermId=(select Max(TermId) from teacherhsubject))`
      conn.query(sql_subject, (err, result) => {
        if (err) throw err;

        const sql = `select a.MemberId,b.Fname, b.Lname, b.Gender, c.TermName, d.ClassroomName, e.*, g.* from member_classroom a LEFT JOIN invoice_register b ON a.RegisterId=b.RegisterId INNER JOIN school_term c ON b.TermId = c.TermId  LEFT JOIN classroom d ON a.ClassroomId=d.ClassroomId LEFT JOIN score_subject e ON a.MemberId=e.MemberId INNER JOIN teacherhsubject f ON e.TeacherHsubId = f.TeacherHsubId INNER JOIN subject g ON f.SubjectId = g.SubjectId where d.ClassroomName = '1/1' and  b.TermId = (select Max(TermId) from invoice_register) and e.Monthly = ${Monthly} order by g.SubjectId`

        const originaSubject = result.map(e => e.SubjectName);

        conn.query(sql, (err, results) => {
          if (err) throw err;
          const originalData = results.map((e) => ({
            TermName: e.TermName,
            ClassroomName: e.ClassroomName,
            MemberId: e.MemberId,
            Fname: e.Fname,
            Lname: e.Lname,
            Gender: e.Gender,
            SubjectName: e.SubjectName,
            Score: parseInt(e.Score),
            Subject: originaSubject,

          }));

          const transformedData = originalData.reduce((acc, curr) => {
            const { TermName, ClassroomName, MemberId, Fname, Lname, Gender, SubjectName, Subject } = curr;
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
          const Output = transformedData3.sort((a, b) => a.MemberId - b.MemberId).map(s => {
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

          // console.log(originalData)
          res.json(Output)
        })

      })
    }

  },

  findScore_termid: (req, res) => {

    const Monthly = req.params.Monthly;
    const TermId = req.params.TermId;
    const ClassroomId = req.params.ClassroomId;

    if (Monthly === "1") {
      conn.query(`select GradeId from classroom where ClassroomId=${ClassroomId}`, (err, results) => {
        if (err) throw err;
        const gradeid = results[0].GradeId;
        const sql_subject = `select SubjectName from subject where GradeId=${gradeid} and SubjectId in(select SubjectId from teacherhsubject where TermId=(select Max(TermId) from teacherhsubject))`
        conn.query(sql_subject, (err, result) => {
          if (err) throw err;

          const sql = `select a.MemberId,b.Fname, b.Lname, b.Gender, c.TermName, d.ClassroomName, e.*, g.* from member_classroom a LEFT JOIN invoice_register b ON a.RegisterId=b.RegisterId INNER JOIN school_term c ON b.TermId = c.TermId  LEFT JOIN classroom d ON a.ClassroomId=d.ClassroomId LEFT JOIN score_subject e ON a.MemberId=e.MemberId INNER JOIN teacherhsubject f ON e.TeacherHsubId = f.TeacherHsubId INNER JOIN subject g ON f.SubjectId = g.SubjectId where d.ClassroomId = ${ClassroomId} and  b.TermId = ${TermId} and e.Monthly in (9,10,11,12,1) order by g.SubjectId`

          const originaSubject = result.map(e => e.SubjectName);

          conn.query(sql, (err, results) => {
            if (err) throw err;
            const originalData = results.map((e) => ({
              TermName: e.TermName,
              ClassroomName: e.ClassroomName,
              MemberId: e.MemberId,
              Fname: e.Fname,
              Lname: e.Lname,
              Gender: e.Gender,
              SubjectName: e.SubjectName,
              Monthly: e.Monthly,
              Score: parseInt(e.Score),
              Subject: originaSubject,

            }));

            const transformedScore1 = originalData.reduce((acc, curr) => {
              const { TermName, ClassroomName, MemberId, Fname, Lname, Gender, Subject } = curr;
              const { SubjectName, Score, Monthly } = curr;

              const index = acc.findIndex(item => item.MemberId === MemberId);
              if (index === -1) {
                acc.push({
                  TermName,
                  ClassroomName,
                  MemberId,
                  Fname,
                  Lname,
                  Gender,
                  Subject,
                  ScoreSubject: [
                    {
                      SubjectName,
                      Score,
                      Monthly
                    }
                  ],

                });
              } else {
                acc[index].ScoreSubject.push({
                  SubjectName,
                  Score,
                  Monthly
                });
              }

              return acc;
            }, []);

            const transformedScore2 = transformedScore1.map(student => {
              const subjectNames = Array.from(new Set(student.ScoreSubject.map(sub => sub.SubjectName)));

              const scoreSubject = subjectNames.map(subject => {

                // ສະແດງຂໍ້ມູນຄະແນນ ສະເພາະ ຄະແນນປະຈຳເດືອນ 9, 10, 11, 12
                const subjectScores = student.ScoreSubject.filter(sub => sub.SubjectName === subject && sub.Score !== null && [9, 10, 11, 12].includes(sub.Monthly));

                // ສະແດງຂໍ້ມູນຄະແນນ ສະເພາະ ຄະແນນສອບເສັງ
                const subjectScoreExam = student.ScoreSubject.filter(sub => sub.SubjectName === subject && sub.Score !== null && [1].includes(sub.Monthly));
                const totalScoreMonthly = subjectScores.reduce((total, sub) => total + sub.Score, 0); // ລວມຄະແນນປະຈຳເດືອນ 9, 10, 11, 12
                const scoreExam = subjectScoreExam.length > 0 ? subjectScoreExam[0].Score : 0;     // ຄະແນນສອບເສັງ
                const averageScoreMonthly = totalScoreMonthly / 4       // ສະເລ່ຍຄະແນນປະຈຳເດືອນ 9, 10, 11, 12
                const scoreTermI = (averageScoreMonthly + scoreExam) / 2   // ຄະແນນ ພາກຮຽນ I

                return { SubjectName: subject, TotalScoreMonthly: totalScoreMonthly, AverageScoreMonthly: averageScoreMonthly, ScoreExam: scoreExam, ScoreTermI: scoreTermI };
              });
              return { TermName: student.TermName, ClassroomName: student.ClassroomName, MemberId: student.MemberId, Fname: student.Fname, Lname: student.Lname, Gender: student.Gender, ScoreSubject: scoreSubject, Subject: student.Subject };
            });

            const transformedScore3 = transformedScore2.map(member => {

              // create score in an array ສ້າງ array ເກັບຄະແນນທຸກວິຊາ ພາກຮຽນ I
              const scores = member.ScoreSubject.reduce((acc, subject) => {
                const index = member.Subject.indexOf(subject.SubjectName);
                if (index !== -1) {
                  acc[index] = subject.ScoreTermI;
                }
                return acc;
              }, Array(member.Subject.length).fill(0));

              // total score ລວມ ຄະແນນ ພາກຮຽນ I
              const totals = scores.reduce((acc, score) => acc + score, 0);

              // average score ສະເລ່ຍ ຄະແນນ ພາກຮຽນ I
              const averages = totals / scores.length

              return {
                ...member,
                Score: scores,
                Total: totals,
                Average: averages
              };
            });

            // this code is making for ranking of students ຈັດທີໃຫ້ນັກຮຽນ
            const transformedScore4 = transformedScore3.sort((a, b) => b.Total - a.Total).map((s, i, arr) => ({
              ...s,
              Ranking: arr.findIndex(m => m.Total === s.Total) + 1
            }));


            // Result Grade of student
            const Output = transformedScore4.sort((a, b) => a.MemberId - b.MemberId).map(s => {
              const lessThanFive = s.Score.filter(score => score < 5);
              const betweenFiveAndTen = s.Score.every(score => score >= 5);
              let countSubjectFail = lessThanFive.length;

              let resultGrade = "";

              if (lessThanFive.length >= 3) {
                resultGrade = "ຕົກ";
              } else if (lessThanFive.length < 3 && lessThanFive.length > 0) {
                resultGrade = "ໄດ້ອະນຸໂລມ";
              } else if (betweenFiveAndTen) {
                resultGrade = "ໄດ້";
              }
              return {
                ...s,
                CountSubjectFail: countSubjectFail,
                ResultGrade: resultGrade
              };
            });
            res.json(Output)
          })

        })
      })

    } else if (Monthly === "6") {
      const sqlClassroom = "SELECT a.GradeId, b.GradeName FROM classroom as a INNER JOIN grade as b ON a.GradeId = b.GradeId WHERE ClassroomId = ?"
      conn.query(sqlClassroom, [ClassroomId], (err, resultClassroom) => {
        if (err) throw err;

        const gradeId = resultClassroom[0].GradeId
        const gradeName = resultClassroom[0].GradeName

        const sqlSubject = `SELECT SubjectName FROM subject WHERE GradeId = ${gradeId} AND SubjectId IN (SELECT SubjectId FROM teacherhsubject WHERE TermId = (SELECT Max(TermId) FROM teacherhsubject))`
        conn.query(sqlSubject, (err, resultSubject) => {
          if (err) throw err

          const originaSubject = resultSubject.map(e => e.SubjectName);

          if (gradeName === "4" || gradeName === "7") {

            const sqlMemberScore = `SELECT a.MemberId,b.Fname, b.Lname, b.Gender, c.TermName, d.ClassroomName, h.GradeName, e.*, g.* FROM member_classroom a LEFT JOIN invoice_register b ON a.RegisterId=b.RegisterId INNER JOIN school_term c ON b.TermId = c.TermId  LEFT JOIN classroom d ON a.ClassroomId=d.ClassroomId LEFT JOIN score_subject e ON a.MemberId=e.MemberId INNER JOIN teacherhsubject f ON e.TeacherHsubId = f.TeacherHsubId INNER JOIN subject g ON f.SubjectId = g.SubjectId INNER JOIN grade h ON d.GradeId = h.GradeId  WHERE d.ClassroomId = ${ClassroomId} and  b.TermId = ${TermId} and e.Monthly = ${Monthly} ORDER BY g.SubjectId`
            conn.query(sqlMemberScore, (err, resultMemberScore) => {
              if (err) throw err
       
              if (resultMemberScore.length) {
                const originalData = resultMemberScore.map((e) => ({
                  TermName: e.TermName,
                  GradeName: e.GradeName,
                  ClassroomName: e.ClassroomName,
                  MemberId: e.MemberId,
                  Fname: e.Fname,
                  Lname: e.Lname,
                  Gender: e.Gender,
                  SubjectName: e.SubjectName,
                  Monthly: e.Monthly,
                  Score: parseInt(e.Score),
                  Subject: originaSubject,

                }));
                // for check grade 4 and 7 

                const transformedScore1 = originalData.reduce((acc, curr) => {
                  const { TermName, GradeName, ClassroomName, MemberId, Fname, Lname, Gender, Subject } = curr;
                  const { SubjectName, Score, Monthly } = curr;

                  const index = acc.findIndex(item => item.MemberId === MemberId);
                  if (index === -1) {
                    acc.push({
                      TermName,
                      GradeName,
                      ClassroomName,
                      MemberId,
                      Fname,
                      Lname,
                      Gender,
                      Subject,
                      ScoreSubject: [
                        {
                          SubjectName,
                          Score,
                          Monthly
                        }
                      ],

                    });
                  } else {
                    acc[index].ScoreSubject.push({
                      SubjectName,
                      Score,
                      Monthly
                    });
                  }

                  return acc;
                }, []);

                //Start: Score TermII for Grade 4 and 7
                const Output4And7 = transformedScore1.map(member => {

                  // create score in an array ສ້າງ array ເກັບຄະແນນທຸກວິຊາ ພາກຮຽນ I
                  const scores = member.ScoreSubject.reduce((acc, subject) => {
                    const index = member.Subject.indexOf(subject.SubjectName);
                    if (index !== -1) {
                      acc[index] = subject.Score;
                    }
                    return acc;
                  }, Array(member.Subject.length).fill(0));

                  return {
                    ...member,
                    Score: scores
                  };

                });
                //End: Score TermII for Grade 4 and 7

                const checkGradeName = Output4And7[0].GradeName

                if (checkGradeName === "4") {
                  res.json(Output4And7)
          
                } else if (checkGradeName === "7") {
                  res.json(Output4And7)
            
                }
              }
              else{
                res.json(resultMemberScore)
              }
            })
          } else {
            const newSqlMemberScore = `SELECT a.MemberId,b.Fname, b.Lname, b.Gender, c.TermName, d.ClassroomName, h.GradeName, e.*, g.* FROM member_classroom a LEFT JOIN invoice_register b ON a.RegisterId=b.RegisterId INNER JOIN school_term c ON b.TermId = c.TermId  LEFT JOIN classroom d ON a.ClassroomId=d.ClassroomId LEFT JOIN score_subject e ON a.MemberId=e.MemberId INNER JOIN teacherhsubject f ON e.TeacherHsubId = f.TeacherHsubId INNER JOIN subject g ON f.SubjectId = g.SubjectId INNER JOIN grade h ON d.GradeId = h.GradeId  WHERE d.ClassroomId = ${ClassroomId} and  b.TermId = ${TermId} and e.Monthly IN (9,10,11,12,1,2,3,4,5,6) ORDER BY g.SubjectId`
            conn.query(newSqlMemberScore, (err, newResultMemberScore) => {
              if (err) throw err

              const newOriginalData = newResultMemberScore.map((e) => ({
                TermName: e.TermName,
                GradeName: e.GradeName,
                ClassroomName: e.ClassroomName,
                MemberId: e.MemberId,
                Fname: e.Fname,
                Lname: e.Lname,
                Gender: e.Gender,
                SubjectName: e.SubjectName,
                Monthly: e.Monthly,
                Score: parseInt(e.Score),
                Subject: originaSubject,
              }))
              const newTransformedScore1 = newOriginalData.reduce((acc, curr) => {
                const { TermName, GradeName, ClassroomName, MemberId, Fname, Lname, Gender, Subject } = curr;
                const { SubjectName, Score, Monthly } = curr;

                const index = acc.findIndex(item => item.MemberId === MemberId);
                if (index === -1) {
                  acc.push({
                    TermName,
                    GradeName,
                    ClassroomName,
                    MemberId,
                    Fname,
                    Lname,
                    Gender,
                    Subject,
                    ScoreSubject: [
                      {
                        SubjectName,
                        Score,
                        Monthly
                      }
                    ],

                  });
                } else {
                  acc[index].ScoreSubject.push({
                    SubjectName,
                    Score,
                    Monthly
                  });
                }

                return acc;
              }, []);

              // Score TermII for Grade 1, 2, 3, 5, 6
              const newTransformedScore2 = newTransformedScore1.map(student => {
                const subjectNames = Array.from(new Set(student.ScoreSubject.map(sub => sub.SubjectName)));

                const scoreSubject = subjectNames.map(subject => {

                  // ສະແດງຂໍ້ມູນຄະແນນ ສະເພາະ ຄະແນນປະຈຳເດືອນ 9, 10, 11, 12
                  const subjectScoresTermI = student.ScoreSubject.filter(sub => sub.SubjectName === subject && sub.Score !== null && [9, 10, 11, 12].includes(sub.Monthly));

                  // ສະແດງຂໍ້ມູນຄະແນນ ສະເພາະ ຄະແນນສອບເສັງພາກຮຽນ 1
                  const subjectScoreExamTermI = student.ScoreSubject.filter(sub => sub.SubjectName === subject && sub.Score !== null && [1].includes(sub.Monthly));

                  // ລວມຄະແນນປະຈຳເດືອນ 9, 10, 11, 12
                  const totalScoreMonthlyTermI = subjectScoresTermI.reduce((total, sub) => total + sub.Score, 0);

                  // ຄະແນນສອບເສັງ ພາກຮຽນ 1
                  const scoreExamTermI = subjectScoreExamTermI.length > 0 ? subjectScoreExamTermI[0].Score : 0;

                  const averageScoreMonthlyTermI = totalScoreMonthlyTermI / 4       // ສະເລ່ຍຄະແນນປະຈຳເດືອນ 9, 10, 11, 12

                  // ຄະແນນ ພາກຮຽນ I
                  const scoreTermI = (averageScoreMonthlyTermI + scoreExamTermI) / 2


                  // ສະແດງຂໍ້ມູນຄະແນນ ສະເພາະ ຄະແນນປະຈຳເດືອນ 2, 3, 4, 5
                  const subjectScoresTermII = student.ScoreSubject.filter(sub => sub.SubjectName === subject && sub.Score !== null && [2, 3, 4, 5].includes(sub.Monthly));

                  // ສະແດງຂໍ້ມູນຄະແນນ ສະເພາະ ຄະແນນສອບເສັງພາກຮຽນ 2
                  const subjectScoreExamTermII = student.ScoreSubject.filter(sub => sub.SubjectName === subject && sub.Score !== null && [6].includes(sub.Monthly));

                  // ລວມຄະແນນປະຈຳເດືອນ 2, 3, 4, 4
                  const totalScoreMonthlyTermII = subjectScoresTermII.reduce((total, sub) => total + sub.Score, 0);


                  const scoreExamTermII = subjectScoreExamTermII.length > 0 ? subjectScoreExamTermII[0].Score : 0;

                  // ສະເລ່ຍຄະແນນປະຈຳເດືອນ 2, 3, 4, 5
                  const averageScoreMonthlyTermII = totalScoreMonthlyTermI / 4

                  // ຄະແນນ ພາກຮຽນ II
                  const scoreTermII = (averageScoreMonthlyTermII + scoreExamTermII) / 2

                  const scoreAll = (scoreTermI + scoreExamTermII) / 2

                  return {
                    SubjectName: subject,
                    TotalScoreMonthlyTermI: totalScoreMonthlyTermI,
                    TotalScoreMonthlyTermII: totalScoreMonthlyTermII,
                    AverageScoreMonthlyTermI: averageScoreMonthlyTermI,
                    AverageScoreMonthlyTermII: averageScoreMonthlyTermII,
                    ScoreExamTermI: scoreExamTermI,
                    ScoreExamTermII: scoreExamTermII,
                    ScoreTermI: scoreTermI,
                    ScoreTermII: scoreTermII,
                    ScoreAll: scoreAll,

                  };
                });
                return { TermName: student.TermName, ClassroomName: student.ClassroomName, MemberId: student.MemberId, Fname: student.Fname, Lname: student.Lname, Gender: student.Gender, ScoreSubject: scoreSubject, Subject: student.Subject };
              });

              const newTransformedScore3 = newTransformedScore2.map(member => {

                // create score in an array ສ້າງ array ເກັບຄະແນນທຸກວິຊາ ພາກຮຽນ I
                const scores = member.ScoreSubject.reduce((acc, subject) => {
                  const index = member.Subject.indexOf(subject.SubjectName);
                  if (index !== -1) {
                    acc[index] = subject.ScoreAll;
                  }
                  return acc;
                }, Array(member.Subject.length).fill(0));

                // total score ລວມ ຄະແນນ ພາກຮຽນ I
                const totals = scores.reduce((acc, score) => acc + score, 0);

                // average score ສະເລ່ຍ ຄະແນນ ພາກຮຽນ I
                const averages = totals / scores.length

                return {
                  ...member,
                  Score: scores,
                  Total: totals,
                  Average: averages
                };
              });

              // this code is making for ranking of students ຈັດທີໃຫ້ນັກຮຽນ
              const newTransformedScore4 = newTransformedScore3.sort((a, b) => b.Total - a.Total).map((s, i, arr) => ({
                ...s,
                Ranking: arr.findIndex(m => m.Total === s.Total) + 1
              }));

              // Result Grade of student
              const Output = newTransformedScore4.sort((a, b) => a.MemberId - b.MemberId).map(s => {
                const lessThanFive = s.Score.filter(score => score < 5);
                const betweenFiveAndTen = s.Score.every(score => score >= 5);
                let countSubjectFail = lessThanFive.length;

                let resultGrade = "";

                if (lessThanFive.length >= 3) {
                  resultGrade = "ຕົກ";
                } else if (lessThanFive.length < 3 && lessThanFive.length > 0) {
                  resultGrade = "ໄດ້ອະນຸໂລມ";
                } else if (betweenFiveAndTen) {
                  resultGrade = "ໄດ້";
                }
                return {
                  ...s,
                  CountSubjectFail: countSubjectFail,
                  ResultGrade: resultGrade
                };
              });

              res.json(Output)

            })
          }

        })
      })
      // conn.query(`select GradeId from classroom where ClassroomId=${ClassroomId}`, (err, results) => {
      //   if (err) throw err;
      //   const gradeid = results[0].GradeId;
      //   const sql_subject = `select SubjectName from subject where GradeId=${gradeid} and SubjectId in(select SubjectId from teacherhsubject where TermId=(select Max(TermId) from teacherhsubject))`
      //   conn.query(sql_subject, (err, result) => {
      //     if (err) throw err;

      //     const originaSubject = result.map(e => e.SubjectName);
      //     const sql = `select a.MemberId,b.Fname, b.Lname, b.Gender, c.TermName, d.ClassroomName, e.*, g.* from member_classroom a LEFT JOIN invoice_register b ON a.RegisterId=b.RegisterId INNER JOIN school_term c ON b.TermId = c.TermId  LEFT JOIN classroom d ON a.ClassroomId=d.ClassroomId LEFT JOIN score_subject e ON a.MemberId=e.MemberId INNER JOIN teacherhsubject f ON e.TeacherHsubId = f.TeacherHsubId INNER JOIN subject g ON f.SubjectId = g.SubjectId where d.ClassroomId = ${ClassroomId} and  b.TermId = ${TermId} and e.Monthly in (9,10,11,12,1,2,3,4,5,6) order by g.SubjectId`

      //     conn.query(sql, (err, results) => {
      //       if (err) throw err;
      //       const originalData = results.map((e) => ({
      //         TermName: e.TermName,
      //         ClassroomName: e.ClassroomName,
      //         MemberId: e.MemberId,
      //         Fname: e.Fname,
      //         Lname: e.Lname,
      //         Gender: e.Gender,
      //         SubjectName: e.SubjectName,
      //         Monthly: e.Monthly,
      //         Score: parseInt(e.Score),
      //         Subject: originaSubject,

      //       }));

      //       const transformedScore1 = originalData.reduce((acc, curr) => {
      //         const { TermName, ClassroomName, MemberId, Fname, Lname, Gender, Subject } = curr;
      //         const { SubjectName, Score, Monthly } = curr;

      //         const index = acc.findIndex(item => item.MemberId === MemberId);
      //         if (index === -1) {
      //           acc.push({
      //             TermName,
      //             ClassroomName,
      //             MemberId,
      //             Fname,
      //             Lname,
      //             Gender,
      //             Subject,
      //             ScoreSubject: [
      //               {
      //                 SubjectName,
      //                 Score,
      //                 Monthly
      //               }
      //             ],

      //           });
      //         } else {
      //           acc[index].ScoreSubject.push({
      //             SubjectName,
      //             Score,
      //             Monthly
      //           });
      //         }

      //         return acc;
      //       }, []);

      //       const transformedScore2 = transformedScore1.map(student => {
      //         const subjectNames = Array.from(new Set(student.ScoreSubject.map(sub => sub.SubjectName)));

      //         const scoreSubject = subjectNames.map(subject => {

      //           // ສະແດງຂໍ້ມູນຄະແນນ ສະເພາະ ຄະແນນປະຈຳເດືອນ 9, 10, 11, 12
      //           const subjectScoresTermI = student.ScoreSubject.filter(sub => sub.SubjectName === subject && sub.Score !== null && [9, 10, 11, 12].includes(sub.Monthly));

      //           // ສະແດງຂໍ້ມູນຄະແນນ ສະເພາະ ຄະແນນສອບເສັງພາກຮຽນ 1
      //           const subjectScoreExamTermI = student.ScoreSubject.filter(sub => sub.SubjectName === subject && sub.Score !== null && [1].includes(sub.Monthly));

      //           // ລວມຄະແນນປະຈຳເດືອນ 9, 10, 11, 12
      //           const totalScoreMonthlyTermI = subjectScoresTermI.reduce((total, sub) => total + sub.Score, 0);

      //           // ຄະແນນສອບເສັງ ພາກຮຽນ 1
      //           const scoreExamTermI = subjectScoreExamTermI.length > 0 ? subjectScoreExamTermI[0].Score : 0;

      //           const averageScoreMonthlyTermI = totalScoreMonthlyTermI / 4       // ສະເລ່ຍຄະແນນປະຈຳເດືອນ 9, 10, 11, 12

      //           // ຄະແນນ ພາກຮຽນ I
      //           const scoreTermI = (averageScoreMonthlyTermI + scoreExamTermI) / 2


      //           // ສະແດງຂໍ້ມູນຄະແນນ ສະເພາະ ຄະແນນປະຈຳເດືອນ 2, 3, 4, 5
      //           const subjectScoresTermII = student.ScoreSubject.filter(sub => sub.SubjectName === subject && sub.Score !== null && [2, 3, 4, 5].includes(sub.Monthly));

      //           // ສະແດງຂໍ້ມູນຄະແນນ ສະເພາະ ຄະແນນສອບເສັງພາກຮຽນ 2
      //           const subjectScoreExamTermII = student.ScoreSubject.filter(sub => sub.SubjectName === subject && sub.Score !== null && [6].includes(sub.Monthly));

      //           // ລວມຄະແນນປະຈຳເດືອນ 2, 3, 4, 4
      //           const totalScoreMonthlyTermII = subjectScoresTermII.reduce((total, sub) => total + sub.Score, 0);


      //           const scoreExamTermII = subjectScoreExamTermII.length > 0 ? subjectScoreExamTermII[0].Score : 0;

      //           // ສະເລ່ຍຄະແນນປະຈຳເດືອນ 2, 3, 4, 5
      //           const averageScoreMonthlyTermII = totalScoreMonthlyTermI / 4

      //           // ຄະແນນ ພາກຮຽນ II
      //           const scoreTermII = (averageScoreMonthlyTermII + scoreExamTermII) / 2

      //           const scoreAll = (scoreTermI + scoreExamTermII) / 2

      //           return {
      //             SubjectName: subject,
      //             TotalScoreMonthlyTermI: totalScoreMonthlyTermI,
      //             TotalScoreMonthlyTermII: totalScoreMonthlyTermII,
      //             AverageScoreMonthlyTermI: averageScoreMonthlyTermI,
      //             AverageScoreMonthlyTermII: averageScoreMonthlyTermII,
      //             ScoreExamTermI: scoreExamTermI,
      //             ScoreExamTermII: scoreExamTermII,
      //             ScoreTermI: scoreTermI,
      //             ScoreTermII: scoreTermII,
      //             ScoreAll: scoreAll,

      //           };
      //         });
      //         return { TermName: student.TermName, ClassroomName: student.ClassroomName, MemberId: student.MemberId, Fname: student.Fname, Lname: student.Lname, Gender: student.Gender, ScoreSubject: scoreSubject, Subject: student.Subject };
      //       });

      //       const transformedScore3 = transformedScore2.map(member => {

      //         // create score in an array ສ້າງ array ເກັບຄະແນນທຸກວິຊາ ພາກຮຽນ I
      //         const scores = member.ScoreSubject.reduce((acc, subject) => {
      //           const index = member.Subject.indexOf(subject.SubjectName);
      //           if (index !== -1) {
      //             acc[index] = subject.ScoreAll;
      //           }
      //           return acc;
      //         }, Array(member.Subject.length).fill(0));

      //         // total score ລວມ ຄະແນນ ພາກຮຽນ I
      //         const totals = scores.reduce((acc, score) => acc + score, 0);

      //         // average score ສະເລ່ຍ ຄະແນນ ພາກຮຽນ I
      //         const averages = totals / scores.length

      //         return {
      //           ...member,
      //           Score: scores,
      //           Total: totals,
      //           Average: averages
      //         };
      //       });

      //       // this code is making for ranking of students ຈັດທີໃຫ້ນັກຮຽນ
      //       const transformedScore4 = transformedScore3.sort((a, b) => b.Total - a.Total).map((s, i, arr) => ({
      //         ...s,
      //         Ranking: arr.findIndex(m => m.Total === s.Total) + 1
      //       }));


      //       // Result Grade of student
      //       const Output = transformedScore4.sort((a, b) => a.MemberId - b.MemberId).map(s => {
      //         const lessThanFive = s.Score.filter(score => score < 5);
      //         const betweenFiveAndTen = s.Score.every(score => score >= 5);
      //         let countSubjectFail = lessThanFive.length;

      //         let resultGrade = "";

      //         if (lessThanFive.length >= 3) {
      //           resultGrade = "ຕົກ";
      //         } else if (lessThanFive.length < 3 && lessThanFive.length > 0) {
      //           resultGrade = "ໄດ້ອະນຸໂລມ";
      //         } else if (betweenFiveAndTen) {
      //           resultGrade = "ໄດ້";
      //         }
      //         return {
      //           ...s,
      //           CountSubjectFail: countSubjectFail,
      //           ResultGrade: resultGrade
      //         };
      //       });

      //       res.json(Output)
      //     })

      //   })
      // })
    }
    // ສະແດງຄະແນນປະຈຳເດືອນ 9, 10, 11, 12, 2, 3, 4, 5
    else {
      conn.query(`select GradeId from classroom where ClassroomId=${ClassroomId}`, (err, results) => {
        if (err) throw err;
        const gradeid = results[0].GradeId;
        const sql_subject = `select SubjectName from subject where GradeId=${gradeid} and SubjectId in(select SubjectId from teacherhsubject where TermId=(select Max(TermId) from teacherhsubject))`
        conn.query(sql_subject, (err, result) => {
          if (err) throw err;

          const sql = `select a.MemberId,b.Fname, b.Lname, b.Gender, c.TermName, d.ClassroomName, e.*, g.* from member_classroom a LEFT JOIN invoice_register b ON a.RegisterId=b.RegisterId INNER JOIN school_term c ON b.TermId = c.TermId  LEFT JOIN classroom d ON a.ClassroomId=d.ClassroomId LEFT JOIN score_subject e ON a.MemberId=e.MemberId INNER JOIN teacherhsubject f ON e.TeacherHsubId = f.TeacherHsubId INNER JOIN subject g ON f.SubjectId = g.SubjectId where d.ClassroomId = ${ClassroomId} and  b.TermId = ${TermId} and e.Monthly = ${Monthly} order by g.SubjectId;`

          const originaSubject = result.map(e => e.SubjectName);

          conn.query(sql, (err, results) => {
            if (err) throw err;
            const originalData = results.map((e) => ({

              TermName: e.TermName,
              ClassroomName: e.ClassroomName,
              MemberId: e.MemberId,
              Fname: e.Fname,
              Lname: e.Lname,
              Gender: e.Gender,
              SubjectName: e.SubjectName,
              Score: parseInt(e.Score),
              Subject: originaSubject,

            }));

            const transformedData = originalData.reduce((acc, curr) => {
              const { TermName, ClassroomName, MemberId, Fname, Lname, Gender, SubjectName, Subject } = curr;
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

            // console.log(transformedData)
            // res.json(transformedData)

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
            const Output = transformedData3.sort((a, b) => a.MemberId - b.MemberId).map(s => {
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

            res.json(Output)
          })

        })
      })
    }

  }

};
module.exports = score;
