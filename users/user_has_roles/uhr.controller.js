const conn = require("../../config/database");

const uhr = {
  getrole: async (req, res) => {
    conn.query(
      "SELECT * FROM Users WHERE UserId=?",
      [req.body.UserId],
      function (err, Users, results, fields) {
        if (err) {
          res.json({ status: "err", message: err });
          return;
        }
        if (Users.length == 0) {
          // request.session.UserId = data[count].UserId;
          res.json({ status: "error", message: "No Users.." });
          return;
        }
        req.session.UserId = Users[0].UserId;

        //check User already exist
        conn.query(
          "select UserId from Users_has_Roles where UserId=?",
          [req.body.UserId],
          (err, result) => {
            if (result.length) {
              console.log(result);
              res.json({
                status: "warning",
                message: "This User already exit...",
              });
            } else {
              // create Users has Roles
              conn.query(
                "insert into Users_has_Roles (UserId, RoleId)values(?,?)",
                [req.session.UserId, req.body.RoleId],
                (err, results) => {
                  if (err) {
                    res.send(err);
                  }
                  if (req.body.RoleId == 1) {
                    //start
                    conn.query(
                      "select UserId from Permissions where UserId=?",
                      [req.body.UserId],
                      (err, result) => {
                        if (result.length) {
                          console.log(result);
                          res.json({
                            status: "warning",
                            message: "This User in permissions already exit...",
                          });
                        } else {
                          conn.query(
                            "insert into Permissions (RoleId,UserId,PermCreate, PermRead, PermUpdate, PermDelete)value(?,?,?,?,?,?)",
                            [req.body.RoleId, req.body.UserId, 1, 1, 1, 1],
                            (err, result) => {
                              if (err) {
                                res.send(err);
                              }
                              console.log(result);
                              res.json(result);
                            }
                          );
                        }
                      }
                    );
                    //end
                  } else {
                    conn.query(
                      "select UserId from Permissions where UserId=?",
                      [req.body.UserId],
                      (err, result) => {
                        if (result.length) {
                          console.log(result);
                          res.json({
                            status: "warning",
                            message: "This User in permissions already exit...",
                          });
                        } else {
                          conn.query(
                            "insert into Permissions (RoleId,UserId,PermCreate, PermRead, PermUpdate, PermDelete)value(?,?,?,?,?,?)",
                            [req.body.RoleId, req.body.UserId, 0, 0, 0, 0],
                            (err, result) => {
                              if (err) {
                                res.send(err);
                              }
                              console.log(result);
                              res.json(result);
                            }
                          );
                        }
                      }
                    );
                  }
                  //check RoleName Admin or User Or Manager Or Read
                }
              );
            }
          }
        );
      }
    );
  },
  create: (req, res) => {

    const UserId = req.body.UserIds
    const RoleId = req.body.selected
    conn.query(`select * from users_has_roles where UserId = ${UserId} and RoleId in (${RoleId.join()}) `, (error, results) => {
      if (error) {
        console.log(err);
        res.json({ status: 500, message: "error" });
      }
      if (results.length) {
        res.json({
          status: 403, message: "Forbidden"
        }) // 403: ຫ້າມ
      }
      else {
        const values = RoleId.map(roleId => [UserId, roleId]);
        const sqlQuery = `INSERT INTO users_has_roles (UserId, RoleId) VALUES ?`;

        conn.query(sqlQuery,
          [values],
          (err, result) => {
            if (err) {
              console.log(err);
              res.json({ status: 500, message: "error" });
            }
            else {
              // conn.query(
              //   `DELETE FROM users_has_roles where UserId=${_UserIds} and RoleId=2`
              // );
              res.json({ status: 200, message: "success...." });
            }
          }
        );
      }
    })

  },
  creasteGet_subject: (req, res) => {

    const UserhRoleIds = req.body.UserhRoleIds;
    const arrayRoom = req.body.arrayRoom;
    const SubjectId = req.body.SubjectId;
    const TermId = req.body.TermId;

    conn.query(
      `select ClassroomId From classroom where ClassroomName in (?)`,
      [arrayRoom],
      (err, results) => {
        if (err) throw err;
        const ClassroomIds = results;
        const _id = ClassroomIds.map((element) => ({
          id: element.ClassroomId,
        }));
        const classroomId = [];

        for (var i in _id) {
          classroomId.push([_id[i].id]);
        }
        console.log(classroomId)
        conn.query(
          "select * from teacherhsubject where UserhRoleId=? and ClassroomId in (?) and TermId=? and SubjectId=?",
          [UserhRoleIds, classroomId, TermId, SubjectId],

          (err, result) => {
            if (err) throw err;
            if (result.length) {
              res.json({ status: 403, message: "already...." });
            } else {
              conn.query(`select *from teacherhsubject where SubjectId=${SubjectId} and ClassroomId in (${classroomId}) and TermId=${TermId}`, (err, result) => {
                if (err) throw err;
                if(result.length) {
                  res.json({status: 403, message: "already"})
                }else{
                  
                const dataT = results.map((TeacherHsub) => ({
                  UserhRoleId: UserhRoleIds,
                  SubjectId: SubjectId,
                  ClassroomId1: TeacherHsub.ClassroomId,
                  TermId: TermId,
                }))


                let data = [];

                for (var i in dataT) {
                  data.push([
                    dataT[i].UserhRoleId,
                    dataT[i].SubjectId,
                    dataT[i].ClassroomId1,
                    dataT[i].TermId,
                  ]);
                }
                conn.query(
                  "insert into teacherhsubject (UserhRoleId, SubjectId, ClassroomId, TermId) values ?",
                  [data],
                  (err, result) => {
                    if (err) {
                      console.log(err);
                      res.json({ status: 500, message: "error" });
                    } else {
                      res.json({ status: 200, message: "success...." });
                    }
                  }
                )
                
              }
              });
            }
          }
        )
      }
    )
  },

  Teacherroom: (req, res) => {
    const { UserhRoleId, ClassroomId, TermId } = req.body;
    //ກວດສອບໃນຕາຕະລາງ ຄູປະຈຳຫ້ອງ ບັນຊີນີ້,ໃນຫ້ອງນີ້, ສົກຮຽນນີ້ ມີ ຫຼື ບໍ
    conn.query(
      `select*From teacherroom where UserhRoleId=${UserhRoleId} and ClassroomId=${ClassroomId} and TermId=${TermId}`,
      (err, result) => {
        if (err) throw err;

        if (result.length) {
          res.json({ status: 403, message: "already exist...." });
        } else {
          //ກວດສອບໃນ ຕາຕະລາງ ຄູປະຈຳຫ້ອງວ່າ ບັນຊີນີ້, ສົກຮຽນນີ້ ເປັນປະຈຳຫ້ອງ ຫ້ອງອີ່ນ ຫຼື ບໍ
          conn.query(
            `select*from teacherroom where UserhRoleId=${UserhRoleId} and TermId=${TermId}`,
            (err, results) => {
              if (err) throw err;
              if (results.length) {
                res.json({ status: 405, message: "have t in other classroom" });
              } else {
                // res.json({message:"success..."})
                //ກວດສອບໃນ ຕາຕະລາງ ຄູປະຈຳຫ້ອງວ່າ ໃນຫ້ອງນີ້, ສົກຮຽນນີ້ ມີບັນຊີອື່ນເປັນປະຈຳຫ້ອງ ຫຼື ບໍ
                conn.query(`select *from teacherroom where ClassroomId=${ClassroomId} and TermId=${TermId}`, (err, result) => {
                  if (err) throw err;
                  if (result.length) {
                    res.json({ status: 403, message: "this classroom teacherroom already exist" })
                  } else {
                    conn.query(
                      `INSERT INTO teacherroom (UserhRoleId, ClassroomId, TermId)values(?,?,?)`,
                      [UserhRoleId, ClassroomId, TermId],
                      (err, result) => {
                        if (err) {
                          console.log(err);
                          res.json({ status: 500, message: "sql error!!!!" });
                        } else {
                          res.json({ status: 200, message: "insert success..." });
                        }
                      }
                    );
                  }
                });
              }
            }
          );
        }
      }
    );
  },
  getTeacherroom: (req, res) => {
    const UserId = req.params.UserId;

    conn.query(
      "select a.UserId, e.ClassroomName from users as a, users_has_roles as b, roles as c, teacherroom as d, classroom as e where a.UserId=b.UserId and b.RoleId=c.RoleId and b.UserhRoleId=d.UserhRoleId and d.ClassroomId=e.ClassroomId and d.TermId=(select Max(TermId)from teacherroom) and a.UserId=?",
      [UserId],
      (err, result) => {
        if (err) throw err;
        res.json(result[0]);
      }
    );
  },
  findeOne: async (req, res) => {
    conn.query(
      "select a.UserName, a.Mobile, a.Email, c.Rolename from users as a, users_has_roles as b, roles as c where a.userid=b.userid and b.roleid=c.roleid and a.UserId=?",
      [req.params.UserId],
      (err, result) => {
        if (err) {
          res.send(err);
        }
        res.json(result);
      }
    );
  },
  getSubject: async (req, res) => {
    conn.query(
      "select a.UserName, a.Mobile, a.Email, c.Rolename, d.SubjectName, f.ClassroomName, g.GradeName, i.* from users as a, users_has_roles as b, roles as c, subject as d, teacherhsubject as e, classroom as f, grade as g, school_term as i where a.userid=b.userid and b.roleid=c.roleid and e.SubjectId=d.SubjectId and b.UserhRoleId=e.UserhRoleId and e.ClassroomId=f.ClassroomId and e.TermId=i.TermId and e.TermId=(select Max(TermId)from teacherhsubject) and f.GradeId=g.GradeId and a.UserId=?",
      [req.params.UserId],
      (err, result) => {
        if (err) {
          res.send(err);
        }
        res.json(result);
      }
    );
  },
  findeAll: async (req, res) => {
    conn.query(
      "select a.*, c.* from users as a, users_has_roles as b, roles as c where a.userid=b.userid and b.roleid=c.roleid order by a.UserName asc",
      (err, result) => {
        if (err) {
          res.send(err);
        }
        res.json(result);
      }
    );
  },
  findeAllGetGrade: async (req, res) => {
    const GradeId = req.params.GradeId;
    conn.query(
      "select a.*,f.UserName, g.FirstName, g.LastName, b.SubjectName from teacherhsubject as a, subject as b, classroom as c, school_term as d, grade as e, users as f, profiles as g, users_has_roles as j where f.UserId=g.UserId and f.UserId=j.UserId and j.UserhRoleId=a.UserhRoleId and  a.SubjectId=b.SubjectId and a.ClassroomId=c.ClassroomId and a.TermId=d.TermId and c.GradeId=e.GradeId and e.GradeId=?", [GradeId],
      (err, result) => {
        if (err) {
          res.send(err);
        }
        const Teacherhsubject = result;
        const groupedByUserId = Teacherhsubject.reduce((acc, curr) => {
          const { UserId, SubjectId, SubjectName, ...rest } = curr;
          const existing = acc.find(obj => obj.UserId === UserId);
          if (existing) {
            existing.SubjectId.push(SubjectId);
            existing.SubjectName.push(SubjectName);
          } else {
            acc.push({
              UserId,
              SubjectId: [SubjectId],
              SubjectName: [SubjectName],
              ...rest
            });
          }
          return acc;
        }, []);

        const output = groupedByUserId.map(obj => ({
          TeacherHsubId: obj.TeacherHsubId,
          UserId: obj.UserId,
          UserName: obj.UserName,
          FirstName: obj.FirstName,
          LastName: obj.LastName,
          UserhRoleId: obj.UserhRoleId,
          SubjectId: obj.SubjectId,
          SubjectName: obj.SubjectName
        }));
        res.json(output)
      }
    );
  },
  findeTeacherRoom_TeacherHsubject_roles: async (req, res) => {
    conn.query(
      "select a.UserId,a.UserName, f.*, g.*, h.*, i.SubjectName, j.*  from Users as a INNER JOIN profiles as b ON a.UserId = b.UserId INNER JOIN Provinces as c ON b.ProvinceId = c.ProvinceId INNER JOIN Districts as d ON b.DistrictId = d.DistrictId INNER JOIN users_has_roles as e ON a.UserId = e.UserId INNER JOIN roles as f ON e.RoleId = f.RoleId LEFT JOIN teacherhsubject as g ON e.UserhRoleId = g.UserhRoleId LEFT JOIN teacherroom as h ON e.UserhRoleId = h.UserhRoleId LEFT JOIN subject as i ON g.SubjectId = i.SubjectId LEFT JOIN classroom as j ON h.ClassroomId = j.ClassroomId where a.UserId=39",
      (err, result) => {
        if (err) {
          res.send(err);
        }
        console.log(result)
        res.json(result);
      }
    );
  },
  update: async (req, res) => {
    conn.query(
      "SELECT * FROM Users WHERE UserId=?",
      [req.body.UserId],
      function (err, Users, results, fields) {
        if (err) {
          res.json({ status: "err", message: err });
          return;
        }
        if (Users.length == 0) {
          // request.session.UserId = data[count].UserId;
          res.json({ status: "error", message: "No Users.." });
          return;
        }
        req.session.UserId = Users[0].UserId;
        // create Users has Roles
        conn.query(
          "update Users_has_Roles set UserId=?, RoleId=? where UserId=?",
          [req.session.UserId, req.body.RoleId, req.session.UserId],
          (err, results) => {
            if (err) {
              res.send(err);
            }
            // res.json({message:"change success...",results})
            if (req.body.RoleId == 1) {
              //start
              conn.query(
                "update Permissions set RoleId=?,PermCreate=?, PermRead=?, PermUpdate=?, PermDelete=? where UserId=?",
                [req.body.RoleId, 1, 1, 1, 1, req.session.UserId],
                (err, result) => {
                  if (err) {
                    res.send(err);
                  }
                  console.log(result);
                  res.json({ status: "ok", message: "update success" });
                }
              );
              //end
            } else if (req.body.RoleId == 3) {
              conn.query(
                "update Permissions set RoleId=?,PermCreate=?, PermRead=?, PermUpdate=?, PermDelete=? where UserId=?",
                [req.body.RoleId, 1, 1, 1, 0, req.session.UserId],
                (err, result) => {
                  if (err) {
                    res.send(err);
                  }
                  console.log(result);
                  res.json({ status: "ok", message: "update success" });
                }
              );
            } else {
              conn.query(
                "update Permissions set RoleId=?,PermCreate=?, PermRead=?, PermUpdate=?, PermDelete=? where UserId=?",
                [req.body.RoleId, 0, 0, 0, 0, req.session.UserId],
                (err, result) => {
                  if (err) {
                    res.send(err);
                  }
                  console.log(result);
                  res.json({ status: "ok", message: "update success" });
                }
              );
            }
          }
        );
      }
    );
  },
  deleted: (req, res) => {
    const UserhRoleId = req.params.UserhRoleId;
    conn.query(
      `delete from users_has_roles where UserhRoleId=${UserhRoleId}`,
      (err, result) => {
        if (err) {
          res.json({ status: 500, message: "delete error" });
        } else {
          res.json({ status: 200, message: "delete success" });
        }
      }
    );
  },
  delete_teacherhsubject: (req, res) => {
    const TeacherHsubId = req.params.TeacherHsubId;
    conn.query(
      `delete from teacherhsubject where TeacherHsubId = ${TeacherHsubId}`,
      (err, result) => {
        if (err) {
          res.json({ status: 500, message: "delete error" });
        } else {
          res.json({ status: 200, message: "delete success" });
        }
      }
    );
  },
};
module.exports = uhr;
