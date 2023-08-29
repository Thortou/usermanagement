const conn = require("../../../config/database");

const deductPoint = {
  create: (req, res) => {
    // const Point = [req.body];
    // const  PointScore = [req.body];
    const MemberId = [req.body];
    const arrayData = [req.body];
    const PointDate = [req.body];
    const Remark = [req.body];

    const setf = "set foreign_key_checks=0";
    conn.query(setf);
    // const Points = Point[0].Point;
    // const PointScores = PointScore[0].PointScore;
    const MemberIds = MemberId[0].MemberId;
    const studentPoint = arrayData[0].arrayData;
    const PointDates = PointDate[0].PointDate;
    const Remarks = Remark[0].Remark;
    //check MemberId may data in student_point to keep PointId to insert in table deduct_student_point
    conn.query(
      "select*From student_point where MemberId=?",
      [MemberIds],
      (err, result) => {
        if (err) throw err;
        if (result.length) {
          const myResult = result[0].PointId;
          const mapData2 = studentPoint.map((value) => ({
            // Points: Points,
            // PointScore: PointScores,
            PointId: myResult,
            RegId: value,
            PointDate: PointDates,
            Remark: Remarks,
          }));
          let sqlInsert = `INSERT INTO deduct_student_point (PointId, RegId, PointDate, Remark) VALUES ?`;
          let values = [];
          for (var i in mapData2) {
            values.push([
              mapData2[i].PointId,
              mapData2[i].RegId,
              mapData2[i].PointDate,
              mapData2[i].Remark,
            ]);
          }
          conn.query(sqlInsert, [values], (err, result) => {
            if (err) {
              console.log(err);
              res.json({ status: 500, message: "sql error" });
            } else {
              res.json({ status: 200, message: "inserted..." }); //send The status to clien

              //chect DeductPoint to update student_point
              conn.query(
                "select sum(DeductPoint)as DeductPoint From regulation where RegId in (?)",
                [studentPoint],
                (err, result) => {
                  if (err) throw err;
                  const STdeduct = result[0].DeductPoint;
                  conn.query(
                    `update student_point set Point=Point-${STdeduct} where MemberId=${MemberIds}`
                  );

                  //check point
                  conn.query(
                    "select Point from student_point where MemberId in (?)",
                    [MemberIds],
                    (err, result) => {
                      if (err) throw err;
                      if (result.length) {
                        //start check Point
                        const yet = result[0].Point;
                        if (yet <= 305 && yet >= 288) {
                          conn.query(
                            `update student_point set PointScore=9 where MemberId=${MemberIds}`
                          );
                        } else if (yet <= 288 && yet >= 270) {
                          conn.query(
                            `update student_point set PointScore=8 where MemberId=${MemberIds}`
                          );
                        } else if (yet <= 269 && yet >= 220) {
                          conn.query(
                            `update student_point set PointScore=7 where MemberId=${MemberIds}`
                          );
                        } else if (yet <= 219 && yet >= 170) {
                          conn.query(
                            `update student_point set PointScore=6 where MemberId=${MemberIds}`
                          );
                        } else if (yet <= 169 && yet >= 120) {
                          conn.query(
                            `update student_point set PointScore=5 where MemberId=${MemberIds}`
                          );
                        } else if (yet < 119) {
                          conn.query(
                            `update student_point set PointScore=4 where MemberId=${MemberIds}`
                          );
                        }
                        //End check point
                      } else {
                        res.json({ status: 404, message: "not in db" });
                      }
                    }
                  );
                }
              );
            }
          });
        } else {
          res.json({ status: 403, message: "not have in db..." });
        }
      }
    );
  },
  findAll: (req, res) => {
    conn.query(
      "select a.*,b.*,c.*,d.*,Date_FORMAT(d.PointDate, '%d/%m/%Y') as PointDate, e.*, f.* from member_classroom as a, student_point as b, regulation as c, deduct_student_point as d, invoice_register as e, classroom as f where a.ClassroomId=f.ClassroomId and a.RegisterId=e.RegisterId and a.MemberId=b.MemberId and b.PointId=d.PointId and c.RegId=d.RegId order by e.Fname asc",
      (err, result) => {
        if (err) throw err;
        res.json(result);
      }
    );
  },
  findOne: (req, res) => {
    const DeductId = req.params.DeductId;
    conn.query(
      "select a.*,b.*,c.*,d.*,Date_FORMAT(d.PointDate, '%d/%m/%Y') as PointDate, e.*, f.* from member_classroom as a, student_point as b, regulation as c, deduct_student_point as d, invoice_register as e, classroom as f where a.ClassroomId=f.ClassroomId and a.RegisterId=e.RegisterId and a.MemberId=b.MemberId and b.PointId=d.PointId and c.RegId=d.RegId and DeductId=?",
      [DeductId],
      (err, result) => {
        if (err) throw err;
        res.json(result[0]);
      }
    );
  },
  updated: (req, res) => {
    const { DeductId, PointId, RegId, PointDate } = req.body;
    conn.query(
      "select a.*,b.*,b.Point as score, c.*, d.* from member_classroom as a, student_point as b, deduct_student_point as c, regulation as d where a.MemberId=b.MemberId and b.PointId=c.PointId and c.RegId=d.RegId and c.DeductId=?",
      [DeductId],
      (err, result) => {
        if (err) throw err;
        const oldDeductPoint = result[0].DeductPoint;

        conn.query(
          "update deduct_student_point set PointId=?, RegId=?, PointDate=? where DeductId=?",
          [PointId, RegId, PointDate, DeductId],
          (err, result) => {
            if (err) {
              res.json({ status: 500, message: " sql error!!!" });
            } else {
              res.json({ status: 200, message: "update success..." });

              conn.query(
                "select a.*,b.*,b.Point as score, c.*, d.* from member_classroom as a, student_point as b, deduct_student_point as c, regulation as d where a.MemberId=b.MemberId and b.PointId=c.PointId and c.RegId=d.RegId and c.DeductId=?",
                [DeductId],
                (err, result) => {
                  if (err) throw err;
                  const newDeductPoint = result[0].DeductPoint;

                  const aa = oldDeductPoint - newDeductPoint;
                  const bb = newDeductPoint - oldDeductPoint;

                  if (oldDeductPoint > newDeductPoint) {
                    conn.query(
                      `UPDATE student_point set Point=Point+${aa} where PointId=${PointId}`
                    );
                    // console.log('tast1')
                  }
                  if (oldDeductPoint < newDeductPoint) {
                    // console.log('test2')
                    conn.query(
                      `UPDATE student_point set Point=Point-${bb} where PointId=${PointId}`
                    );
                  }

                  //start check Point
                  const memberids = result[0].MemberId;
                  const yet = result[0].Point;
                  if (yet <= 305 && yet >= 288) {
                    conn.query(
                      `update student_point set PointScore=9 where MemberId=${memberids}`
                    );
                  } else if (yet <= 288 && yet >= 270) {
                    conn.query(
                      `update student_point set PointScore=8 where MemberId=${memberids}`
                    );
                  } else if (yet <= 269 && yet >= 220) {
                    conn.query(
                      `update student_point set PointScore=7 where MemberId=${memberids}`
                    );
                  } else if (yet <= 219 && yet >= 170) {
                    conn.query(
                      `update student_point set PointScore=6 where MemberId=${memberids}`
                    );
                  } else if (yet <= 169 && yet >= 120) {
                    conn.query(
                      `update student_point set PointScore=5 where MemberId=${memberids}`
                    );
                  } else if (yet < 119) {
                    conn.query(
                      `update student_point set PointScore=4 where MemberId=${memberids}`
                    );
                  }
                  //End check point
                }
              );
            }
          }
        );
      }
    );
  },
  deleted: (req, res) => {
    const DeductId = req.params.DeductId;

    conn.query(
      "select a.*,b.*,c.*,d.*,Date_FORMAT(d.PointDate, '%d/%m/%Y') as PointDate, e.*, f.* from member_classroom as a, student_point as b, regulation as c, deduct_student_point as d, invoice_register as e, classroom as f where a.ClassroomId=f.ClassroomId and a.RegisterId=e.RegisterId and a.MemberId=b.MemberId and b.PointId=d.PointId and c.RegId=d.RegId and DeductId=?",
      [DeductId],
      (err, result) => {
        if (err) throw err;
        const studentPoint = result[0].DeductPoint;
        const studentid = result[0].MemberId;

        //delete
        conn.query(
          "DELETE FROM deduct_student_point where DeductId=?",
          [DeductId],
          (err, result) => {
            if (err) {
              res.json({ status: 500, message: "delete error" });
            } else {
              res.json({status:200, message:"deleted...."});
              conn.query(
                `update student_point set Point=Point+${studentPoint} where MemberId=${studentid}`,
                (err, result) => {
                  if (err) throw err;
                  //add PointScore
                  conn.query(
                    "select * from student_point where MemberId=?",
                    [studentid],
                    (err, result) => {
                      if (err) throw err; 
                      //start check Point
                      const yet = result[0].Point;
                      if(yet >= 320) {
                        conn.query(
                          `update student_point set PointScore=10 where MemberId=${studentid}`
                        );
                      }
                      else if (yet <= 305 && yet >= 288) {
                        conn.query(
                          `update student_point set PointScore=9 where MemberId=${studentid}`
                        );
                      } else if (yet <= 288 && yet >= 270) {
                        conn.query(
                          `update student_point set PointScore=8 where MemberId=${studentid}`
                        );
                      } else if (yet <= 269 && yet >= 220) {
                        conn.query(
                          `update student_point set PointScore=7 where MemberId=${studentid}`
                        );
                      } else if (yet <= 219 && yet >= 170) {
                        conn.query(
                          `update student_point set PointScore=6 where MemberId=${studentid}`
                        );
                      } else if (yet <= 169 && yet >= 120) {
                        conn.query(
                          `update student_point set PointScore=5 where MemberId=${studentid}`
                        );
                      } else if (yet < 119) {
                        conn.query(
                          `update student_point set PointScore=4 where MemberId=${studentid}`
                        );
                      }
                      //End check point
                    }
                  );
                }
              );
            }
          }
        );
      }
    );
  },
};
module.exports = deductPoint;
