const conn = require("../../config/database");

const meber = {
  create: (req, res) => {
    const selected = [req.body];
    const ClassroomId = [req.body];
    const _StudentId = selected[0].selected;
    const _ClassroomId = ClassroomId[0].ClassroomId;
   
    const dataMap = _StudentId.map((data) => (
       [data]
    ))
    conn.query(`select RegisterId, ProfileId from invoice_register where RegisterId in(?)`, [dataMap], (err, result) => {
      if(err) throw err;
      const dataRegister = result;
      const myMap = dataRegister.map((user) => user);
      const newEmployees = myMap.map((value) => ({
        RegisterId: value.RegisterId,
        ProfileId: value.ProfileId,
        clrid: _ClassroomId,
      }));
      let stRegister=[];
      for(var i in newEmployees){
        stRegister.push([newEmployees[i].RegisterId, newEmployees[i].clrid, newEmployees[i].ProfileId])
      }
      // console.log(stRegister)
       // //insert data to database
    const setForeignkey = "set foreign_key_checks=0";
    conn.query(setForeignkey);
    let sql = `INSERT INTO member_classroom(RegisterId, ClassroomId, StudentId) VALUES ?`;
    
    conn.query(sql, [stRegister], (err, result) => {
      if (err) {
        console.log(err)
        res.json({ status: 500, message: "error!!" });
      }
      // ບັນທຶກຄະແນນ ຄຸນສົມບັດພ້ອມ
      const Spoint = ["320"];
      const Spointscore = ["10"];
      const myInfo = _StudentId.map((info) => ({
        Registerid: info,
      }));

      let Data = [];
      for (var i in myInfo) {
        Data.push([myInfo[i].Registerid]);
      }
      //ເອົາ RegisterId ໄປຂໍ MemberId ຈາກຕາຕະລາງ member_classroom
      conn.query(
        "select MemberId FROM member_classroom where RegisterId in (?) ",
        [Data],
        (err, student, result) => {
          if (err) throw err;
          const myMemberid = student.map((idmember) => ({
            _id: idmember.MemberId,
            Point: Spoint,
            Pointscore: Spointscore,
          }));
          let data = [];
          for (var i in myMemberid) {
            data.push([
              [myMemberid[i].Point], 
              myMemberid[i].Pointscore,
              myMemberid[i]._id,
            ]);
          }
          //ບັນທຶກຂໍ້ມູນເຂົ້າໄປໃນຕາຕະລາງ student_point
          conn.query(
            `INSERT INTO student_point (Point, PointScore, MemberId)VALUES ?`,
            [data],
            (err, result) => {
              if (err) {
                console.log(err);
                res.json({ status: 500, message: "error!!!" }); 
              } else {
                res.json({ status: 200, message: "query...." });
              }
            }
          );
        }
      );
    });
    })

   
  },
  findAll: (req, res) => {
    const select =
      "SELECT a.*,b.*,c.*,d.* FROM  member_classroom as a, invoice_register as b, classroom as c, student_point as d, school_term as e where a.MemberId=d.MemberId and a.RegisterId=b.RegisterId and a.ClassroomId=c.ClassroomId and b.TermId=e.TermId and b.TermId=(select Max(TermId)from invoice_register)";
    conn.query(select, (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  },
  findAll_getmember: (req, res) => {
    const ClassroomId = req.params.ClassroomId;
    const select =
      "SELECT a.*,b.*,c.*,d.* FROM  member_classroom as a, invoice_register as b, classroom as c, student_point as d, school_term as e where a.MemberId=d.MemberId and a.RegisterId=b.RegisterId and a.ClassroomId=c.ClassroomId and b.TermId=e.TermId and b.TermId=(select Max(TermId)from invoice_register) and a.ClassroomId=?";
    conn.query(select, [ClassroomId], (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  },
  findAll_getmemberall: (req, res) => {
    const UserId = req.params.UserId;
    const select =
      "select g.GradeId from users as a, users_has_roles as b, roles as c, subject as d, teacherhsubject as e, classroom as f, grade as g, school_term as i where a.userid=b.userid and b.roleid=c.roleid and e.SubjectId=d.SubjectId and b.UserhRoleId=e.UserhRoleId and e.ClassroomId=f.ClassroomId and e.TermId=i.TermId and e.TermId=(select Max(TermId)from teacherhsubject) and f.GradeId=g.GradeId and a.UserId=?";
    conn.query(select, [UserId], (err, result) => {
      if (err) throw err;

      const gradeid = result[0];
      conn.query(`select a.ClassroomId, b.*, c.* From member_classroom as b, classroom as a, invoice_register as c, school_term as d where c.TermId=d.TermId and a.ClassroomId=b.ClassroomId and b.RegisterId=c.RegisterId and a.GradeId=${gradeid.GradeId} and c.TermId=(select Max(TermId)from invoice_register)`, (err, result) => {
        if(err)throw err;
        res.json(result);
      })
    });
  },
  findAll_getmemberId: (req, res) => {
    const MemberId = req.params.MemberId;
    const select =
      "SELECT a.*,b.*,c.* FROM  member_classroom as a, invoice_register as b, classroom as c where a.RegisterId=b.RegisterId and a.ClassroomId=c.ClassroomId and a.MemberId=?";
    conn.query(select, [MemberId], (err, result) => {
      if (err) throw err;
      res.json(result[0]);
    });
  },
  demoSl: (req, res) => {
    const RegisterId = [req.body];
    const Spoint = ["320"];
    const Spointscore = ["10"];
    const myId = RegisterId[0].RegisterId;

    const myInfo = myId.map((info) => ({
      StudentId: info,
    }));

    let values = [];
    for (var i in myInfo) {
      values.push([myInfo[i].StudentId]);
    }
    // console.log(values)
    const delet =
      "select MemberId FROM member_classroom where RegisterId in (?)";
    conn.query(delet, [values], (err, tou, result) => {
      if (err) throw err;
      const myMemberid = tou.map((idmember) => ({
        _id: idmember.MemberId,
        Point: Spoint,
        Pointscore: Spointscore
      }));
      
      let data = [];
      for (var i in myMemberid) {
        data.push(
          [[myMemberid[i]._id],
          myMemberid[i].Point,
          myMemberid[i].Pointscore]
        );
      }
      res.json(result);
      console.log(data);
    });
  },
  delet: (req, res) => {
    const MemberId = req.params.MemberId;
    const delet = "DELETE FROM member_classroom where MemberId=?";
    conn.query(delet, [MemberId], (err, result) => {
      if (err) throw err;
      res.json({ status: 200, message: "delete success..." });
    });
  },
  GradeOne: (req, res) => {
    conn.query("select count(c.MemberId) as MemberId from grade as a, classroom as b, member_classroom as c, invoice_register as d, school_term as e where a.GradeId=b.GradeId and b.ClassroomId=c.ClassroomId and c.RegisterId=d.RegisterId and d.TermId=e.TermId and d.TermId=(select Max(TermId)from invoice_register) and GradeName='1'", (err, result) => {
      if(err)throw err;
      res.json(result[0])
    })
  },
  GradeTwo: (req, res) => {
    conn.query("select count(c.MemberId) as MemberId from grade as a, classroom as b, member_classroom as c, invoice_register as d, school_term as e where a.GradeId=b.GradeId and b.ClassroomId=c.ClassroomId and c.RegisterId=d.RegisterId and d.TermId=e.TermId and d.TermId=(select Max(TermId)from invoice_register) and GradeName='2'", (err, result) => {
      if(err)throw err;
      res.json(result[0])
    })
  },
  GradeThree: (req, res) => {
    conn.query("select count(c.MemberId) as MemberId from grade as a, classroom as b, member_classroom as c, invoice_register as d, school_term as e where a.GradeId=b.GradeId and b.ClassroomId=c.ClassroomId and c.RegisterId=d.RegisterId and d.TermId=e.TermId and d.TermId=(select Max(TermId)from invoice_register) and GradeName='3'", (err, result) => {
      if(err)throw err;
      res.json(result[0])
    })
  },
  GradeFour: (req, res) => {
    conn.query("select count(c.MemberId) as MemberId from grade as a, classroom as b, member_classroom as c, invoice_register as d, school_term as e where a.GradeId=b.GradeId and b.ClassroomId=c.ClassroomId and c.RegisterId=d.RegisterId and d.TermId=e.TermId and d.TermId=(select Max(TermId)from invoice_register) and GradeName='4'", (err, result) => {
      if(err)throw err;
      res.json(result[0])
    })
  },
  GradeFive: (req, res) => {
    conn.query("select count(c.MemberId) as MemberId from grade as a, classroom as b, member_classroom as c, invoice_register as d, school_term as e where a.GradeId=b.GradeId and b.ClassroomId=c.ClassroomId and c.RegisterId=d.RegisterId and d.TermId=e.TermId and d.TermId=(select Max(TermId)from invoice_register) and GradeName='5'", (err, result) => {
      if(err)throw err;
      res.json(result[0])
    })
  },
  GradeSix: (req, res) => {
    conn.query("select count(c.MemberId) as MemberId from grade as a, classroom as b, member_classroom as c, invoice_register as d, school_term as e where a.GradeId=b.GradeId and b.ClassroomId=c.ClassroomId and c.RegisterId=d.RegisterId and d.TermId=e.TermId and d.TermId=(select Max(TermId)from invoice_register) and GradeName='6'", (err, result) => {
      if(err)throw err;
      res.json(result[0])
    })
  },
  GradeSeven: (req, res) => {
    conn.query("select count(c.MemberId) as MemberId from grade as a, classroom as b, member_classroom as c, invoice_register as d, school_term as e where a.GradeId=b.GradeId and b.ClassroomId=c.ClassroomId and c.RegisterId=d.RegisterId and d.TermId=e.TermId and d.TermId=(select Max(TermId)from invoice_register) and GradeName='7'", (err, result) => {
      if(err)throw err;
      res.json(result[0])
    })
  },
  get_in_info_GradeOne: (req, res) => {
    const GradeName = req.params.GradeName;
    conn.query("select d.Fname, d.Lname, d.Gender,c.*, b.ClassroomName from grade as a, classroom as b, member_classroom as c, invoice_register as d, school_term as e where a.GradeId=b.GradeId and b.ClassroomId=c.ClassroomId and c.RegisterId=d.RegisterId and d.TermId=e.TermId and d.TermId=(select Max(TermId)from invoice_register) and GradeName=?", [GradeName], (err, result) => {
      if(err)throw err;
      res.json(result)
    })
  },
  //ສະແດງສະເພາະ ເພດຍິິງ-ຊາຍ
  findAllByFemale: (req, res) => {
    const Gender = req.params.Gender;
    conn.query("select d.Fname, d.Lname, d.Gender, b.ClassroomName from grade as a, classroom as b, member_classroom as c, invoice_register as d, school_term as e where a.GradeId=b.GradeId and b.ClassroomId=c.ClassroomId and c.RegisterId=d.RegisterId and d.TermId=e.TermId and d.TermId=(select Max(TermId)from invoice_register) and Gender=?", [Gender], (err, result) => {
      if(err)throw err;
      res.json(result)
    })
  },
  countTansferIn: (req, res) => {
    conn.query("select count(StudentId) as StudentId from student_profile where StudentId in (select (StudentId) from transfer_in)", (err, result) => {
      if(err)throw err;
      res.json(result[0])
    })
  },
  TansferIn: (req, res) => {
    conn.query("select a.*,c.ClassroomName, d.Point from student_profile as a, member_classroom as b, classroom as c, student_point as d where a.StudentId=b.StudentId and b.ClassroomId=c.ClassroomId and b.MemberId=d.MemberId and a.StudentId in (select (StudentId) from transfer_in)", (err, result) => {
      if(err)throw err;
      res.json(result)
    })
  },
};
module.exports = meber;
