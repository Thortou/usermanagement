const conn = require('../../../config/database')
const transferIn = {
    findAll: (req, res) => {
        const infoStudent = "aa.ProvinceName as BirthProvince, bb.DistrictName as BirthDistrict, cc.ProvinceName as NowProvince, dd.DistrictName as NowDistrict"
        conn.query(`select a.*, ${infoStudent}, Date_format(a.Dob, \'%d/%m/%Y\') as Dob, b.*, d.ProvinceName as ProvinceFromSch, e.DistrictName as DistrictFromSch, c.TermName from student_profile as a, transfer_in as b, school_term as c, provinces as d, districts as e, provinces as aa, districts as bb, provinces as cc, districts as dd where a.StudentId=b.StudentId and b.TermId=c.TermId and d.ProvinceId=b.ProvinceId and a.BirthProvinceId=aa.ProvinceId and a.BirthDistrictId=bb.DistrictId and a.ProvinceId=cc.ProvinceId and a.DistrictId=dd.DistrictId and e.DistrictId=b.DistrictId`, (err, result) => {
            if(err) throw err;
            res.json(result)
        })
    }
}
module.exports = transferIn;