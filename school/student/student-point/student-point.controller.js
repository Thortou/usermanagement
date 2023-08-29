const conn = require('../../../config/database');

const studentPoint = {
 create: (req, res) => {
    // const Point = [req.body];
    // const  PointScore = [req.body];
    const  MemberId = [req.body];
    const arrayData = [req.body];
    const PointDate = [req.body];
    const  Remark  = [req.body];

    // const Points = Point[0].Point;
    // const PointScores = PointScore[0].PointScore;
    const MemberIds = MemberId[0].MemberId;
    const studentPoint = arrayData[0].arrayData; 
    const PointDates = PointDate[0].PointDate;
    const Remarks = Remark[0].Remark;

    // const mapData = studentPoint.map((rules)=> rules);
    const mapData2 = studentPoint.map((value) => ({
        // Points: Points,
        // PointScore: PointScores, 
        MemberId: MemberIds, 
        RegId: value, 
        PointDate: PointDates, 
        Remark: Remarks
    }));
    let sqlInsert = `INSERT INTO student_point (MemberId, RegId, PointDate, Remark) VALUES ?`;
    let values = []
    for(var i in mapData2) {
        values.push([mapData2[i].MemberId, mapData2[i].RegId, mapData2[i].PointDate, mapData2[i].Remark]);
      }
      const setf = 'set foreign_key_checks=0';
      conn.query(setf)
    conn.query(sqlInsert, [values], (err, result) => {
        if(err){
            console.log(err)
            res.json({status: 500, message:'sql error'});
        }else{
            res.json({status: 200, message:'inserted...'});
        }
    })
 }, 
 findAll: (req, res) => {
    conn.query("select a.MemberId, b.*, c.*, Date_FORMAT(c.PointDate, \'%d/%m/%Y\') as PointDate From member_classroom as a, regulation as b, student_point as c where a.MemberId=c.MemberId and b.RegId=c.RegId", (err, result) => {
        if(err)throw err;
        res.json(result);
    })
 }, 
 findOne: (req, res) => { 
    const PointId = req.params.PointId;
    conn.query("select a.MemberId,a.FnameEng,a.FnameLao, b.*, c.* From student_profile as a, regulation as b, student_point as c where a.MemberId=c.MemberId and b.RegId=c.RegId and c.PointId=?",[PointId], (err, result) => {
        if(err)throw err; 
        res.json(result[0]);
    })
 },
 updated: (req, res) => {
    const { RegId, RegName, DeductPoint, Remark } = req.body;
    const sqlUpdate = "UPDATE regulation SET RegName=?, DeductPoint=?, Remark=? WHERE RegId=?";

    conn.query(sqlUpdate, [RegName, DeductPoint, Remark, RegId], (err, result) => {
        if(err){
            res.json({status: 500, message:'sql error'});
        }else{
            res.json({status: 200, message:'updated...'})
        }
    })
 },
 deleted: (req, res) => {
    const RegId = req.params.RegId;
    conn.query("DELETE FROM Regulation WHERE RegId=?", [RegId], (err, result) => {
        if(err) {
            res.json({status:500, message:'delete error!!!!'});
        }else{
            res.json({status:200, message:'deleted...'});
        }
    })
 }
}

module.exports = studentPoint;