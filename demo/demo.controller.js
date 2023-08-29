const conn = require("../config/database");

const demo = {
  insert: (req, res) => {
    const _id = Math.floor(Math.random() * 10000) + 200;
    const { fname, lname, gender } = req.body;

    conn.query(
      "INSERT INTO demo(_id,fname, lname, gender)values(?,?,?,?)",
      [_id, fname, lname, gender],
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
  },

  newInsert: (req, res) => {
    const _id = Math.floor(Math.random() * 1000) + 554433;
    const {myName, mylName} = req.body;
    const sql = "INSERT INTO key_all (keyID, myName, mylName, mydate,mytime)VALUES(?,?,?,curdate(), curtime())";

    conn.query(sql, [_id, myName, mylName], function(err, result){
      if(err)throw err;
      res.json({ success:1, message:'inserted....'})
    });
  },

  findAll: (req, res) => {
    conn.query("SELECT*FROM demo order by _id desc", (error, result) => {
      if (error) throw error;
      res.json(result);
    });
  },
  delet: (req, res, next) => {
    const data = [req.body];
    const number = [req.body];

    //ຕົວແປ
    const datas = data[0].data;
    const numbers = number[0].number;
    const datamap = datas.map((user) => user);
    const newEmployees = datamap.map((value) => ({
      EmpName: value,
      id: numbers,
    }));

    const myInfo = newEmployees.map((info) => ({
      _idOne: info.EmpName[0],
      _idTow: info.id[0]
    }));

    let sql = `INSERT INTO key_all(thisID, otherID) VALUES ?`; 
    let values = [];

    for(var i in myInfo) {
      values.push([myInfo[i]._idOne, myInfo[i]._idTow]);
    }
    console.log(values)
    conn.query(sql, [values], (err, result) => {
      if(err){
        
      };
      res.json({ status: 200, message: "successs" });
    });
  },
  insert_demo: (req, res) => {
    // insert statment

    // const data = todos.map((info) => info.todos + "," + number);

    let stmt = `INSERT INTO demo(fname,lname,gender) VALUES ? `;
    let todos = [req.body];

    // execute the insert statment
    conn.query(stmt, [todos[0].todos], (err, results, fields) => {
      if (err) {
        return console.error(err.message);
      }
      // get inserted rows

      console.log("Row inserted:" + results.affectedRows);
      console.log(todos[0].todos);
      res.json({ status: 200, message: "success.." + todos[0].todos });
    });
  },

  demos: (req, res) => {
    const data = [
      {
        user: "tou",
        lname: "her",
        age: "21",
      },
      {
        user: "see",
        lname: "her",
        age: "21",
      },
      {
        user: "meng",
        lname: "her",
        age: "21",
      },
    ];

    const myInformation = data.map((value) => ({
      fname: value.user,
      lname: value.lname,
      years: value.age,
      // EmpDepartment: numbers
    }));
    console.log(myInformation);

    res.send(data);
  },
};

module.exports = demo;
