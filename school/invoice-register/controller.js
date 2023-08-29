const conn = require("../../config/database");

const register = {
  insert: (req, res) => {

    const {
      TermId,
      GradeId,
      Fname,
      Lname,
      Gender,
      PaidBy,
      StatusPayment,
      UserId,
      ProfileId
    } = req.body;
    const _id = 1;
    conn.query(`select * from invoice_register where TermId=${TermId}`, (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        conn.query(
          "INSERT INTO invoice_register(TermId,GradeId, InvoiceNumber, Fname, Lname, Gender, PaidBy, ReceivedBy, Date, Time, ProfileId, StatusPayment)values(?,?,?,?,?,?,?,?,curdate(),curtime(),?,?)",
          [
            TermId,
            GradeId,
            _id,
            Fname,
            Lname,
            Gender,
            PaidBy,
            UserId,
            ProfileId,
            StatusPayment,
          ], (error, result) => {
            if (error) {
              res.json({
                status: 404, message: "ERROR!: 404 Not fount any feild",
              });
            } else {
              res.json({ status: 200, message: 'Register success...' })
            }
          }
        );
      } else {
        conn.query(`select Max(InvoiceNumber) as InvoiceNumber from invoice_register where TermId = (select max(TermId) from invoice_register)`, (err, result) => {
          if (err) throw err;
          const _ids = result[0].InvoiceNumber + _id;
          conn.query(
            "INSERT INTO invoice_register(TermId,GradeId, InvoiceNumber, Fname, Lname, Gender, PaidBy, ReceivedBy, Date, Time,ProfileId, StatusPayment)values(?,?,?,?,?,?,?,?,curdate(),curtime(),?,?)",
            [
              TermId,
              GradeId,
              _ids,
              Fname,
              Lname,
              Gender,
              PaidBy,
              UserId,
              ProfileId,
              StatusPayment,
            ], (error, result) => {
              if (error) {
                res.json({
                  status: 404, message: "ERROR!: 404 Not fount any feild",
                });
              } else {
                res.json({ status: 200, message: 'Register success...' })
              }
            }
          );
        })
      }
    });
  },
  getMax: (req, res) => {
    conn.query(
      "select a.*,b.*, c.*,DATE_FORMAT(c.Date,'%d/%m/%Y')as Date, TIME_FORMAT(c.Time,'%r')as Time from school_term as a, grade as b, invoice_register as c where a.TermId=c.TermId and c.GradeId=b.GradeId and RegisterId=(select MAX(RegisterId)from invoice_register)",
      (error, result) => {
        if (error) throw error;
        res.json(result[0]);
      }
    );
  },
  getSum: (req, res) => {
    const TermId = req.params.TermId;
    conn.query(
      "select sum(amount) from invoice_item where TermId=?",
      [TermId],
      (error, result) => {
        if (error) throw error;
        res.json(result[0]);
      }
    );
  },
  findAll: (req, res) => {
    conn.query(
      // and RegisterId not in (select RegisterId from member_classroom)
      "select a.*,b.*, c.*,e.FirstName, e.LastName, c.Gender,DATE_FORMAT(c.Date,'%d/%m/%Y')as Date, TIME_FORMAT(c.Time,'%r')as Time from school_term as a, grade as b, invoice_register as c, Users as d, profiles as e where a.TermId=c.TermId and c.GradeId=b.GradeId and c.ReceivedBy=d.UserId and d.UserId=e.UserId and c.TermId=(select Max(TermId) from invoice_register) order by c.InvoiceNumber desc",
      (error, result) => {
        if (error) throw error;
        res.json(result);
      }
    );
  },
  findAll_not_in_classroom: (req, res) => {
    conn.query(
      // 
      "select a.*,b.*, c.*,d.*,DATE_FORMAT(c.Date,'%d/%m/%Y')as Date, TIME_FORMAT(c.Time,'%r')as Time from school_term as a, grade as b, invoice_register as c, Users as d where a.TermId=c.TermId and c.GradeId=b.GradeId and c.ReceivedBy=d.UserId and c.RegisterId not in (select RegisterId from member_classroom) and c.TermId=(select max(termId) from invoice_register)",
      (error, result) => {
        if (error) throw error;
        res.json(result);
      }
    );
  },
  findAll_getGrade: (req, res) => {
    const GradeId = req.params.GradeId;
    conn.query(
      "select a.*,b.*, c.*,d.* from school_term as a, grade as b, invoice_register as c, Users as d where a.TermId=c.TermId and c.GradeId=b.GradeId and c.ReceivedBy=d.UserId and b.GradeId=? and c.RegisterId not in (select RegisterId from member_classroom) and c.TermId=(select max(termId) from invoice_register)",
      [GradeId],
      (error, result) => {
        if (error) throw error;
        res.json(result);
      }
    );
  },
  findAll_getGradeId: (req, res) => {
    const GradeId = req.params.GradeId;
    conn.query(
      "select a.*,b.*, c.*,e.FirstName, e.LastName, c.Gender,DATE_FORMAT(c.Date,'%d/%m/%Y')as Date, TIME_FORMAT(c.Time,'%r')as Time from school_term as a, grade as b, invoice_register as c, Users as d, profiles as e where a.TermId=c.TermId and c.GradeId=b.GradeId and c.ReceivedBy=d.UserId and d.UserId=e.UserId and c.TermId=(select Max(TermId)from invoice_register) and c.GradeId=?",
      [GradeId],
      (error, result) => {
        if (error) throw error;
        res.json(result);
      }
    );
  },
  findAll_inDebt: (req, res) => {
    conn.query(
      "select a.*,b.*, c.*,d.*,DATE_FORMAT(c.Date,'%d/%m/%Y')as Date, TIME_FORMAT(c.Time,'%r')as Time from school_term as a, grade as b, invoice_register as c, Users as d where a.TermId=c.TermId and c.GradeId=b.GradeId and c.ReceivedBy=d.UserId and c.TermId=(select Max(TermId)from invoice_register) and c.StatusPayment='inDebt'",
      (error, result) => {
        if (error) throw error;
        res.json(result);
      }
    );
  },
  findAll_inDebt_GradeID: (req, res) => {
    const GradeId = req.params.GradeId;
    conn.query(
      "select a.*,b.*, c.*,d.*,DATE_FORMAT(c.Date,'%d/%m/%Y')as Date, TIME_FORMAT(c.Time,'%r')as Time from school_term as a, grade as b, invoice_register as c, Users as d where a.TermId=c.TermId and c.GradeId=b.GradeId and c.ReceivedBy=d.UserId and c.StatusPayment='inDebt' and c.TermId=(select Max(TermId)from invoice_register) and c.GradeId=?",
      [GradeId],
      (error, result) => {
        if (error) throw error;
        res.json(result);
      }
    );
  },
  findAll_inDebt_RegisterId: (req, res) => {
    const RegisterId = req.params.RegisterId;
    conn.query(
      "select a.*,b.*, c.*,d.*,DATE_FORMAT(c.Date,'%d/%m/%Y')as Date, TIME_FORMAT(c.Time,'%r')as Time from school_term as a, grade as b, invoice_register as c, Users as d where a.TermId=c.TermId and c.GradeId=b.GradeId and c.ReceivedBy=d.UserId and c.RegisterId=?",
      [RegisterId],
      (error, result) => {
        if (error) throw error;
        res.json(result[0]);
      }
    );
  },
  getGrade: (req, res) => {
    const TermId = req.params.TermId;
    conn.query(
      "select a.*,b.*, c.*,d.*,DATE_FORMAT(c.Date,'%d/%m/%Y')as Date, TIME_FORMAT(c.Time,'%r')as Time from school_term as a, grade as b, invoice_register as c, Users as d where a.TermId=c.TermId and c.GradeId=b.GradeId and c.ReceivedBy=d.UserId and c.TermId=?",
      [TermId],
      (error, result) => {
        if (error) throw error;
        res.json(result);
      }
    );
  },

  findOne: (req, res) => {
    const RegisterId = req.params.RegisterId;
    conn.query(
      "SELECT * from invoice_register where RegisterId=?",
      [RegisterId],
      (error, result) => {
        if (error) throw error;
        res.json(result[0]);
      }
    );
  },
  delet: (req, res) => {
    const RegisterId = req.params.RegisterId;
    conn.query(
      "delete from invoice_register where RegisterId=?",
      [RegisterId],
      (error, result) => {
        if (error) {
          res.json({ status: 404, message: "delete field" });
        }
        res.json({
          status: 200,
          message: "delete success",
        });
        // console.log(result);
      }
    );
  },

  Edit: (req, res) => {
    const {
      RegisterId,
      TermId,
      GradeId,
      InvoiceNumber,
      Fname,
      Lname,
      Gender,
      Total,
      PaidBy,
      UserId,
      Remark,
    } = req.body;

    conn.query(
      "select*from invoice_register where InvoiceNumber=?",
      [InvoiceNumber],
      (err, result) => {
        if (err) {
          res.json({ status: 404, message: "errror" });
        }
        if (result.length) {
          res.json({ status: 403, message: "GradeName aready exist..." });
        } else {
          conn.query(
            "update invoice_register set TermId=?, GradeId=?, InvoiceNumber=?, Fname=?, Lname=?, Gender=?, Total=?, PaidBy=?, ReceivedBy=?, Date=?, Time=?, Remark=? where RegisterId=?",
            [
              TermId,
              GradeId,
              InvoiceNumber,
              Fname,
              Lname,
              Gender,
              Total,
              PaidBy,
              UserId,
              Remark,
              RegisterId,
            ],
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
  Edit_StatusPayment: (req, res) => {
    const { RegisterId, StatusPayment } = req.body;

    conn.query('select*from invoice_register where RegisterId=?', [RegisterId], (err, result) => {
      if (err) {
        res.json({ status: 500, message: 'error!!!' });
      }
      conn.query(
        "update invoice_register set PaidBy=?, StatusPayment=?, Date=curdate(), Time=curtime() where RegisterId=?",
        [result[0].Fname, StatusPayment, RegisterId],
        (error, result) => {
          if (error) {
            res.json({
              status: 404,
              message: "ERROR!: 404 Not fount any feild",
            });
          }
          conn.query("select a.*,b.*, c.*,d.*,DATE_FORMAT(c.Date,'%d/%m/%Y')as Date, TIME_FORMAT(c.Time,'%r')as Time from school_term as a, grade as b, invoice_register as c, Users as d where a.TermId=c.TermId and c.GradeId=b.GradeId and c.ReceivedBy=d.UserId and c.RegisterId=?", [RegisterId], (err, results) => {
            if (err) throw err;
            const time = results[0].Time;
            const date = results[0].Date;
            const gender = results[0].Gender;
            const gradeName = results[0].GradeName;
            const termName = results[0].TermName;
            const userName = results[0].UserName;
            const statusPayment = results[0].StatusPayment;
            const paidBy = results[0].PaidBy;

            // res.json({ status:200, message: "update success fully...",myresult});
            res.json({ status: '200', message: "update success fully...", time, date, gender, gradeName, termName, userName, statusPayment, paidBy });
          })

        }
      );

    })

  },
  findAll_id: (req, res) => {
    const selected = [req.body];
    const myData = selected[0].selected;
    conn.query(
      "select a.*,b.*, c.*,d.*,DATE_FORMAT(c.Date,'%d/%m/%Y')as Date, TIME_FORMAT(c.Time,'%r')as Time from school_term as a, grade as b, invoice_register as c, Users as d where a.TermId=c.TermId and c.GradeId=b.GradeId and c.ReceivedBy=d.UserId and c.RegisterId in (?)",
      [myData],
      (error, result) => {
        if (error) throw error;
        console.log(result);
        res.json({ status: 200, result });
      }
    );
  },
  findAll_select_grades: (req, res) => {
    const MemberId = req.params.MemberId;
    conn.query(
      "select a.Fname, a.Lname, a.Gender, b.StudentId, c.GradeId, c.GradeName from invoice_register as a, member_classroom as b, grade as c, classroom as d where a.RegisterId=b.RegisterId and c.GradeId=d.GradeId and d.ClassroomId=b.ClassroomId and b.MemberId=?",[MemberId],
      (error, result) => {
        if (error) throw error;
        // console.log(result);
        res.json(result[0]);
      }
    );
  },
};

module.exports = register;
