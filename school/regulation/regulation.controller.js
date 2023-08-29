const conn = require('../../config/database');

const regulation = {
 create: (req, res) => {
    const { RegName, DeductPoint, Remark } = req.body;
    const sqlInsert = "INSERT INTO regulation (RegName, DeductPoint, Remark) VALUES (?,?,?)";

    conn.query(sqlInsert, [RegName, DeductPoint, Remark], (err, result) => {
        if(err){
            res.json({status: 500, message:'sql error'});
        }else{
            res.json({status: 200, message:'inserted...'})
        }
    })
 },
 findAll: (req, res) => {
    conn.query("select*From regulation", (err, result) => {
        if(err)throw err;
        res.json(result);
    })
 },
 findRegName: (req, res) => {
    conn.query("select RegName From regulation", (err, result) => {
        if(err)throw err;
        res.json(result);
    })
 },
 findOne: (req, res) => {
    const RegId = req.params.RegId;
    conn.query("select * From regulation where RegId=?",[RegId], (err, result) => {
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
    const setForeignkey = "set foreign_key_checks=0";
    conn.query(setForeignkey);
    conn.query("DELETE FROM Regulation WHERE RegId=?", [RegId], (err, result) => {
        if(err) {
            res.json({status:500, message:'delete error!!!!'});
        }else{
            res.json({status:200, message:'deleted...'});
        }
    })
 }
}

module.exports = regulation;