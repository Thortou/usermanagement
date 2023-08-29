const conn = require('../../config/database');

const app_studentP = {
    findAll: (req, res) => {
        const  UserName = req.params.UserName;
        const parent_data = "f.ParentId,f.Fname as p_Fname, f.Lname as p_Lname, Date_FORMAT(f.Dob, '%d/%m/%Y') as p_Dob, f.Occupation as p_Occupation, f.Position as p_Position, f.Workplace as p_Workplace, f.DistrictId as p_DistrictId, f.ProvinceId as p_ProvinceId, f.Village as p_Village, f.SectionVillage as p_SectionVillage, f.Unit as p_Unit, f.HouseNumber as p_HouseNumber, f.Religion as p_Religion, f.Tribe as p_Tribe, f.Race as p_Race, f.Nationality as p_Nationality, f.Phone as p_Phone, f.Remark as p_Remark";

        const sql = `select a.*,b.*, Date_format(b.Dob, \'%d/%m/%Y\') as s_Dob,c.*,d.*,e.*,f.*,${parent_data}, g.ProvinceName as BirthProvinceName, h.DistrictName as BirthDistrictName, i.ProvinceName as ProvinceName, j.DistrictName as DistrictName, k.ProvinceName as p_ProvinceName, l.DistrictName as p_DistrictName from users as a inner join student_profile as b on a.UserId=b.StudentUserId inner join member_classroom as c on b.StudentId=c.StudentId inner join invoice_register as d on c.RegisterId=d.RegisterId inner join classroom as e on c.ClassroomId=e.ClassroomId inner join parent_profile as f on b.StudentId=f.StudentId inner join provinces as g on b.BirthProvinceId=g.ProvinceId inner join districts as h on b.BirthDistrictId=h.DistrictId inner join provinces as i on b.ProvinceId=i.ProvinceId inner join districts as j on b.DistrictId=j.DistrictId inner join provinces as k on f.ProvinceId=k.ProvinceId inner join districts as l on f.DistrictId=l.DistrictId where d.TermId = (select max(TermId) from invoice_register) and a.UserName= ? or b.StudentNumber = ? or a.Mobile = ?`;

        conn.query(sql, [UserName, UserName, UserName], (err, result) => {
            if(err)throw err;
            res.json(result );
        })
    }
}
module.exports = app_studentP;