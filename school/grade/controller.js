const conn = require("../../config/database");

const grade = {
  insert: (req, res) => {
    const { GradeName, Remark } = req.body;

    conn.query(
      "select*from grade where GradeName=?",
      [GradeName],
      (err, result) => {
        if (err) {
          res.json({ status: 404, message: "errror" });
        }
        if (result.length) {
          res.json({ status: 403, message: "GradeName aready exist..." });
        } else {
          conn.query(
            "INSERT INTO grade(GradeName, Remark)values(?,?)",
            [GradeName, Remark],
            (error, result) => {
              if (error) {
                res.json({
                  status: 404,
                  message: "ERROR!: 404 Not fount any feild",
                });
              }
              res.json({ status: 200, message: "success fully..." });
            }
          );
        }
      }
    );
  },

  findAll: (req, res) => {
    conn.query("SELECT*FROM grade", (error, result) => {
      if (error) throw error;
      res.json(result);
    });
  },

  findOne: (req, res) => {
    const GradeId = req.params.GradeId;
    conn.query(
      "SELECT*FROM grade where GradeId=?",
      [GradeId],
      (error, result) => {
        if (error) throw error;
        res.json(result[0]);
      }
    );
  },
  delet: (req, res) => {
    const GradeId = req.params.GradeId;
    conn.query(
      "delete from grade where GradeId=?",
      [GradeId],
      (error, result) => {
        if (error) {
          res.json({ status: 404, message: "delete field" });
        }
        res.json({
          status: 200,
          message: "delete success",
        });
      }
    );
  },

    Edit: (req, res) => {
      const { GradeId, GradeName, Remark } = req.body;
  
      conn.query(
        "select*from grade where GradeName=?",
        [GradeName],
        (err, result) => {
          if (err) {
            res.json({ status: 404, message: "errror" });
          }
          if (result.length) {
            res.json({ status: 403, message: "GradeName aready exist..." });
          } else {
            conn.query(
              "update grade set GradeName=?, Remark=? where GradeId=?",
              [GradeName, Remark, GradeId],
              (error, result) => {
                if (error) {
                  res.json({
                    status: 404,
                    message: "ERROR!: 404 Not fount any feild",
                  });
                }
                res.json({ status: 200, message: "update success fully..." });
              }
            );
          }
        }
      );
    },
    
  //get room

  getRoom: (req, res) => {
    conn.query(" select a.*,b.* from grade as a, classroom as b where a.GradeId=b.GradeId and a.GradeId=?",[req.params.GradeId], (error, result) => {
      if(error) {
        res.json({status:404, message:'no infor'})
      }
      res.json(result)
    })
  }
};

module.exports = grade;
