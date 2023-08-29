const conn = require("../../config/database");

const item = {
  insert: (req, res) => { 
    const { TermId, ItemName, amount } = req.body;
    conn.query(
      "select*from invoice_item where ItemName=?",
      [ItemName],
      (err, result) => {
        if (err) {
          res.json({ status: 404, message: "errror" });
        }
        if (result.length) {
          res.json({ status: 403, message: "ItemName aready exist..." });
        } else {
          conn.query(
            "INSERT INTO invoice_item(TermId, ItemName, amount)values(?,?,?)",
            [TermId, ItemName, amount],
            (error, result) => {
              if (error) {
                console.log(error);
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
    conn.query("SELECT a.*,b.* from school_term as a, invoice_item as b where a.TermId=b.TermId and b.TermId=(select MAX(TermId)from invoice_Item)", (error, result) => {
      if (error) throw error; 
      res.json(result);
    });
  },
  getSum: (req, res) => {
    conn.query('select sum(Amount)as Total from invoice_item where TermId=(select MAX(TermId)from invoice_Item)', (error, results) => {
      if(error) throw error;
      res.json(results[0]);
    });
  },

  findOne: (req, res) => {
    const ItemId = req.params.ItemId;
    conn.query(
      "SELECT a.*, b.* from invoice_item as a, school_term as b where a.TermId=b.TermId and a.ItemId=?",
      [ItemId],
      (error, result) => {
        if (error) throw error;
        res.json(result[0]);  
      }
    );
  },
  getGradeId: (req, res) => {
    const TermId = req.params.TermId;
    conn.query(
      "SELECT a.*, b.* from invoice_item as a, school_term as b where a.TermId=b.TermId and a.TermId=?",
      [TermId],
      (error, result) => {
        if (error) throw error;
        res.json(result);  
      }
    );
  },
  delet: (req, res) => {
    const ItemId = req.params.ItemId;
    conn.query(
      "delete from invoice_item where ItemId=?",
      [ItemId],
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
    const { ItemId, TermId, ItemName, Amount } = req.body;
          conn.query(
            "update invoice_item set TermId=?, ItemName=?, amount=? where ItemId=?",
            [TermId, ItemName, Amount, ItemId],
            (error, result) => {
              if (error) {
                console.log(error)
                res.json({
                  status: 500,
                  message: "ERROR!: 404 Not fount any feild",
                });
              }else{
                res.json({ status: 200, message: "update success fully..." });
              }
            }
          );
  },
};

module.exports = item;
