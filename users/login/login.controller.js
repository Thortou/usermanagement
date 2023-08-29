const conn = require("../../config/database");

const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Login = {
  getLogin: async (req, res) => {

    try {
      const UserName = req.body.UserName
      const Password = req.body.Password
      const sqlQuery = "SELECT a.*, b.*,DATE_FORMAT(a.createdAt,'%d-%m-%Y')as createdAt,DATE_FORMAT(b.updatedAt,'%d-%m-%Y')as updatedAt,DATE_FORMAT(b.dob,'%d-%m-%Y')as Dob, c.*, d.*, e.* FROM users as a INNER JOIN profiles as b ON a.UserId = b.UserId INNER JOIN provinces as c ON b.ProvinceId = c.ProvinceId INNER JOIN districts as d ON b.DistrictId = d.DistrictId INNER JOIN users_has_roles as e ON a.UserId = e.UserId INNER JOIN roles as f ON e.RoleId = f.RoleId WHERE a.UserName = ? OR a.Mobile = ? OR a.Email = ?"
      conn.query(sqlQuery, [UserName, UserName, UserName],
        function (err, result, fields) {
          if (err) {
            res.json({ status: "err", message: err });
            return;
          }
          if (result.length == 0) {
            res.json({ status: "noUser", message: "No User.." });
            return;
          }
          bcrypt.compare(
            Password,
            result[0].Password,
            function (err, isLogin) {
              if (isLogin) {
                //
                req.session.UserId = result[0].UserId;

                conn.query(`select c.RoleName from users as a, users_has_roles as b, roles as c where a.UserId=b.UserId and b.RoleId=c.RoleId and a.UserId=?`, [req.session.UserId], (err, results) => {
                  if (err) throw err;
                  //map role
                  const myRoles = results.map((info) => ({
                    name: info.RoleName
                  }));

                  let role = [];
                  for (var i in myRoles) {
                    role.push(myRoles[i].name)
                  }
                  // check roles
                  const data = {
                    UserId: result[0].UserId,
                    UserName: result[0].UserName,
                    Email: result[0].Email,
                    Mobile: result[0].Mobile,
                    ProfileId: result[0].ProfileId,
                    FirstName: result[0].FirstName,
                    LastName: result[0].LastName,
                    Gender: result[0].Gender,
                    Dob: result[0].Dob,
                    Img: result[0].Img,
                    VillageName: result[0].VillageName,
                    DistrictName: result[0].DistrictName,
                    ProvinceName: result[0].ProvinceName,
                    RoleName: role
                  }
                  if (data.RoleName.indexOf('tearcherSubject') !== -1 && data.RoleName.indexOf('teacherRoom') !== -1 && data.RoleName.indexOf('womenLeader') !== -1) {
                    var token = jwt.sign(
                      {
                        UserId: result[0].UserId,
                        UserName: result[0].UserName,
                        Email: result[0].Email,
                        Mobile: result[0].Mobile,
                        ProfileId: result[0].ProfileId,
                        FirstName: result[0].FirstName,
                        LastName: result[0].LastName,
                        Gender: result[0].Gender,
                        Dob: result[0].Dob,
                        Img: result[0].Img,
                        VillageName: result[0].VillageName,
                        DistrictName: result[0].DistrictName,
                        ProvinceName: result[0].ProvinceName,
                        status: 1
                      },
                      "secret1",
                      { expiresIn: "24h" }
                    );
                    // console.log(data)
                    res.json({ status: 'ok', message: 'yes1', token })
                  } else if (data.RoleName.indexOf('tearcherSubject') !== -1 && data.RoleName.indexOf('teacherRoom') !== -1 && data.RoleName.indexOf('youthLeader') !== -1) {
                    var token = jwt.sign(
                      {
                        UserId: result[0].UserId,
                        UserName: result[0].UserName,
                        Email: result[0].Email,
                        Mobile: result[0].Mobile,
                        ProfileId: result[0].ProfileId,
                        FirstName: result[0].FirstName,
                        LastName: result[0].LastName,
                        Gender: result[0].Gender,
                        Dob: result[0].Dob,
                        Img: result[0].Img,
                        VillageName: result[0].VillageName,
                        DistrictName: result[0].DistrictName,
                        ProvinceName: result[0].ProvinceName,
                        status: 2
                      },
                      "secret1",
                      { expiresIn: "3h" }
                    );
                    res.json({ status: 'ok', message: 'yes2', token })
                  } else if (data.RoleName.indexOf('tearcherSubject') !== -1 && data.RoleName.indexOf('teacherRoom') !== -1) {
                    var token = jwt.sign(
                      {
                        UserId: result[0].UserId,
                        UserName: result[0].UserName,
                        Email: result[0].Email,
                        Mobile: result[0].Mobile,
                        ProfileId: result[0].ProfileId,
                        FirstName: result[0].FirstName,
                        LastName: result[0].LastName,
                        Gender: result[0].Gender,
                        Dob: result[0].Dob,
                        Img: result[0].Img,
                        VillageName: result[0].VillageName,
                        DistrictName: result[0].DistrictName,
                        ProvinceName: result[0].ProvinceName,
                        status: 3
                      },
                      "secret1",
                      { expiresIn: "3h" }
                    );
                    res.json({ status: 'ok', message: 'yes3', token })
                  } else if (data.RoleName.indexOf('admin') !== -1 && data.RoleName.indexOf('teacherRoom')) {
                    var token = jwt.sign(
                      {
                        UserId: result[0].UserId,
                        UserName: result[0].UserName,
                        Email: result[0].Email,
                        Mobile: result[0].Mobile,
                        ProfileId: result[0].ProfileId,
                        FirstName: result[0].FirstName,
                        LastName: result[0].LastName,
                        Gender: result[0].Gender,
                        Dob: result[0].Dob,
                        Img: result[0].Img,
                        VillageName: result[0].VillageName,
                        DistrictName: result[0].DistrictName,
                        ProvinceName: result[0].ProvinceName,
                        status: 4
                      },
                      "secret1",
                      { expiresIn: "3h" }
                    );
                    res.json({ status: 'ok', message: 'yes4', token })
                  } else if (data.RoleName.indexOf('tearcherSubject') !== -1 && data.RoleName.indexOf('youthLeader') !== -1) {
                    var token = jwt.sign(
                      {
                        UserId: result[0].UserId,
                        UserName: result[0].UserName,
                        Email: result[0].Email,
                        Mobile: result[0].Mobile,
                        ProfileId: result[0].ProfileId,
                        FirstName: result[0].FirstName,
                        LastName: result[0].LastName,
                        Gender: result[0].Gender,
                        Dob: result[0].Dob,
                        Img: result[0].Img,
                        VillageName: result[0].VillageName,
                        DistrictName: result[0].DistrictName,
                        ProvinceName: result[0].ProvinceName,
                        status: 5
                      },
                      "secret1",
                      { expiresIn: "3h" }
                    );
                    res.json({ status: 'ok', message: 'yes5', token })
                  } else if (data.RoleName.indexOf('tearcherSubject') !== -1 && data.RoleName.indexOf('womenLeader') !== -1) {
                    var token = jwt.sign(
                      {
                        UserId: result[0].UserId,
                        UserName: result[0].UserName,
                        Email: result[0].Email,
                        Mobile: result[0].Mobile,
                        ProfileId: result[0].ProfileId,
                        FirstName: result[0].FirstName,
                        LastName: result[0].LastName,
                        Gender: result[0].Gender,
                        Dob: result[0].Dob,
                        Img: result[0].Img,
                        VillageName: result[0].VillageName,
                        DistrictName: result[0].DistrictName,
                        ProvinceName: result[0].ProvinceName,
                        status: 6
                      },
                      "secret1",
                      { expiresIn: "3h" }
                    );
                    res.json({ status: 'ok', message: 'yes6', token })
                  } else if (data.RoleName.indexOf('tearcherSubject') !== -1 && data.RoleName.indexOf('manager') !== -1) {
                    var token = jwt.sign(
                      {
                        UserId: result[0].UserId,
                        UserName: result[0].UserName,
                        Email: result[0].Email,
                        Mobile: result[0].Mobile,
                        ProfileId: result[0].ProfileId,
                        FirstName: result[0].FirstName,
                        LastName: result[0].LastName,
                        Gender: result[0].Gender,
                        Dob: result[0].Dob,
                        Img: result[0].Img,
                        VillageName: result[0].VillageName,
                        DistrictName: result[0].DistrictName,
                        ProvinceName: result[0].ProvinceName,
                        status: 7
                      },
                      "secret1",
                      { expiresIn: "3h" }
                    );
                    res.json({ status: 'ok', message: 'yes7', token })
                  } else if (data.RoleName.indexOf('tearcherSubject') !== -1) {
                    var token = jwt.sign(
                      {
                        UserId: result[0].UserId,
                        UserName: result[0].UserName,
                        Email: result[0].Email,
                        Mobile: result[0].Mobile,
                        ProfileId: result[0].ProfileId,
                        FirstName: result[0].FirstName,
                        LastName: result[0].LastName,
                        Gender: result[0].Gender,
                        Dob: result[0].Dob,
                        Img: result[0].Img,
                        VillageName: result[0].VillageName,
                        DistrictName: result[0].DistrictName,
                        ProvinceName: result[0].ProvinceName,
                        status: 8
                      },
                      "secret1",
                      { expiresIn: "3h" }
                    );
                    res.json({ status: 'ok', message: 'yes8', token })
                  }
                  else {
                    res.json({ message: 'no role' })
                  }
                  conn.query(
                    "select UserId UserName,Mobile,Email from Users where UserId=?",
                    [req.session.UserId],
                    (err, infoLogin) => {
                      if (err) {
                        res.send(err);
                      }
                      // ເມື່ອມີການລ໋ອກອິນເຂົ້າສູ່ລະບົບ ມັນຈະບັນທຶກປະຫວັດ User ນີ້ໄວ້
                      conn.query(
                        "insert into HistoryLogin (History,Htime,UserId)value(curdate(),curtime(),?)",
                        [req.session.UserId]
                      );
                    }
                  );

                })

              } else {
                res.json({ status: "noPass", message: "Password error ..." });
              }
            }
          );
        }
      );
    } catch (err) {
      console.log(err);
      return res.json({
        status: "error",
        message: "No information in DB ...",
        err,
      });
    }
  },

  //get token

  getToken: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      var userlogin = jwt.verify(token, "secret1");
      // console.log(userlogin)
      res.json({
        status: "ok",
        userlogin,
      });
    } catch (err) {
      // console.log(err);
      res.json({
        status: "forbidden",
        message: "ເທົາເຂັ້ມນີ້ ໝົດອາຍຸແລ້ວ ກະລຸນາກວດສອດ.",
        err,
      });
    }
  },

  // Select History User Login
  HistoryLogin: async (req, res) => {
    conn.query(
      "select b.LoginId,a.UserId, a.UserName,a.Mobile,Email,DATE_Format(b.History,'%d-%m-%Y')as History,TIME_FORMAT(b.Htime,'%r')as Htime from Users as a, HistoryLogin as b where a.UserId=b.UserId and b.History=curdate()order by LoginId desc",
      (err, result) => {
        if (err) {
          res.send("not select", err);
        }
        res.json(result);
      }
    );
  },
  // getimg: (req, res) =>{
  //     conn.query('select*from profiles', (err, result) => {
  //         if(err){
  //             res.send('err', err)
  //         }
  //         res.json(result)
  //     })
  // }
};

module.exports = Login;
