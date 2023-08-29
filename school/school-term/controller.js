const conn = require("../../config/database");

const school_term = {
  insert: (req, res) => {
    const { TermName, Remark } = req.body;

    conn.query(
      "select*from school_term where TermName=?",
      [TermName],
      (err, result) => {
        if (err) {
          res.json({ status: 404, message: "errror" });
        }
        if (result.length) {
          res.json({ status: 403, message: "TerName aready exist..." });
        } else {
          conn.query(
            "INSERT INTO school_term(TermName, Remark)values(?,?)",
            [TermName, Remark],
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
    conn.query("SELECT*FROM school_term", (error, result) => {
      if (error) throw error;
      res.json(result);
    });
  },

  findOne: (req, res) => {
    const TermId = req.params.TermId;
    conn.query(
      "SELECT*FROM school_term where TermId=?",
      [TermId],
      (error, result) => {
        if (error) throw error;
        res.json(result[0]);
      }
    );
  },
  delet: (req, res) => {
    const TermId = req.params.TermId;
    conn.query(
      "delete from school_term where TermId=?",
      [TermId],
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
};

module.exports = school_term;
