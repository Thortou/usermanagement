const conn = require("../../config/database");

const android = {
  create: (req, res) => {
    const { UserName, Mobile, Password, StudentNumber } = req.body;
    const id = Math.floor(Math.random() * 1000) + 554433;

    //check table student_profile has StudentNumber or no
    conn.query(
      "select*From student_profile where StudentNumber=?",
      [StudentNumber],
      (err, result) => {
        if (err) throw err;
        if (result.length) {
          const check_Already_Id = result[0].StudentUserId;
          //check UserName Already exit ...
          conn.query(
            "select*From users where UserName=?",
            [UserName],
            (err, result) => {
              if (err) throw err;
              if (result.length) {
                res.json({
                  status: 403,statusname:'UserName',
                  message: "This UserName Already exist...",
                });
              } else {

                if(check_Already_Id !==0){ 
                    res.json({status:403,statusname:'StudentNumber', message:'already exit please....'})
                }else{
                        //check phone number is already exit...
                conn.query(
                    "select*From users where Mobile=?",
                    [Mobile],
                    (err, result) => {
                      if (err) throw err;
                      if (result.length) {
                        res.json({
                          status: 403, statusname:'Mobile',
                          message: "This Phone Number Already exist...",
                        });
                      } else {
                        if(check_Already_Id === 0){
                            conn.query("insert into users (randId, UserName, Mobile, Password)values(?,?,?,?)", [id,UserName, Mobile, Password], (err, result) => {
                                if(err){
                                    console.log(err)
                                    res.json({status:500, message:'error'});
                                }else{
                                    //check UserId keep inserto into in table student_profile
                                    conn.query("select*From users where randId=?", [id], (err, results) => {
                                        if(err)throw err;
                                        // insert into UserId to table student_profile
                                        conn.query("update student_profile set StudentUserId=? where StudentNumber=?", [results[0].UserId, StudentNumber],(err, result) => {
                                            if(err){
                                                res.json({status:500, message:"sql error!!!"});
                                            }else{
                                                res.json({status:200, message:'insert success...'});
                                            }
                                        });
                                    });
                                }
                            });
                        }
                      }
                    }
                  );
                }
                
                
             
              }
            }
          );
        } else {
          res.json({
            status: 404,
            message: "This StudentNumber don't have in DB",
          });
        }
      }
    );
  },
};
module.exports = android;
