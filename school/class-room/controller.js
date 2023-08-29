const conn = require("../../config/database");

const classroom = {
  insert: (req, res) => {
    const { GradeId, ClassroomName, Remark } = req.body;

    conn.query(
      "select*from classroom where ClassroomName=?",
      [ClassroomName],
      (err, result) => {
        if (err) {
          res.json({ status: 404, message: "errror" });
        }
        if (result.length) {
          res.json({ status: 403, message: "GradeName aready exist..." });
        } else {
          conn.query(
            "INSERT INTO classroom(GradeId, ClassroomName, Remark)values(?,?,?)",
            [GradeId, ClassroomName, Remark],
            (error, result) => {
              if (error) {
                console.log(error)
                res.json({
                  status: 404,
                  message: "ERROR!: 404 Not fount any feild",
                });
              }else{
                res.json({ status: 200, message: "success fully..." });
              }
              
            }
          );
        }
      }
    );
  },

  findAll: (req, res) => {
    conn.query(
      "SELECT a.*, b.* FROM Grade as a, Classroom as b where a.GradeId=b.GradeId",
      (error, result) => {
        if (error) throw error;
        res.json(result);
      }
    );
  },
  findAll_get_classroomOnly: (req, res) => {
    const UserId = req.params.UserId;
    conn.query(
      "select e.ClassroomName,a.UserId, e.ClassroomId, f.*, g.*, d.TermId from users as a, users_has_roles as b, roles as c, school_term as d, classroom as e, teacherhsubject as f, subject as g where f.SubjectId=g.SubjectId and a.UserId=b.UserId and b.RoleId=c.RoleId and b.UserhRoleId=f.UserhRoleId and f.ClassroomId=e.ClassroomId and f.TermId=d.TermId and f.TermId=(select Max(TermId)from teacherhsubject) and a.UserId=? order by e.ClassroomName asc",[UserId],
      (error, result) => {
        if (error) throw error;
        res.json(result);
      }
    );
  },
  findAll_get_Teacher: (req, res) => {
    const UserId = req.params.UserId;
    conn.query(
      "select a.UserId, d.SubjectId, a.Mobile, a.Email, c.Rolename, d.SubjectName, f.ClassroomName, g.GradeName, i.* from users as a, users_has_roles as b, roles as c, subject as d, teacherhsubject as e, classroom as f, grade as g, school_term as i where a.userid=b.userid and b.roleid=c.roleid and e.SubjectId=d.SubjectId and b.UserhRoleId=e.UserhRoleId and e.ClassroomId=f.ClassroomId and e.TermId=i.TermId and e.TermId=(select Max(TermId)from teacherhsubject) and f.GradeId=g.GradeId and a.UserId=?",[UserId],
      (error, result) => {
        if (error) throw error;
        res.json(result[0]);
      }
    );
  },

  findOne: (req, res) => {
    const ClassroomId = req.params.ClassroomId;
    conn.query(
      "SELECT a.*, b.* FROM Grade as a, Classroom as b where a.GradeId=b.GradeId and ClassroomId=?",
      [ClassroomId],
      (error, result) => {
        if (error) throw error;
        res.json(result[0]);  
      }
    );
  },
  delete: (req, res) => {
    const ClassroomId = req.params.ClassroomId;
    conn.query(
      "delete from classroom where ClassroomId=?",
      [ClassroomId],
      (error, result) => {
        if (error) {
          res.json({ status: 404, message: "delete field" });
        }
        res.json({
          status:200,
          message: "delete success",
        });
      }
    );
  },

  Edit: (req, res) => {
    const { ClassroomId, GradeId, ClassroomName, Remark } = req.body;

    conn.query(
      "select*from classroom where ClassroomName=?",
      [ClassroomName],
      (err, result) => {
        if (err) {
          res.json({ status:404, message: "errror" });
        }
        if (result.length) {
          res.json({ status:403, message: "GradeName aready exist..." });
        } 
        else {
          conn.query(
            "update classroom set ClassroomName=?, Remark=? where ClassroomId=? ",
            [ClassroomName, Remark, ClassroomId],
            (error, result) => {
              if (error) { 
                res.json({
                  status: 404,
                  message: "ERROR!: 404 Not found any feild",
                }); 
              }
              console.log(result);
              res.json({ status:200, message: "Update success fully..." });
            }
          );
        }
      }
    );
  },
};

module.exports = classroom;
