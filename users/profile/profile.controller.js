const conn = require("../../config/database");
const path = require("path");
const fs = require("fs");

const profiles = {
  create: async (req, res) => {
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

        conn.query(
          "select UserId from Profiles where UserId=?",
          [req.body.UserId],
          (err, result) => {
            if (result.length) {
              console.log(result);
              res.json({
                status: "warning",
                message: "This User already exit...",
              });
            } else {
              const {
                FirstName,
                LastName,
                Gender,
                Dob,
                VillageName,
                DistrictId,
                ProvinceId,
              } = req.body;
              const image = req.file.filename;
              conn.query(
                "INSERT INTO Profiles ( FirstName,LastName,Gender,Dob,Img,VillageName,DistrictId,ProvinceId,UserId )values (?,?,?,?,?,?,?,?,?)",
                [
                  FirstName,
                  LastName,
                  Gender,
                  Dob,
                  image,
                  VillageName,
                  DistrictId,
                  ProvinceId,
                  req.session.UserId,
                ],
                (err, results) => {
                  if (err) {
                    console.log(err);
                    res.json({
                      status: "error",
                      message: "Error your code...",
                    });
                    return;
                  }
                  console.log(results);
                  res.json({
                    status: "ok",
                    message: "Insert Success Fully...",
                  });
                  return;
                }
              );
            }
          }
        );
      }
    );
  },
  findeAllByNewYear_by_useris: (req, res) => {
    const UserId = req.params.UserId;
    conn.query(
      "select a.*, b.*, DATE_FORMAT(b.dob,'%d/%m/%Y')as Dob, d.DistrictName, c.ProvinceName, aa.ProvinceName as RecentProvince, bb.DistrictName as RecentDistrict, a.UserId, a.UserName, a.Email, a.Mobile, f.RoleName, e.UserhRoleId, h.TermId as TeacherroomTermId, tt.TermName as TeacherroomTermName, g.TermId as TeacherHsubTermId, ss.TermName as TeacherHsubTermName, g.TeacherHsubId, g.UserhRoleId as TeacherSubject_UserhRoleId, g.ClassroomId as TeacherSubject_ClassroomId, j.ClassroomName as TeacherSubject_ClassroomName, i.SubjectName, h.TeacherroomId, h.UserhRoleId as TeacherRoom_UserhRoleId, h.ClassroomId as TeacherRoom_ClassroomId, k.ClassroomName as TeacherRoom_ClassroomName from Users as a left JOIN profiles as b ON a.UserId = b.UserId left JOIN Provinces as c ON b.ProvinceId = c.ProvinceId left JOIN Districts as d ON b.DistrictId = d.DistrictId left JOIN users_has_roles as e ON a.UserId = e.UserId left JOIN roles as f ON e.RoleId = f.RoleId LEFT JOIN teacherhsubject as g ON e.UserhRoleId = g.UserhRoleId LEFT JOIN teacherroom as h ON e.UserhRoleId = h.UserhRoleId LEFT JOIN subject as i ON g.SubjectId = i.SubjectId LEFT JOIN classroom as j ON g.ClassroomId = j.ClassroomId LEFT JOIN classroom as k ON h.ClassroomId = k.ClassroomId left join Provinces as aa on b.RecentProvinceId=aa.ProvinceId left join Districts as bb on b.RecentDistrictId=bb.DistrictId Left join school_term as tt on h.TermId=tt.TermId left join school_term as ss on g.TermId=ss.TermId where a.UserId=?",(UserId),
      (err, result) => {
        if (err) {
          res.send(err);
        }
        const newData = result.sort((a, b) => b.UserId - a.UserId).reduce((acc, current) => {
          const existingUserIndex = acc.findIndex((item) => item.UserId === current.UserId);
          if (existingUserIndex === -1) {
            const newUser = {
              ProfileId: current.ProfileId,
              FirstName: current.FirstName,
              LastName: current.LastName,
              Gender: current.Gender,
              Dob: current.Dob,
              Img: current.Img,
              VillageName: current.VillageName,
              DistrictName: current.DistrictName,
              ProvinceName: current.ProvinceName,
              DistrictId: current.DistrictId,
              ProvinceId: current.ProvinceId,
              UserId: current.UserId,
              UserName: current.UserName,
              Email: current.Email,
              Mobile: current.Mobile,
              RecentVillage: current.RecentVillage,
              RecentDistrict: current.RecentDistrict,
              RecentProvince: current.RecentProvince,
              Status: current.Status,
              Religion: current.Religion,
              Tribe: current.Tribe,
              Nationality: current.Nationality,
              GraSchoolGrade: current.GraSchoolGrade,
              Degree: current.Degree,
              Branch: current.Branch,
              CollegeName: current.CollegeName,
              JobStatus: current.JobStatus,
              TermName: current.TermName,
              Role: [{ UserhRoleId: current.UserhRoleId, RoleName: current.RoleName }],
              TeacherRoom: [],
              TeacherSubject: []
            };
            if (current.TeacherRoom_ClassroomName) {
              newUser.TeacherRoom.push({
                TeacherroomId: current.TeacherroomId,
                TeacherroomTermId: current.TeacherroomTermId,
                TeacherroomTermName: current.TeacherroomTermName,
                TeacherRoom_UserhRoleId: current.TeacherRoom_UserhRoleId,
                TeacherRoom_ClassroomId: current.TeacherRoom_ClassroomId,
                TeacherRoom_ClassroomName: current.TeacherRoom_ClassroomName
              }
              )
            }
            if (current.TeacherSubject_ClassroomName) {
              newUser.TeacherSubject.push({
                TeacherHsubId: current.TeacherHsubId,
                TeacherHsubTermId: current.TeacherHsubTermId,
                TeacherHsubTermName: current.TeacherHsubTermName,
                TeacherSubject_UserhRoleId: current.TeacherSubject_UserhRoleId,
                SubjectName: current.SubjectName,
                TeacherSubject_ClassroomName: current.TeacherSubject_ClassroomName
              });
            }
            acc.push(newUser);
          } else {
            const roleIndex = acc[existingUserIndex].Role.findIndex((item) => item.UserhRoleId === current.UserhRoleId);
            if (roleIndex === -1) {
              acc[existingUserIndex].Role.push({ UserhRoleId: current.UserhRoleId, RoleName: current.RoleName });
            }
            if (current.TeacherRoom_ClassroomName) {
              acc[existingUserIndex].TeacherRoom.push({
                TeacherroomId: current.TeacherroomId,
                TeacherroomTermId: current.TeacherroomTermId,
                TeacherroomTermName: current.TeacherroomTermName,
                TeacherRoom_UserhRoleId: current.TeacherRoom_UserhRoleId,
                TeacherRoom_ClassroomId: current.TeacherRoom_ClassroomId,
                TeacherRoom_ClassroomName: current.TeacherRoom_ClassroomName
              }
              )
            }
            if (current.TeacherSubject_ClassroomName) {
              acc[existingUserIndex].TeacherSubject.push({
                TeacherHsubId: current.TeacherHsubId,
                TeacherHsubTermId: current.TeacherHsubTermId,
                TeacherHsubTermName: current.TeacherHsubTermName,
                TeacherSubject_UserhRoleId: current.TeacherSubject_UserhRoleId,
                SubjectName: current.SubjectName,
                TeacherSubject_ClassroomName: current.TeacherSubject_ClassroomName
              });
            }
          }

          return acc;
        }, []);

        // res.json(newData);
        const teacherdatas = newData;
        const filteredTeacherDatas = teacherdatas.map(teacherdata => {
          const maxTeacherHsubTermId = Math.max(...teacherdata.TeacherSubject.map(t => t.TeacherHsubTermId), 0)
          const maxTeacherRoomTermId = Math.max(...teacherdata.TeacherRoom.map(t => t.TeacherroomTermId), 0)
        
          if (maxTeacherHsubTermId && maxTeacherHsubTermId < teacherdata.TeacherSubject[0].TeacherHsubTermId) {
            teacherdata.TeacherSubject = []
          } else if (teacherdata.TeacherSubject.length > 0) {
            teacherdata.TeacherSubject = teacherdata.TeacherSubject.filter(t => t.TeacherHsubTermId === maxTeacherHsubTermId)
          }
        
          if (maxTeacherRoomTermId && maxTeacherRoomTermId < teacherdata.TeacherRoom[0].TeacherroomTermId) {
            teacherdata.TeacherRoom = []
          } else if (teacherdata.TeacherRoom.length > 0) {
            teacherdata.TeacherRoom = teacherdata.TeacherRoom.filter(t => t.TeacherroomTermId === maxTeacherRoomTermId)
          }
        
          if (teacherdata.TeacherRoom === 0 && teacherdata.TeacherSubject.length === 0) {
            return null
          }
        
          return teacherdata
        }).filter(Boolean)
        
        res.json(filteredTeacherDatas[0])
        // console.log(filteredTeacherDatas[0])
      }
    );

  },
  findeAllByNewYear: (req, res) => {

    conn.query(
      "select a.*, b.*, DATE_FORMAT(b.dob,'%d/%m/%Y')as Dob, d.DistrictName, c.ProvinceName, aa.ProvinceName as RecentProvince, bb.DistrictName as RecentDistrict, a.UserId, a.UserName, a.Email, a.Mobile, f.RoleName, e.UserhRoleId, h.TermId as TeacherroomTermId, tt.TermName as TeacherroomTermName, g.TermId as TeacherHsubTermId, ss.TermName as TeacherHsubTermName, g.TeacherHsubId, g.UserhRoleId as TeacherSubject_UserhRoleId, g.ClassroomId as TeacherSubject_ClassroomId, j.ClassroomName as TeacherSubject_ClassroomName, i.SubjectName, h.TeacherroomId, h.UserhRoleId as TeacherRoom_UserhRoleId, h.ClassroomId as TeacherRoom_ClassroomId, k.ClassroomName as TeacherRoom_ClassroomName from Users as a left JOIN profiles as b ON a.UserId = b.UserId left JOIN Provinces as c ON b.ProvinceId = c.ProvinceId left JOIN Districts as d ON b.DistrictId = d.DistrictId left JOIN users_has_roles as e ON a.UserId = e.UserId left JOIN roles as f ON e.RoleId = f.RoleId LEFT JOIN teacherhsubject as g ON e.UserhRoleId = g.UserhRoleId LEFT JOIN teacherroom as h ON e.UserhRoleId = h.UserhRoleId LEFT JOIN subject as i ON g.SubjectId = i.SubjectId LEFT JOIN classroom as j ON g.ClassroomId = j.ClassroomId LEFT JOIN classroom as k ON h.ClassroomId = k.ClassroomId left join Provinces as aa on b.RecentProvinceId=aa.ProvinceId left join Districts as bb on b.RecentDistrictId=bb.DistrictId Left join school_term as tt on h.TermId=tt.TermId left join school_term as ss on g.TermId=ss.TermId",
      (err, result) => {
        if (err) {
          res.send(err);
        }
        const newData = result.sort((a, b) => b.UserId - a.UserId).reduce((acc, current) => {
          const existingUserIndex = acc.findIndex((item) => item.UserId === current.UserId);
          if (existingUserIndex === -1) {
            const newUser = {
              ProfileId: current.ProfileId,
              FirstName: current.FirstName,
              LastName: current.LastName,
              Gender: current.Gender,
              Dob: current.Dob,
              Img: current.Img,
              VillageName: current.VillageName,
              DistrictName: current.DistrictName,
              ProvinceName: current.ProvinceName,
              DistrictId: current.DistrictId,
              ProvinceId: current.ProvinceId,
              UserId: current.UserId,
              UserName: current.UserName,
              Email: current.Email,
              Mobile: current.Mobile,
              RecentVillage: current.RecentVillage,
              RecentDistrict: current.RecentDistrict,
              RecentProvince: current.RecentProvince,
              Status: current.Status,
              Religion: current.Religion,
              Tribe: current.Tribe,
              Nationality: current.Nationality,
              GraSchoolGrade: current.GraSchoolGrade,
              Degree: current.Degree,
              Branch: current.Branch,
              JobStatus: current.JobStatus,
              Role: [{ UserhRoleId: current.UserhRoleId, RoleName: current.RoleName }],
              TeacherRoom: [],
              TeacherSubject: []
            };
            if (current.TeacherRoom_ClassroomName) {
              newUser.TeacherRoom.push({
                TeacherroomId: current.TeacherroomId,
                TeacherroomTermId: current.TeacherroomTermId,
                TeacherroomTermName: current.TeacherroomTermName,
                TeacherRoom_UserhRoleId: current.TeacherRoom_UserhRoleId,
                TeacherRoom_ClassroomId: current.TeacherRoom_ClassroomId,
                TeacherRoom_ClassroomName: current.TeacherRoom_ClassroomName
              }
              )
            }
            if (current.TeacherSubject_ClassroomName) {
              newUser.TeacherSubject.push({
                TeacherHsubId: current.TeacherHsubId,
                TeacherHsubTermId: current.TeacherHsubTermId,
                TeacherHsubTermName: current.TeacherHsubTermName,
                TeacherSubject_UserhRoleId: current.TeacherSubject_UserhRoleId,
                SubjectName: current.SubjectName,
                TeacherSubject_ClassroomName: current.TeacherSubject_ClassroomName
              });
            }
            acc.push(newUser);
          } else {
            const roleIndex = acc[existingUserIndex].Role.findIndex((item) => item.UserhRoleId === current.UserhRoleId);
            if (roleIndex === -1) {
              acc[existingUserIndex].Role.push({ UserhRoleId: current.UserhRoleId, RoleName: current.RoleName });
            }
            if (current.TeacherRoom_ClassroomName) {
              acc[existingUserIndex].TeacherRoom.push({
                TeacherroomId: current.TeacherroomId,
                TeacherroomTermId: current.TeacherroomTermId,
                TeacherroomTermName: current.TeacherroomTermName,
                TeacherRoom_UserhRoleId: current.TeacherRoom_UserhRoleId,
                TeacherRoom_ClassroomId: current.TeacherRoom_ClassroomId,
                TeacherRoom_ClassroomName: current.TeacherRoom_ClassroomName
              }
              )
            }
            if (current.TeacherSubject_ClassroomName) {
              acc[existingUserIndex].TeacherSubject.push({
                TeacherHsubId: current.TeacherHsubId,
                TeacherHsubTermId: current.TeacherHsubTermId,
                TeacherHsubTermName: current.TeacherHsubTermName,
                TeacherSubject_UserhRoleId: current.TeacherSubject_UserhRoleId,
                SubjectName: current.SubjectName,
                TeacherSubject_ClassroomName: current.TeacherSubject_ClassroomName
              });
            }
          }

          return acc;
        }, []);

        // res.json(newData);
        const teacherdatas = newData;
        const filteredTeacherDatas = teacherdatas.map(teacherdata => {
          const maxTeacherHsubTermId = Math.max(...teacherdata.TeacherSubject.map(t => t.TeacherHsubTermId), 0)
          const maxTeacherRoomTermId = Math.max(...teacherdata.TeacherRoom.map(t => t.TeacherroomTermId), 0)
        
          if (maxTeacherHsubTermId && maxTeacherHsubTermId < teacherdata.TeacherSubject[0].TeacherHsubTermId) {
            teacherdata.TeacherSubject = []
          } else if (teacherdata.TeacherSubject.length > 0) {
            teacherdata.TeacherSubject = teacherdata.TeacherSubject.filter(t => t.TeacherHsubTermId === maxTeacherHsubTermId)
          }
        
          if (maxTeacherRoomTermId && maxTeacherRoomTermId < teacherdata.TeacherRoom[0].TeacherroomTermId) {
            teacherdata.TeacherRoom = []
          } else if (teacherdata.TeacherRoom.length > 0) {
            teacherdata.TeacherRoom = teacherdata.TeacherRoom.filter(t => t.TeacherroomTermId === maxTeacherRoomTermId)
          }
        
          if (teacherdata.TeacherRoom === 0 && teacherdata.TeacherSubject.length === 0) {
            return null
          }
        
          return teacherdata
        }).filter(Boolean)
        
        res.json(filteredTeacherDatas)
      }
    );

  },
  findeAll: (req, res) => {
    const UserId = req.params.UserId;


    conn.query(
      "select a.*, b.*, DATE_FORMAT(b.dob,'%d/%m/%Y')as Dob, d.DistrictName, c.ProvinceName, aa.ProvinceName as RecentProvince, bb.DistrictName as RecentDistrict, a.UserId, a.UserName, a.Email, a.Mobile, f.RoleName, e.UserhRoleId, g.TeacherHsubId, g.UserhRoleId as TeacherSubject_UserhRoleId, g.ClassroomId as TeacherSubject_ClassroomId, j.ClassroomName as TeacherSubject_ClassroomName, i.SubjectName, h.TeacherroomId, h.UserhRoleId as TeacherRoom_UserhRoleId, h.ClassroomId as TeacherRoom_ClassroomId, k.ClassroomName as TeacherRoom_ClassroomName from Users as a left JOIN profiles as b ON a.UserId = b.UserId left JOIN Provinces as c ON b.ProvinceId = c.ProvinceId left JOIN Districts as d ON b.DistrictId = d.DistrictId left JOIN users_has_roles as e ON a.UserId = e.UserId left JOIN roles as f ON e.RoleId = f.RoleId LEFT JOIN teacherhsubject as g ON e.UserhRoleId = g.UserhRoleId LEFT JOIN teacherroom as h ON e.UserhRoleId = h.UserhRoleId LEFT JOIN subject as i ON g.SubjectId = i.SubjectId LEFT JOIN classroom as j ON g.ClassroomId = j.ClassroomId LEFT JOIN classroom as k ON h.ClassroomId = k.ClassroomId left join Provinces as aa on b.RecentProvinceId=aa.ProvinceId left join Districts as bb on b.RecentDistrictId=bb.DistrictId",
      (err, result) => {
        if (err) {
          res.send(err);
        }

        // const transformedData = data
        // .filter((item) => item.Name !== null)
        // .reduce((result, item) => {
        //   const existingItem = result.find((i) => i.UserId === item.UserId);
        //   if (existingItem) {
        //   existingItem.Name = item.Name;
        //   } else {result.push({ UserId: item.UserId, Name: item.Name });
        // }
        //   return result;
        // }, []);
        const newData = result.sort((a, b) => b.UserId - a.UserId).reduce((acc, current) => {
          const existingUserIndex = acc.findIndex((item) => item.UserId === current.UserId);
          if (existingUserIndex === -1) {
            const newUser = {
              ProfileId: current.ProfileId,
              FirstName: current.FirstName,
              LastName: current.LastName,
              Gender: current.Gender,
              Dob: current.Dob,
              Img: current.Img,
              VillageName: current.VillageName,
              DistrictName: current.DistrictName,
              ProvinceName: current.ProvinceName,
              DistrictId: current.DistrictId,
              ProvinceId: current.ProvinceId,
              UserId: current.UserId,
              UserName: current.UserName,
              Email: current.Email,
              Mobile: current.Mobile,
              RecentVillage: current.RecentVillage,
              RecentDistrict: current.RecentDistrict,
              RecentProvince: current.RecentProvince,
              Status: current.Status,
              Religion: current.Religion,
              Tribe: current.Tribe,
              Nationality: current.Nationality,
              GraSchoolGrade: current.GraSchoolGrade,
              Degree: current.Degree,
              Branch: current.Branch,
              JobStatus: current.JobStatus,
              Role: [{ UserhRoleId: current.UserhRoleId, RoleName: current.RoleName }],
              TeacherRoom: [],
              TeacherSubject: []
            };
            if (current.TeacherRoom_ClassroomName) {
              newUser.TeacherRoom.push({
                TeacherroomId: current.TeacherroomId,
                TeacherRoom_UserhRoleId: current.TeacherRoom_UserhRoleId,
                TeacherRoom_ClassroomId: current.TeacherRoom_ClassroomId,
                TeacherRoom_ClassroomName: current.TeacherRoom_ClassroomName
              }
              )
            }
            if (current.TeacherSubject_ClassroomName) {
              newUser.TeacherSubject.push({
                TeacherHsubId: current.TeacherHsubId,
                TeacherSubject_UserhRoleId: current.TeacherSubject_UserhRoleId,
                SubjectName: current.SubjectName,
                TeacherSubject_ClassroomName: current.TeacherSubject_ClassroomName
              });
            }
            acc.push(newUser);
          } else {
            const roleIndex = acc[existingUserIndex].Role.findIndex((item) => item.UserhRoleId === current.UserhRoleId);
            if (roleIndex === -1) {
              acc[existingUserIndex].Role.push({ UserhRoleId: current.UserhRoleId, RoleName: current.RoleName });
            }
            if (current.TeacherRoom_ClassroomName) {
              acc[existingUserIndex].TeacherRoom.push({
                TeacherroomId: current.TeacherroomId,
                TeacherRoom_UserhRoleId: current.TeacherRoom_UserhRoleId,
                TeacherRoom_ClassroomId: current.TeacherRoom_ClassroomId,
                TeacherRoom_ClassroomName: current.TeacherRoom_ClassroomName
              }
              )
            }
            if (current.TeacherSubject_ClassroomName) {
              acc[existingUserIndex].TeacherSubject.push({
                TeacherHsubId: current.TeacherHsubId,
                TeacherSubject_UserhRoleId: current.TeacherSubject_UserhRoleId,
                SubjectName: current.SubjectName,
                TeacherSubject_ClassroomName: current.TeacherSubject_ClassroomName
              });
            }
          }

          return acc;
        }, []);

        res.json(newData);

      }
    );
  },
  findeAllProfile: (req, res) => {
    conn.query(
      "select b.ProfileId,b.FirstName,b.LastName,b.Gender,DATE_FORMAT(b.dob,'%d/%m/%Y')as Dob,b.Img,a.UserId,a.UserName,a.Email,a.Mobile,c.ProvinceName,d.DistrictName,b.VillageName from Users as a,Provinces as c,Districts as d,Profiles as b where a.UserId=b.UserId and b.ProvinceId=c.ProvinceId and b.DistrictId=d.DistrictId order by ProfileId desc",
      (err, result) => {
        if (err) {
          res.send(err);
        }
        res.json(result);
      }
    );
  },
  findeOne: async (req, res) => {
    const UserId = req.params.UserId;
    conn.query(
      "select b.*,DATE_FORMAT(b.dob,'%d/%m/%Y')as Dob,a.*,c.*,d.*,b.VillageName from Users as a,Provinces as c,Districts as d,Profiles as b where a.UserId=b.UserId and b.ProvinceId=c.ProvinceId and b.DistrictId=d.DistrictId and ProfileId=?",
      [UserId],
      (err, results) => {
        if (err) {
          console.log(err);
          return res.status(303).json({ Message: "Error any code..." });
        }
        res.json(results[0]);
      }
    );
  },
  updateprofile: async (req, res) => {
    try {
      conn.query(
        "UPDATE Profiles SET FirstName=?,LastName=?,Gender=?,Dob=?,VillageName=?,DistrictId=?,ProvinceId=?,updatedAt=curdate() where ProfileId=?",
        [
          req.body.FirstName,
          req.body.LastName,
          req.body.Gender,
          req.body.Dob,
          req.body.VillageName,
          req.body.DistrictId,
          req.body.ProvinceId,
          req.body.ProfileId,
        ],
        (err, results) => {
          if (err) {
            console.log(err);
            return res
              .status(300)
              .json({ status: "error", message: "Error your code..." });
          }
          conn.query(
            "select UserName from Users as a, Profiles as b where a.UserId=b.UserId and b.ProfileId=?",
            [req.body.ProfileId],
            (err, UserName) => {
              if (err) throw err;
              return res
                .status(201)
                .json({
                  status: "ok",
                  data: results,
                  message: "ແກ້ໄຂຂໍ້ມູນໂປຣຟາຍຂອງ " + UserName[0].UserName,
                });
            }
          );
        }
      );
    } catch (error) {
      console.log(err);
      return res.status(500).send();
    }
  },
  DeleteUserAndeProfiles: async (req, res) => {
    //set foreign key in mysql
    const sql = "set foreign_key_checks=0";
    conn.query(sql);
    const ProfileId = req.params.ProfileId;
    conn.query(
      "select UserId from Profiles where ProfileId=?",
      [ProfileId],
      (err, user, result) => {
        if (err) {
          res.send(err);
        }
        if (user.length === 0) {
          res.json({ status: "warnning", message: "no search" });
        } else {
          req.session.userid = user[0].UserId;
          const sql = "set foreign_key_checks=0";
          conn.query(sql);

          conn.query(
            "select Img from profiles where ProfileId=?",
            [ProfileId],
            (err, img, result) => {
              if (err) throw err;
              conn.query(
                "DELETE FROM Users where UserId=?",
                [req.session.userid],
                (err, result) => {
                  if (err) {
                    console.log("DELETE Error", err);
                    return;
                  }

                  // delete Profiles

                  conn.query(
                    "DELETE FROM Profiles WHERE UserId=?",
                    [req.session.userid],
                    (err, results) => {
                      if (err) {
                        console.log(err);
                        return res
                          .status(303)
                          .json({ status: "ok", Message: "Error any code..." });
                      }
                      conn.query(
                        "DELETE FROM Users_has_Roles WHERE UserId=?",
                        [req.session.userid],
                        (err, results) => {
                          if (err) {
                            console.log(err);
                            return res
                              .status(303)
                              .json({
                                status: "ok",
                                Message: "Error any code...",
                              });
                          }
                          fs.unlink("public/img/" + img[0].Img, function (err) {
                            if (err) throw err;
                            res.json({ status: "ok", message: "Deleted...." });
                          });
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      }
    );
  },
  updateOnly: (req, res) => {
    try {
      // res.json(avatar[0])

      conn.query(
        "select Img from Profiles where UserId=?",
        [req.body.UserId],
        (err, avatar, result) => {
          if (err) {
            res.send(err);
          }
          // res.json(avatar[0])
          conn.query(
            "update Profiles set Img=?,updatedAt=curdate() where UserId=?",
            [req.file.filename, req.body.UserId],
            (err, result) => {
              if (err) {
                res.send("err", err);
              }
              // res.json(avatar[0])
              console.log("Update Profile Only success....");
              fs.unlink("public/img/" + avatar[0].Img, function (err) {
                if (err) throw err;
                res.json({
                  status: "ok",
                  message: "Update Profile Only success....",
                });
              });
            }
          );
        }
      );
    } catch (err) {
      if (err.code == "LIMIT_FILE_SIZE") {
        return res.status(500).send({
          message: "File size cannot be larger than 2MB!",
          err,
        });
      } else if (err.code == "ENOENT") {
        return res.status(500).send({
          message: "already exist...",
          err,
        });
      } else {
        res.status(500).send({
          message: `Could not upload the file: `,
          err,
        });
      }
    }
  },
  updateFirstName: (req, res) => {
    conn.query(
      "update Profiles set FirstName=? where ProfileId=?",
      [req.body, FirstName, req.body.ProfileId],
      (err, result) => {
        if (err) {
          res.send("err", err);
        }
        console.log("Update Profile Only success....");
        res.json({ status: "ok", message: "Update Profile Only success...." });
      }
    );
  },
  findeImg: async (req, res) => {
    try {
      const ProfileId = req.params.ProfileId;

      conn.query(
        "select Img from Profiles where ProfileId=?",
        [ProfileId],
        (err, img, results) => {
          if (err) {
            console.log(err);
            return res
              .status(303)
              .json({ status: "ok", Message: "Error any code..." });
          }
          if (img.length == 0) {
            res.send({ status: "warrnning", message: "no search...." });
          } else {
            res.sendFile(
              path.join(__dirname, "../../public/img/" + img[0].Img)
            );
          }
        }
      );
    } catch (Error) {
      if (Error.code == "ENOENT") {
        return res.status(500).send({
          message: "already exist...",
          err,
        });
      } else {
        res.status(500).send({
          message: `Could not upload the file: `,
          err,
        });
      }
    }
  },
  getdistrict: async (req, res) => {
    try {
      const ProvinceId = req.params.ProvinceId;

      conn.query(
        "select b.*,a.* from Provinces as a, Districts as b where a.ProvinceId=b.ProvinceId and a.ProvinceId=?;",
        [ProvinceId],
        (err, results) => {
          if (err) {
            console.log(err);
            return res
              .status(303)
              .json({ status: "ok", Message: "Error any code..." });
          }
          res.status(404).json(results);
        }
      );
    } catch (err) {
      console.log(err);
      return res.status(500).send();
    }
  },
  getimg: (req, res) => {
    conn.query("select*from profiles", (err, result) => {
      if (err) {
        res.send("err", err);
      }
      res.json(result);
    });
  },
  insert: (req, res) => {
    const { Status, RecentVillage, RecentDistrictId, RecentProvinceId, Religion, Tribe, Nationality, GraSchoolGrade, Degree, Branch, CollegeName, TermName, JobStatus, ProfileId } = req.body;
    conn.query("update Profiles set Status=?, RecentVillage=?, RecentDistrictId=?, RecentProvinceId=?, Religion=?, Tribe=?, Nationality=?, GraSchoolGrade=?, Degree=?, Branch=?, CollegeName=?, TermName=?, JobStatus=? where ProfileId=?", [Status, RecentVillage, RecentDistrictId, RecentProvinceId, Religion, Tribe, Nationality, GraSchoolGrade, Degree, Branch, CollegeName, TermName, JobStatus, ProfileId], (err, result) => {
      if (err) {
        res.json({ status: 500, message: 'errr' })
      } else {
        res.json({ status: 200, message: "insert success...." })
      }
    })
  },
  findMax: (req, res) => {
    conn.query("select a.*, e.UserId, j.ProfileId,j.FirstName, j.LastName, c.ClassroomId, c.ClassroomName, g.RoleId,g.RoleName, h.SubjectId, h.SubjectName, b.TermId,b.TermName, f.UserhRoleId from teacherhsubject as a, school_term as b, classroom as c, users as e, users_has_roles as f, roles as g, subject as h, profiles as j where a.TermId=b.TermId and a.ClassroomId=c.ClassroomId and a.UserhRoleId=f.UserhRoleId and e.UserId=f.UserId and f.RoleId=g.RoleId and a.SubjectId=h.SubjectId and e.UserId=j.UserId and a.TermId=(select max(termid) from teacherhsubject)", (err, result) => {
      if (err) throw err;
      const data = result;
      const teachernew = Object.values(data.reduce((acc, curr) => {
        const key = `${curr.UserId}-${curr.ProfileId}-${curr.FirstName}-${curr.LastName}-${curr.RoleId}-${curr.SubjectId}-${curr.TermId}`;
        if (!acc[key]) {
          acc[key] = {
            ...curr,
            ClassroomName: [curr.ClassroomName],
            SubjectName: [curr.SubjectName]
          };
        } else {
          acc[key].ClassroomName.push(curr.ClassroomName);
          acc[key].SubjectName.push(curr.SubjectName);
        }
        return acc;
      }, {})).map(({ ClassroomName, SubjectName, ...rest }) => ({
        ...rest,
        ClassroomName: [...new Set(ClassroomName)],
        SubjectName: [...new Set(SubjectName)]
      }));

      conn.query("select a.*, e.UserId, j.ProfileId,j.FirstName, j.LastName, c.ClassroomId, c.ClassroomName, g.RoleId,g.RoleName, h.SubjectId, h.SubjectName, b.TermId,b.TermName from teacherhsubject as a, school_term as b, classroom as c, users as e, users_has_roles as f, roles as g, subject as h, profiles as j where a.TermId=b.TermId and a.ClassroomId=c.ClassroomId and a.UserhRoleId=f.UserhRoleId and e.UserId=f.UserId and f.RoleId=g.RoleId and a.SubjectId=h.SubjectId and e.UserId=j.UserId and a.TermId < (select max(termid) from teacherhsubject)", (err, result) => {
        if (err) throw err;
        const data1 = result;
        const teacherold = Object.values(data1.reduce((acc, curr) => {
          const key = `${curr.UserId}-${curr.ProfileId}-${curr.FirstName}-${curr.LastName}-${curr.RoleId}-${curr.SubjectId}-${curr.TermId}-${curr.TermName}`;
          if (!acc[key]) {
            acc[key] = {
              ...curr,
              ClassroomName: [curr.ClassroomName],
              SubjectName: [curr.SubjectName]
            };
          } else {
            acc[key].ClassroomName.push(curr.ClassroomName);
            acc[key].SubjectName.push(curr.SubjectName);
          }
          return acc;
        }, {})).map(({ ClassroomName, SubjectName, ...rest }) => ({
          ...rest,
          ClassroomName: [...new Set(ClassroomName)],
          SubjectName: [...new Set(SubjectName)]
        }));

        const output = [];

        teachernew.forEach((newTeacher) => {
          const {
            UserId,
            ProfileId,
            FirstName,
            LastName,
            ClassroomName,
            ClassroomId,
            RoleId,
            RoleName,
            TermName,
            SubjectName,
            SubjectId,
          } = newTeacher;

          const teacherSubject = [];

          const oldTeacher = teacherold.find((t) => t.UserId === UserId);

          if (oldTeacher) {
            const teacherRoleId = teacherold.find((t) => t.UserId === UserId && t.RoleName === "tearcherSubject").UserhRoleId;

            output.push({
              UserId,
              ProfileId,
              FirstName,
              LastName,
              ClassroomName,
              ClassroomId,
              TeacherroomId: null,
              TeacherRoom_UserhRoleId: null,
              TeacherRoom_ClassroomName: null,
              RoleId,
              RoleName,
              TermId: null,
              TermName,
              Gender: "male",
              Role: [
                { UserhRoleId: 1, RoleName: "admin" },
                { UserhRoleId: teacherRoleId, RoleName: "tearcherSubject" },
              ],
              TeacherSubject: teacherSubject,
            });

            SubjectName.forEach((subjectName, index) => {
              if (oldTeacher.SubjectName.includes(subjectName)) {
                const classroomId = oldTeacher.ClassroomId instanceof Array ? oldTeacher.ClassroomId[oldTeacher.SubjectName.indexOf(subjectName)] : oldTeacher.ClassroomId;
                const classroomName = oldTeacher.ClassroomName[oldTeacher.SubjectName.indexOf(subjectName)];
                const teacherSubjectClassroomName = ClassroomName instanceof Array ? ClassroomName[SubjectName.indexOf(subjectName)] : ClassroomName;
                const subjectId = SubjectId[index];

                teacherSubject.push({
                  TeacherHsubId: oldTeacher.TeacherHsubId[oldTeacher.SubjectName.indexOf(subjectName)],
                  TeacherSubject_UserhRoleId: teacherRoleId,
                  SubjectName: subjectName,
                  ClassroomId: classroomId,
                  TeacherSubject_ClassroomName: classroomName,
                  TeacherSubjectroomName: teacherSubjectClassroomName,
                  SubjectId: subjectId,
                });
              }
            });
          } else {
            output.push({
              UserId,
              ProfileId,
              FirstName,
              LastName,
              Gender: "male",
              ClassroomName,
              ClassroomId,
              TeacherroomId: null,
              TeacherRoom_UserhRoleId: null,
              TeacherRoom_ClassroomName: null,
              Role: [
                { UserhRoleId: 1, RoleName: "admin" },
                { UserhRoleId: 16, RoleName: "tearcherSubject" },
              ],
              TeacherSubject: [],
            });
          }
        });

        res.json(output)

      })
    })


  },
  teacherroomOnly: (req, res) => {
    conn.query(
      "select a.*, b.*, DATE_FORMAT(b.dob,'%d/%m/%Y')as Dob, d.DistrictName, c.ProvinceName, aa.ProvinceName as RecentProvince, bb.DistrictName as RecentDistrict, a.UserId, a.UserName, a.Email, a.Mobile, f.RoleName, e.UserhRoleId, h.TermId as TeacherroomTermId, tt.TermName as TeacherroomTermName, g.TermId as TeacherHsubTermId, ss.TermName as TeacherHsubTermName, g.TeacherHsubId, g.UserhRoleId as TeacherSubject_UserhRoleId, g.ClassroomId as TeacherSubject_ClassroomId, j.ClassroomName as TeacherSubject_ClassroomName, i.SubjectName, h.TeacherroomId, h.UserhRoleId as TeacherRoom_UserhRoleId, h.ClassroomId as TeacherRoom_ClassroomId, k.ClassroomName as TeacherRoom_ClassroomName from Users as a left JOIN profiles as b ON a.UserId = b.UserId left JOIN Provinces as c ON b.ProvinceId = c.ProvinceId left JOIN Districts as d ON b.DistrictId = d.DistrictId left JOIN users_has_roles as e ON a.UserId = e.UserId left JOIN roles as f ON e.RoleId = f.RoleId LEFT JOIN teacherhsubject as g ON e.UserhRoleId = g.UserhRoleId LEFT JOIN teacherroom as h ON e.UserhRoleId = h.UserhRoleId LEFT JOIN subject as i ON g.SubjectId = i.SubjectId LEFT JOIN classroom as j ON g.ClassroomId = j.ClassroomId LEFT JOIN classroom as k ON h.ClassroomId = k.ClassroomId left join Provinces as aa on b.RecentProvinceId=aa.ProvinceId left join Districts as bb on b.RecentDistrictId=bb.DistrictId Left join school_term as tt on h.TermId=tt.TermId left join school_term as ss on g.TermId=ss.TermId where e.RoleId=11",
      (err, result) => {
        if (err) {
          res.send(err);
        }
        const newData = result.sort((a, b) => b.UserId - a.UserId).reduce((acc, current) => {
          const existingUserIndex = acc.findIndex((item) => item.UserId === current.UserId);
          if (existingUserIndex === -1) {
            const newUser = {
              ProfileId: current.ProfileId,
              FirstName: current.FirstName,
              LastName: current.LastName,
              Gender: current.Gender,
              Dob: current.Dob,
              Img: current.Img,
              VillageName: current.VillageName,
              DistrictName: current.DistrictName,
              ProvinceName: current.ProvinceName,
              DistrictId: current.DistrictId,
              ProvinceId: current.ProvinceId,
              UserId: current.UserId,
              UserName: current.UserName,
              Email: current.Email,
              Mobile: current.Mobile,
              RecentVillage: current.RecentVillage,
              RecentDistrict: current.RecentDistrict,
              RecentProvince: current.RecentProvince,
              Status: current.Status,
              Religion: current.Religion,
              Tribe: current.Tribe,
              Nationality: current.Nationality,
              GraSchoolGrade: current.GraSchoolGrade,
              Degree: current.Degree,
              Branch: current.Branch,
              CollegeName: current.CollegeName,
              JobStatus: current.JobStatus,
              TermName: current.TermName,
              Role: [{ UserhRoleId: current.UserhRoleId, RoleName: current.RoleName }],
              TeacherRoom: [],
              TeacherSubject: []
            };
            if (current.TeacherRoom_ClassroomName) {
              newUser.TeacherRoom.push({
                TeacherroomId: current.TeacherroomId,
                TeacherroomTermId: current.TeacherroomTermId,
                TeacherroomTermName: current.TeacherroomTermName,
                TeacherRoom_UserhRoleId: current.TeacherRoom_UserhRoleId,
                TeacherRoom_ClassroomId: current.TeacherRoom_ClassroomId,
                TeacherRoom_ClassroomName: current.TeacherRoom_ClassroomName
              }
              )
            }
            if (current.TeacherSubject_ClassroomName) {
              newUser.TeacherSubject.push({
                TeacherHsubId: current.TeacherHsubId,
                TeacherHsubTermId: current.TeacherHsubTermId,
                TeacherHsubTermName: current.TeacherHsubTermName,
                TeacherSubject_UserhRoleId: current.TeacherSubject_UserhRoleId,
                SubjectName: current.SubjectName,
                TeacherSubject_ClassroomName: current.TeacherSubject_ClassroomName
              });
            }
            acc.push(newUser);
          } else {
            const roleIndex = acc[existingUserIndex].Role.findIndex((item) => item.UserhRoleId === current.UserhRoleId);
            if (roleIndex === -1) {
              acc[existingUserIndex].Role.push({ UserhRoleId: current.UserhRoleId, RoleName: current.RoleName });
            }
            if (current.TeacherRoom_ClassroomName) {
              acc[existingUserIndex].TeacherRoom.push({
                TeacherroomId: current.TeacherroomId,
                TeacherroomTermId: current.TeacherroomTermId,
                TeacherroomTermName: current.TeacherroomTermName,
                TeacherRoom_UserhRoleId: current.TeacherRoom_UserhRoleId,
                TeacherRoom_ClassroomId: current.TeacherRoom_ClassroomId,
                TeacherRoom_ClassroomName: current.TeacherRoom_ClassroomName
              }
              )
            }
            if (current.TeacherSubject_ClassroomName) {
              acc[existingUserIndex].TeacherSubject.push({
                TeacherHsubId: current.TeacherHsubId,
                TeacherHsubTermId: current.TeacherHsubTermId,
                TeacherHsubTermName: current.TeacherHsubTermName,
                TeacherSubject_UserhRoleId: current.TeacherSubject_UserhRoleId,
                SubjectName: current.SubjectName,
                TeacherSubject_ClassroomName: current.TeacherSubject_ClassroomName
              });
            }
          }

          return acc;
        }, []);

        // res.json(newData);
        const teacherdatas = newData;
        const filteredTeacherDatas = teacherdatas.map(teacherdata => {
          const maxTeacherHsubTermId = Math.max(...teacherdata.TeacherSubject.map(t => t.TeacherHsubTermId), 0)
          const maxTeacherRoomTermId = Math.max(...teacherdata.TeacherRoom.map(t => t.TeacherroomTermId), 0)
        
          if (maxTeacherHsubTermId && maxTeacherHsubTermId < teacherdata.TeacherSubject[0].TeacherHsubTermId) {
            teacherdata.TeacherSubject = []
          } else if (teacherdata.TeacherSubject.length > 0) {
            teacherdata.TeacherSubject = teacherdata.TeacherSubject.filter(t => t.TeacherHsubTermId === maxTeacherHsubTermId)
          }
        
          if (maxTeacherRoomTermId && maxTeacherRoomTermId < teacherdata.TeacherRoom[0].TeacherroomTermId) {
            teacherdata.TeacherRoom = []
          } else if (teacherdata.TeacherRoom.length > 0) {
            teacherdata.TeacherRoom = teacherdata.TeacherRoom.filter(t => t.TeacherroomTermId === maxTeacherRoomTermId)
          }
        
          if (teacherdata.TeacherRoom === 0 && teacherdata.TeacherSubject.length === 0) {
            return null
          }
        
          return teacherdata
        }).filter(Boolean)
        
        res.json(filteredTeacherDatas)
      }
    );
}
}
module.exports = profiles;
