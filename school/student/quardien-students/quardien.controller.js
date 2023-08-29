const conn = require("../../../config/database");

const quardienStudent = {
 findall: (req, res) => {
   conn.query('select*from parent_profile', (err, result) => {
    if(err)throw err;
    res.json(result);
   })
 },
 findOne: (req, res) => {
    const ParentId = req.params.ParentId;
    const selectd = "SELECT a.*, Date_FORMAT(a.Dob, \'%d-%m-%Y\') as Dob,b.*, c.* FROM parent_profile as a, provinces as b , districts as c  where a.ProvinceId=b.ProvinceId and a.DistrictId=c.DistrictId and ParentId=?";
    
    conn.query(selectd,[ParentId], (err, result) => {
        if(err)throw err;
        res.json(result[0]);
    });
 },
 update: (req, res) => {
    const {ParentId, Fname, Lname, Dob ,Occupation,Position, Workplace, DistrictId, ProvinceId, Village, SectionVillage, Unit, HouseNumber, Religion, Tribe, Race, Nationality, Phone } = req.body;

    // const updated = "UPDATE parent_profile set StudentId=?, Fname=?, Lname=?, Dob=? ,Occupation=?,Position=?, Workplace=?, DistrictId=?, ProvinceId=?, Village=?, SectionVillage=?, Unit=?, HouseNumber=?, Religion=?, Tribe=?, Race=?, Nationality=?, Phone=? where ParentId=?";

    conn.query("UPDATE parent_profile set Fname=?, Lname=?, Dob=? ,Occupation=?,Position=?, Workplace=?, DistrictId=?, ProvinceId=?, Village=?, SectionVillage=?, Unit=?, HouseNumber=?, Religion=?, Tribe=?, Race=?, Nationality=?, Phone=? where ParentId=?", [Fname, Lname, Dob ,Occupation,Position, Workplace, DistrictId, ProvinceId, Village, SectionVillage, Unit, HouseNumber, Religion, Tribe, Race, Nationality, Phone, ParentId], (err, result) => {
        if(err){
            console.log(err);
            res.json({status:500, message:'sql update have anny coding error!!'});
        }
       else{
        res.json({status:200, message:'update success fully...'});
       }
    })
 }
};
module.exports = quardienStudent;
