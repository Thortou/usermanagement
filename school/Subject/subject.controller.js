const conn = require("../../config/database");

const Suject = {
  insert: (req, res) => {
    const { GradeId, SubjectName, Remark, UserId } = req.body;

    console.log(GradeId)
    console.log(SubjectName)
    console.log(UserId)
    console.log(Remark)
    conn.query(
      "select * from subject where GradeId=? and SubjectName=?",
      [GradeId, SubjectName],
      (err, results) => { 
        if (err) {
          res.json({ status: 500, message: "sl errr" });
        }else
        if (results.length) {
          res.json({ status: 403, message: "aready edfdfdsxit..." });
        } else {
          const sqlInsert = 
            "INSERT INTO subject (GradeId, SubjectName, UserId, Remark) VALUES (?,?,?,?)";
          conn.query( 
            sqlInsert,
            [GradeId, SubjectName, UserId, Remark],
            (err, result) => {
              if (err) {
                console.log(err);
                res.json({ 
                  status: 501,
                  message: "sql have anny coding error!!!",
                }); 
              } else {
                res.json({
                  status: 200,
                  message: "insert success fully....",
                });
              }
            }
          );
        }
      }
    );
  },
  findAll: (req, res) => {
    const selectD =
      "SELECT a.*, b.* FROM subject as a, grade as b where a.GradeId=b.GradeId order by a.GradeId asc";

    conn.query(selectD, (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  },
  findOne: (req, res) => {
    const SubjectId = req.params.SubjectId;
    const selectD =
      "SELECT a.*, b.* FROM subject as a, grade as b where a.GradeId=b.GradeId and a.SubjectId=?";

    conn.query(selectD, [SubjectId], (err, result) => {
      if (err) throw err;
      res.json(result[0]);
    });
  },
  findAll_get_Grade: (req, res) => {
    const GradeId = req.params.GradeId;
    const selectD =
      "SELECT a.*, b.* FROM subject as a, grade as b where a.GradeId=b.GradeId and a.GradeId=?";

    conn.query(selectD, [GradeId], (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  },
  
  update: (req, res) => {
    const { SubjectId, GradeId, SubjectName, Remark } = req.body;
    conn.query(
      "select * from subject where GradeId=? and SubjectName=?",
      [GradeId, SubjectName],
      (err, results) => {
        if (err) {
          res.json({ status: 500, message: "sl errr" });
        } else if (results.length) {
          res.json({ status: 403, message: "aready edfdfdsxit..." });
        } else {
          
          const updated =
            "UPDATE subject set GradeId=?, SubjectName=?, Remark=? where SubjectId=?";
          conn.query(
            updated,
            [GradeId, SubjectName, Remark, SubjectId],
            (err, result) => {
              if (err) {
                res.json({ status: 500, message: "update err...." });
              } else {
                console.log(result)
                res.json({ status: 200, message: "update success..." });
              }
            }
          );
        }
      }
    );
  },
  dele: (req, res) => {
    const SubjectId = req.params.SubjectId
    conn.query("DELETE FROM subject where SubjectId=?",[SubjectId], (err, result) => {
        if(err){
            res.json({status:500, message:'delete erro'});
        }else{
            res.json({status:200, message:'ok'});
        }
    })
  }
};

module.exports = Suject;
