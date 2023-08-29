const conn = require("../../../config/database");

const student_profiles = {
  getParent: (req, res) => {
    const { DistrictId,ProvinceId,village,typeNoi,typeHousTi } = req.params;
    conn.query("select * from parent_profile where DistrictId=? and ProvinceId=? and village=? and Unit=? and HouseNumber=?",[ DistrictId,ProvinceId,village,typeNoi,typeHousTi], (err, result) => {
      if(err)throw err;
      // console.log(result)
      res.json(result)
    })
  },
  insert: (req, res) => {
    // const setForeignkey = "set foreign_key_checks=0";
    // conn.query(setForeignkey);

    const {
      Fname,
      Lname,
      FnameEng,
      LnameEng,
      Gender,
      Dob,
      BirthVillage,
      BirthDistrictId,
      BirthProvinceId,
      Village,
      DistrictId,
      ProvinceId,
      Religion,
      Tribe,
      Nationality,
      Race,
      Phone_one,
      Phone_two,
      Remark,
      UserId,
      MemberId,
    } = req.body;
    const StudentImage = req.file.filename;

    //ຕົວປ່ຽນຂອງຂໍ້ມູນພໍ່ແມ່
    const {
      f_Fname,
      f_Lname,
      f_Dob,
      f_Occupation,
      f_Position,
      f_Workplace,
      f_DistrictId,
      f_ProvinceId,
      f_Village,
      f_SectionVillage,
      f_Unit,
      f_HouseNumber,
      f_Religion,
      f_Tribe,
      f_Race,
      f_Nationality,
      f_Phone,
      f_Remark,
    } = req.body;
    const {
      m_Fname,
      m_Lname,
      m_Dob,
      m_Occupation,
      m_Position,
      m_Workplace,
      m_DistrictId,
      m_ProvinceId,
      m_Village,
      m_SectionVillage,
      m_Unit,
      m_HouseNumber,
      m_Religion,
      m_Tribe,
      m_Race,
      m_Nationality,
      m_Phone,
      m_Remark,
    } = req.body;
    const sqlInsert =
      "INSERT INTO parent_profile(StudentId, Fname, Lname, Dob ,Occupation,Position, Workplace, DistrictId, ProvinceId, Village, SectionVillage, Unit, HouseNumber, Religion, Tribe, Race, Nationality, Phone, Remark)values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    const currentDate = new Date();
    const curdate = currentDate.getFullYear();
    const nextYear = curdate.toString().slice(-2);
    const mynextYear = parseInt(nextYear) + 1;

    const aa = mynextYear.toString();
    const all = curdate + aa;

    const numberstudent = "00001";
    const StudentNumber = all + numberstudent;
    conn.query("set foreign_key_checks=0")

    conn.query(
      "select * from member_classroom where MemberId=?",
      [MemberId],
      (err, result) => {
        const myId = result[0].StudentId;
        if (myId == "") {
          conn.query("select*from student_profile", (err, result) => {
            if (result.length === 0) {
              conn.query(
                "INSERT INTO student_profile(StudentImage, StudentNumber, FnameLao, LnameLao, FnameEng, LnameEng, Gender, Dob, BirthVillage, BirthDistrictId, BirthProvinceId, Village, DistrictId, ProvinceId, Religion, Tribe, Nationality, Race, Phone_one, Phone_two, Remark, UserId)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                [
                  StudentImage,
                  StudentNumber,
                  Fname,
                  Lname,
                  FnameEng,
                  LnameEng,
                  Gender,
                  Dob,
                  BirthVillage,
                  BirthDistrictId,
                  BirthProvinceId,
                  Village,
                  DistrictId,
                  ProvinceId,
                  Religion,
                  Tribe,
                  Nationality,
                  Race,
                  Phone_one,
                  Phone_two,
                  Remark,
                  UserId,
                ],
                (error, result) => {
                  if (error) {
                    console.log(error);
                    res.json({
                      status: 404,
                      message: "ERROR!: 404 Not fount any feild",
                    });
                  } else {
                    conn.query(
                      "select*From student_profile where StudentNumber=?",
                      [StudentNumber],
                      (err, results) => {
                        if (err) {
                          res.json({ status: 500, message: "error!!!" });
                        } else {
                          conn.query(
                            "UPDATE member_classroom set StudentId=? where MemberId=?",
                            [results[0].StudentId, MemberId],
                            (err, result) => {
                              if (err) {
                                res.json({ status: 500, message: "error!!!" });
                              } else {

                                const { GraduateGrade, TermId, GraduateSchool, TVillage, TDistrictId, TProvinceId, Remark } = req.body;
                                if (GraduateGrade !== "" || TermId !== "" || GraduateSchool !== "" || TVillage !== "" || TDistrictId !== "" || TProvinceId !== "") {
                                  const sql = `INSERT INTO transfer_in (StudentId, GraduateGrade, TermId, FromSchoolName, Village, DistrictId, ProvinceId, Remark) values (?,?,?,?,?,?,?,?)`;
                                  conn.query(sql, [results[0].StudentId, GraduateGrade, TermId, GraduateSchool, TVillage, TDistrictId, TProvinceId, Remark]);
                                  //Start insert info of parent_profile
                                  conn.query(
                                    sqlInsert,
                                    [
                                      results[0].StudentId,
                                      f_Fname,
                                      f_Lname,
                                      f_Dob,
                                      f_Occupation,
                                      f_Position,
                                      f_Workplace,
                                      f_DistrictId,
                                      f_ProvinceId,
                                      f_Village,
                                      f_SectionVillage,
                                      f_Unit,
                                      f_HouseNumber,
                                      f_Religion,
                                      f_Tribe,
                                      f_Race,
                                      f_Nationality,
                                      f_Phone,
                                      f_Remark,
                                    ],
                                    (err, result) => {
                                      if (err) {
                                        res.json({
                                          status: 500,
                                          message: "sql err",
                                        });
                                      } else {
                                        conn.query(
                                          sqlInsert,
                                          [
                                            results[0].StudentId,
                                            m_Fname,
                                            m_Lname,
                                            m_Dob,
                                            m_Occupation,
                                            m_Position,
                                            m_Workplace,
                                            m_DistrictId,
                                            m_ProvinceId,
                                            m_Village,
                                            m_SectionVillage,
                                            m_Unit,
                                            m_HouseNumber,
                                            m_Religion,
                                            m_Tribe,
                                            m_Race,
                                            m_Nationality,
                                            m_Phone,
                                            m_Remark,
                                          ],
                                          (err, result) => {
                                            if (err) {
                                              res.json({
                                                status: 500,
                                                message: "sql err",
                                              });
                                            } else {
                                              res.json({
                                                status: 200,
                                                message: "inser success...",
                                              });
                                            }
                                          }
                                        );
                                      }
                                    }
                                  );
                                  //End insert info of Parent_profile
                                }
                                else if (GraduateGrade === "" || TermId === "" || GraduateSchool === "" || TVillage === "" || TDistrictId === "" || TProvinceId === "") {
                                  conn.query(
                                    sqlInsert,
                                    [
                                      results[0].StudentId,
                                      f_Fname,
                                      f_Lname,
                                      f_Dob,
                                      f_Occupation,
                                      f_Position,
                                      f_Workplace,
                                      f_DistrictId,
                                      f_ProvinceId,
                                      f_Village,
                                      f_SectionVillage,
                                      f_Unit,
                                      f_HouseNumber,
                                      f_Religion,
                                      f_Tribe,
                                      f_Race,
                                      f_Nationality,
                                      f_Phone,
                                      f_Remark,
                                    ],
                                    (err, result) => {
                                      if (err) {
                                        res.json({
                                          status: 500,
                                          message: "sql err",
                                        });
                                      } else {
                                        conn.query(
                                          sqlInsert,
                                          [
                                            results[0].StudentId,
                                            m_Fname,
                                            m_Lname,
                                            m_Dob,
                                            m_Occupation,
                                            m_Position,
                                            m_Workplace,
                                            m_DistrictId,
                                            m_ProvinceId,
                                            m_Village,
                                            m_SectionVillage,
                                            m_Unit,
                                            m_HouseNumber,
                                            m_Religion,
                                            m_Tribe,
                                            m_Race,
                                            m_Nationality,
                                            m_Phone,
                                            m_Remark,
                                          ],
                                          (err, result) => {
                                            if (err) {
                                              res.json({
                                                status: 500,
                                                message: "sql err",
                                              });
                                            } else {
                                              res.json({
                                                status: 200,
                                                message: "inser success...",
                                              });
                                            }
                                          }
                                        );
                                      }
                                    }
                                  );
                                }


                                //Start insert infor of parent_profile
                                // conn.query(
                                //   sqlInsert,
                                //   [
                                //     results[0].StudentId,
                                //     f_Fname,
                                //     f_Lname,
                                //     f_Dob,
                                //     f_Occupation,
                                //     f_Position,
                                //     f_Workplace,
                                //     f_DistrictId,
                                //     f_ProvinceId,
                                //     f_Village,
                                //     f_SectionVillage,
                                //     f_Unit,
                                //     f_HouseNumber,
                                //     f_Religion,
                                //     f_Tribe,
                                //     f_Race,
                                //     f_Nationality,
                                //     f_Phone,
                                //     f_Remark,
                                //   ],
                                //   (err, result) => {
                                //     if (err) {
                                //       res.json({
                                //         status: 500,
                                //         message: "sql err",
                                //       });
                                //     } else {
                                //       conn.query(
                                //         sqlInsert,
                                //         [
                                //           results[0].StudentId,
                                //           m_Fname,
                                //           m_Lname,
                                //           m_Dob,
                                //           m_Occupation,
                                //           m_Position,
                                //           m_Workplace,
                                //           m_DistrictId,
                                //           m_ProvinceId,
                                //           m_Village,
                                //           m_SectionVillage,
                                //           m_Unit,
                                //           m_HouseNumber,
                                //           m_Religion,
                                //           m_Tribe,
                                //           m_Race,
                                //           m_Nationality,
                                //           m_Phone,
                                //           m_Remark,
                                //         ],
                                //         (err, result) => {
                                //           if (err) {
                                //             res.json({
                                //               status: 500,
                                //               message: "sql err",
                                //             });
                                //           } else {
                                //             res.json({
                                //               status: 200,
                                //               message: "inser success...",
                                //             });
                                //           }
                                //         }
                                //       );
                                //     }
                                //   }
                                // );//End insert info of parent_profile
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            } else {
              conn.query(
                "select StudentNumber from student_profile where StudentId=(SELECT max(StudentId) FROM student_profile)",
                (err, result) => {
                  if (err) throw err;
                  const myresult = result[0].StudentNumber;
                  const mynumber = parseInt(myresult);
                  const StudentMax = mynumber + 1;
                  conn.query(
                    "INSERT INTO student_profile(StudentImage, StudentNumber, FnameLao, LnameLao, FnameEng, LnameEng, Gender, Dob, BirthVillage, BirthDistrictId, BirthProvinceId, Village, DistrictId, ProvinceId, Religion, Tribe, Nationality, Race, Phone_one, Phone_two, Remark, UserId)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    [
                      StudentImage,
                      StudentMax,
                      Fname,
                      Lname,
                      FnameEng,
                      LnameEng,
                      Gender,
                      Dob,
                      BirthVillage,
                      BirthDistrictId,
                      BirthProvinceId,
                      Village,
                      DistrictId,
                      ProvinceId,
                      Religion,
                      Tribe,
                      Nationality,
                      Race,
                      Phone_one,
                      Phone_two,
                      Remark,
                      UserId,
                    ],
                    (error, result) => {
                      if (error) {
                        console.log(error);
                        res.json({
                          status: 404,
                          message: "ERROR!: 404 Not fount any feild",
                        });
                      } else {
                        conn.query(
                          "select*From student_profile where StudentNumber=?",
                          [StudentMax],
                          (err, results) => {
                            if (err) {
                              res.json({ status: 500, message: "error!!" });
                            } else {
                              conn.query(
                                "UPDATE member_classroom set StudentId=? where MemberId=?",
                                [results[0].StudentId, MemberId],
                                (err, result) => {
                                  if (err) {
                                    res.json({
                                      status: 500,
                                      message: "sql errosfjdf",
                                    });
                                  }

                                  // Start insert into Move in
                                  // Move in GraduateGrade
                                  const { GraduateGrade, TermId, GraduateSchool, TVillage, TDistrictId, TProvinceId, Remark } = req.body;
                                  if (GraduateGrade !== "" || TermId !== "" || GraduateSchool !== "" || TVillage !== "" || TDistrictId !== "" || TProvinceId !== "") {
                                    const sql = `INSERT INTO transfer_in (StudentId, GraduateGrade, TermId, FromSchoolName, Village, DistrictId, ProvinceId, Remark) values (?,?,?,?,?,?,?,?)`;
                                    conn.query(sql, [results[0].StudentId, GraduateGrade, TermId, GraduateSchool, TVillage, TDistrictId, TProvinceId, Remark]);
                                    //Start insert info of parent_profile
                                    conn.query(
                                      sqlInsert,
                                      [
                                        results[0].StudentId, f_Fname, f_Lname, f_Dob, f_Occupation, f_Position, f_Workplace, f_DistrictId, f_ProvinceId, f_Village, f_SectionVillage, f_Unit, f_HouseNumber, f_Religion, f_Tribe, f_Race, f_Nationality, f_Phone, f_Remark
                                      ]);
                                    conn.query(
                                      sqlInsert,
                                      [
                                        results[0].StudentId,
                                        m_Fname, m_Lname, m_Dob, m_Occupation, m_Position, m_Workplace, m_DistrictId, m_ProvinceId, m_Village, m_SectionVillage, m_Unit, m_HouseNumber, m_Religion, m_Tribe, m_Race, m_Nationality, m_Phone, m_Remark,
                                      ]);
                                    res.json({ status: 200, message: ' insert success...' })
                                    //End insert info of Parent_profile
                                  }
                                  else if (GraduateGrade === "" || TermId === "" || GraduateSchool === "" || TVillage === "" || TDistrictId === "" || TProvinceId === "") {
                                    //Start insert info of parent_profile
                                    conn.query(
                                      sqlInsert,
                                      [
                                        results[0].StudentId,
                                        f_Fname,
                                        f_Lname,
                                        f_Dob,
                                        f_Occupation,
                                        f_Position,
                                        f_Workplace,
                                        f_DistrictId,
                                        f_ProvinceId,
                                        f_Village,
                                        f_SectionVillage,
                                        f_Unit,
                                        f_HouseNumber,
                                        f_Religion,
                                        f_Tribe,
                                        f_Race,
                                        f_Nationality,
                                        f_Phone,
                                        f_Remark,
                                      ],
                                      (err, result) => {
                                        if (err) {
                                          console.log('father', err)
                                          res.json({
                                            status: 500,
                                            message: "sql err", err
                                          });
                                        } else {
                                          conn.query(
                                            sqlInsert,
                                            [
                                              results[0].StudentId,
                                              m_Fname,
                                              m_Lname,
                                              m_Dob,
                                              m_Occupation,
                                              m_Position,
                                              m_Workplace,
                                              m_DistrictId,
                                              m_ProvinceId,
                                              m_Village,
                                              m_SectionVillage,
                                              m_Unit,
                                              m_HouseNumber,
                                              m_Religion,
                                              m_Tribe,
                                              m_Race,
                                              m_Nationality,
                                              m_Phone,
                                              m_Remark,
                                            ],
                                            (err, result) => {
                                              if (err) {
                                                console.log(err)
                                                res.json({
                                                  status: 500,
                                                  message: "sql err", err
                                                });
                                              } else {
                                                res.json({
                                                  status: 200,
                                                  message: "inser success...",
                                                });
                                              }
                                            }
                                          );
                                        }
                                      }
                                    );//End insert info of Parent_profile
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                }
              );
            }
          });
        } else {
          res.json({ status: 403, message: "aready exists please..." });
        }
      }
    );
  },
  updateStudent: (req, res) => {
    const {
      FnameLao,
      LnameLao,
      FnameEng,
      LnameEng,
      Gender,
      Dob,
      BirthVillage,
      BirthDistrictId,
      BirthProvinceId,
      Village,
      DistrictId,
      ProvinceId,
      Religion,
      Tribe,
      Nationality,
      Race,
      Phone_one,
      Phone_two,
      Remark,
      UserId,
      StudentId
    } = req.body;
    if (BirthDistrictId === "" && BirthProvinceId === "" && DistrictId === "" && ProvinceId === "") {
      conn.query("UPDATE student_profile set FnameLao=?, LnameLao=?, FnameEng=?, LnameEng=?, Gender=?, Dob=?, BirthVillage=?, Village=?, Religion=?, Tribe=?, Nationality=?, Race=?, Phone_one=?, Phone_two=?, Remark=?, UserId=? where StudentId=?",
        [
          FnameLao,
          LnameLao,
          FnameEng,
          LnameEng,
          Gender,
          Dob,
          BirthVillage,
          Village,
          Religion,
          Tribe,
          Nationality,
          Race,
          Phone_one,
          Phone_two,
          Remark,
          UserId,
          StudentId
        ], (err, result) => {
          if (err) {
            console.log(err)
            res.json({ status: 500, message: 'sql have anny error!!!' });
          }
          else {
            res.json({ status: 200, message: 'update success fully....' });
          }
        });
    } else if (BirthDistrictId == "" || BirthProvinceId == "") {
      conn.query("UPDATE student_profile set FnameLao=?, LnameLao=?, FnameEng=?, LnameEng=?, Gender=?, Dob=?, BirthVillage=?,Village=?, DistrictId=?, ProvinceId=?, Religion=?, Tribe=?, Nationality=?, Race=?, Phone_one=?, Phone_two=?, Remark=?, UserId=? where StudentId=?",
        [
          FnameLao,
          LnameLao,
          FnameEng,
          LnameEng,
          Gender,
          Dob,
          BirthVillage,
          Village,
          DistrictId,
          ProvinceId,
          Religion,
          Tribe,
          Nationality,
          Race,
          Phone_one,
          Phone_two,
          Remark,
          UserId,
          StudentId
        ], (err, result) => {
          if (err) {
            console.log(err)
            res.json({ status: 500, message: 'sql have anny error!!!' });
          }
          else {
            res.json({ status: 200, message: 'update success fully....' });
          }
        });
    } else if (DistrictId == "" || ProvinceId == "") {
      conn.query("UPDATE student_profile set FnameLao=?, LnameLao=?, FnameEng=?, LnameEng=?, Gender=?, Dob=?, BirthVillage=?, BirthDistrictId=?, BirthProvinceId=?, Village=?, Religion=?, Tribe=?, Nationality=?, Race=?, Phone_one=?, Phone_two=?, Remark=?, UserId=? where StudentId=?",
        [
          FnameLao,
          LnameLao,
          FnameEng,
          LnameEng,
          Gender,
          Dob,
          BirthVillage,
          BirthDistrictId,
          BirthProvinceId,
          Village,
          Religion,
          Tribe,
          Nationality,
          Race,
          Phone_one,
          Phone_two,
          Remark,
          UserId,
          StudentId
        ], (err, result) => {
          if (err) {
            console.log(err)
            res.json({ status: 500, message: 'sql have anny error!!!' });
          }
          else {
            res.json({ status: 200, message: 'update success fully....' });
          }
        });
    } else {
      conn.query("UPDATE student_profile set FnameLao=?, LnameLao=?, FnameEng=?, LnameEng=?, Gender=?, Dob=?, BirthVillage=?, BirthDistrictId=?, BirthProvinceId=?, Village=?, DistrictId=?, ProvinceId=?, Religion=?, Tribe=?, Nationality=?, Race=?, Phone_one=?, Phone_two=?, Remark=?, UserId=? where StudentId=?",
        [
          FnameLao,
          LnameLao,
          FnameEng,
          LnameEng,
          Gender,
          Dob,
          BirthVillage,
          BirthDistrictId,
          BirthProvinceId,
          Village,
          DistrictId,
          ProvinceId,
          Religion,
          Tribe,
          Nationality,
          Race,
          Phone_one,
          Phone_two,
          Remark,
          UserId,
          StudentId
        ], (err, result) => {
          if (err) {
            console.log(err)
            res.json({ status: 500, message: 'sql have anny error!!!' });
          }
          else {
            res.json({ status: 200, message: 'update success fully....' });
          }
        });
    }

  },
  findAll: (req, res) => {
    conn.query(
      "select a.*,b.*,c.*,d.*,e.*, Date_FORMAT(c.Dob, '%d/%m/%Y')as Dob from provinces as a, districts as b, student_profile as c, Districts as d, Provinces as e where c.BirthDistrictId=b.DistrictId and c.BirthProvinceId=a.ProvinceId and c.DistrictId=d.DistrictId and c.ProvinceId=e.ProvinceId",
      (error, result) => {
        if (error) throw error;
        res.json(result);
      }
    );
  },
  findOne_getStudentNumber: (req, res) => {
    const StudentNumber = req.params.StudentNumber;
    conn.query(
      "select a.*,b.*,c.*,d.*,e.*, Date_FORMAT(c.Dob, '%d/%m/%Y')as Dob from provinces as a, districts as b, student_profile as c, Districts as d, Provinces as e where c.BirthDistrictId=b.DistrictId and c.BirthProvinceId=a.ProvinceId and c.DistrictId=d.DistrictId and c.ProvinceId=e.ProvinceId and c.StudentNumber=?", [StudentNumber],
      (error, result) => {
        if (error) throw error;
        res.json(result[0]);
      }
    );
  },
  findAll_new_with_old: (req, res) => {
    conn.query("select * ,Date_FORMAT(Dob, '%d/%m/%Y') as Dob from student_profile", (error, result) => {
      if (error) throw error;
      res.json(result);
    });
  },
  findOne: (req, res) => {
    const StudentId = req.params.StudentId;

    // ສະແດງເມືອງເກີດນັກຮຽນ
    const student_birthdistrict = "c.DistrictName as BirthDistrictName,d.ProvinceName as BirthProvinceName,g.DistrictName as DistrictName,h.ProvinceName as ProvinceName,e.DistrictName as p_DistrictName,f.ProvinceName as p_ProvinceName"

    conn.query(
      `select a.*, Date_FORMAT(a.Dob, '%d/%m/%Y') as Dob , ${student_birthdistrict}, aa.*,dd.TermName, aa.village as SchoolFromVill, bb.ProvinceName as SchoolFromPro, cc.DistrictName as SchoolFromDis from student_profile as a, districts as c, provinces as d, districts as e, provinces as f, districts as g, provinces as h, transfer_in as aa, provinces as bb, districts as cc, school_term as dd where a.DistrictId=g.DistrictId and a.ProvinceId=h.ProvinceId and a.BirthDistrictId=c.Districtid and a.BirthProvinceId=d.ProvinceId and a.StudentId=aa.StudentId and aa.ProvinceId=bb.ProvinceId and aa.TermId=dd.TermId and aa.DistrictId=cc.DistrictId and a.StudentId=?`,
      [StudentId],
      (error, result) => {
        const data1 = result
        if (error) throw error;
        const parent_data = "b.ParentId,b.Fname as p_Fname, b.Lname as p_Lname, Date_FORMAT(B.Dob, '%d/%m/%Y') as p_Dob, b.Occupation as p_Occupation, b.Position as p_Position, b.Workplace as p_Workplace, b.DistrictId as p_DistrictId, b.ProvinceId as p_ProvinceId, b.Village as p_Village, b.SectionVillage as p_SectionVillage, b.Unit as p_Unit, b.HouseNumber as p_HouseNumber, b.Religion as p_Religion, b.Tribe as p_Tribe, b.Race as p_Race, b.Nationality as p_Nationality, b.Phone as p_Phone, b.Remark as p_Remark"

        // ສະແດງເມືອງເກີດນັກຮຽນ
        const student_birthdistrict = "c.DistrictName as BirthDistrictName"

        // ສະແດງແຂວງເກີດນັກຮຽນ
        const student_birthprovince = "d.ProvinceName as BirthProvinceName"

        // ສະແດງເມືອງປັດຈຸບັນນັກຮຽນ
        const student_presentdistrict = "g.DistrictName as DistrictName"

        // ສະແດງແຂວງປັດຈຸບັນນັກຮຽນ
        const student_presentprovince = "h.ProvinceName as ProvinceName"

        // ສະແດງເມືອງປັດຈຸບັນຂອງຜູ້ປົກຄອງ
        const parent_presentdistrict = "e.DistrictName as p_DistrictName"

        // ສະແດງແຂວງປັດຈຸບັນຂອງຜູ້ປົກຄອງ
        const parent_presentprovince = "f.ProvinceName as p_ProvinceName"


        conn.query(
          `select a.*, Date_FORMAT(a.Dob, '%d/%m/%Y') as Dob , ${parent_data}, ${student_birthdistrict}, ${student_birthprovince}, ${parent_presentdistrict}, ${parent_presentprovince}, ${student_presentdistrict}, ${student_presentprovince},j.Point, j.PointScore from student_profile as a, parent_profile as b, districts as c, provinces as d, districts as e, provinces as f, districts as g, provinces as h, member_classroom as i, student_point as j where a.StudentId=i.StudentId and i.MemberId=j.MemberId and a.StudentId=b.StudentId and a.DistrictId=g.DistrictId and a.ProvinceId=h.ProvinceId and b.DistrictId=e.DistrictId and b.ProvinceId=f.ProvinceId and a.BirthDistrictId=c.Districtid and a.BirthProvinceId=d.ProvinceId and a.StudentId=?`,
          [StudentId],
          (error, results) => {
            if (error) throw error;
            const data2 = results
            conn.query(`SELECT a.FnameLao, a.StudentImage, a.LnameLao, a.FnameEng, a.LnameEng, a.Gender, Date_format(a.Dob, \'%m/%d/%Y\') as Dob, b.*, b.Remark as mass_remark, Date_format(b.DateEntry, \'%m/%d/%Y\') as DateEntry FROM student_profile as a, mass_organization as b where a.StudentId=b.StudentId and b.StudentId=?`, [StudentId], (err, results) => {
              if (err) throw err;
              const students_to_MassOrg = results;

              const groupedStudents_to_MassOrg = Object.values(students_to_MassOrg.reduce((acc, cur) => {
                if (acc[cur.StudentId]) {
                  acc[cur.StudentId].MassOrgName.push(cur.MassOrgName);
                  acc[cur.StudentId].MassOrgName.push(cur.SchoolFromPro);
                  acc[cur.StudentId].mass_remark.push(cur.mass_remark);
                  acc[cur.StudentId].DateEntry.push(cur.DateEntry);
                } else {
                  acc[cur.StudentId] = {...cur, SchoolFromPro:[cur.SchoolFromPro], MassOrgName: [cur.MassOrgName], mass_remark: [cur.mass_remark], DateEntry: [cur.DateEntry]};
                }
                return acc;
              }, {}));

              const data4 = groupedStudents_to_MassOrg.map(student => ({
                StudentId: student.StudentId,
                MassOrgid: student.MassOrgid,
                DateEntry: student.DateEntry,
                MassOrgName: [...new Set(student.MassOrgName)],
                mass_remark: [...new Set(student.mass_remark)],
                SchoolFromPro: [...new Set(student.SchoolFromPro)],
              }));

              const data3 = data4;
              const myresult = data2.map(student => {
                const matchingStudent2 = data1.find(s => s.id === student.id);
                const matchingStudent3 = data3.find(s => s.id === student.id) || {};
                return {
                  ...student,
                  ...matchingStudent2,
                  ...matchingStudent3,
                  MassOrgName: matchingStudent3.MassOrgName || "",
                  DateEntry: matchingStudent3.DateEntry || "",
                  mass_remark: matchingStudent3.mass_remark || ""
                };
              });
              res.json(myresult) 
              // console.log(groupedStudents_to_MassOrg)
            })
          }
        );
      }
    );
  },
  get_findOne: (req, res) => {
    const StudentId = req.params.StudentId;
    conn.query(
      "select a.*,b.*,c.*, Date_FORMAT(c.Dob, '%d-%m-%Y')as Dob,d.ProvinceName as birthP, e.DistrictName as birthD from provinces as a, districts as b, student_profile as c, provinces as d, districts as e where c.BirthDistrictId=e.DistrictId and c.BirthProvinceId=d.ProvinceId and c.DistrictId=b.DistrictId and c.ProvinceId=a.ProvinceId and StudentId=?",
      [StudentId],
      (error, result) => {
        if (error) throw error;
        res.json(result[0]);
      }
    );
  },
  delet: (req, res) => {
    const StudentId = req.params.StudentId;
    conn.query(
      "delete from student_profile where StudentId=?",
      [StudentId],
      (error, result) => {
        if (error) {
          res.json({ status: 404, message: "delete field" });
        }
        conn.query("");
        res.json({
          status: 200,
          message: "delete success",
        });
      }
    );
  },

  Edit: (req, res) => {
    const {
      StudentNumber,
      FnameLao,
      LnameLao,
      FnameEng,
      LnameEng,
      Dob,
      BirthVillage,
      BirthDistrictId,
      BirthProvinceId,
      Village,
      DistrictId,
      ProvinceId,
      Religion,
      Tribe,
      Nationality,
      Race,
      Phone_one,
      Phone_two,
      GraduateGrade,
      GraduateSchool,
      TermId,
      Remark,
      UserId,
    } = req.body;
    const StudentImage = req.file.filename;
    // const StudentNumber = Math.floor(Math.rando m() * 10000) + 45242;
    conn.query(
      "update student_profile set StudentImage=?, FnameLao=?, LnameLao=?, FnameEng=?, LnameEng=?, Dob=?, BirthVillage=?, BirthDistrictId=?, BirthProvinceId=?, Village=?, DistrictId=?, ProvinceId=?, Religion=?, Tribe=?, Nationality=?, Race=?, Phone_one=?, Phone_two=?, GraduateGrade=?, GraduateSchool=?, TermId=?, Remark=?, UserId=? where StudentNumber=?",
      [
        StudentImage,
        FnameLao,
        LnameLao,
        FnameEng,
        LnameEng,
        Dob,
        BirthVillage,
        BirthDistrictId,
        BirthProvinceId,
        Village,
        DistrictId,
        ProvinceId,
        Religion,
        Tribe,
        Nationality,
        Race,
        Phone_one,
        Phone_two,
        GraduateGrade,
        GraduateSchool,
        TermId,
        Remark,
        UserId,
        StudentNumber,
      ],
      (error, result) => {
        if (error) {
          console.log(error);
          res.json({
            status: 404,
            message: "ERROR!: 404 Not fount any feild",
          });
        }
        //
        else {
          console.log(result);
          res.json({ status: 200, message: "success fully..." });
        }
      }
    );
  },
}

module.exports = student_profiles;
