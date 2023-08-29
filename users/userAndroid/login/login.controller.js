const conn = require('../../../config/database');

const loginAndroid = {
    loginFluter: (req, res) => {
        const login = `select a.*, b.* from users as a, student_profile as b where a.UserId=b.StudentUserId and a.UserName=? or a.Mobile=? or b.StudentNumber=?`;
        conn.query(login,[req.body.UserName, req.body.UserName, req.body.UserName], (err, result) => {
            if(err) throw err;
            if(result.length == 0){
                res.json({status:404, message: 'no user'});
            }else{
                const pw = result[0].Password;
                if(req.body.Password !== pw){
                    res.json({status:403, message: "Password wrong check again please..."})
                }else{
                    res.json({status:200, message:'login success...'})
                }
            }
        })
    }
}

module.exports = loginAndroid;