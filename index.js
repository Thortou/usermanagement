require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const conn = require('./config/database')
const session = require('express-session')

//Start inclue use API of User
// include use api user..
const user = require('./users/user/user.router');
const login = require('./users/login/login.router');
const profiles = require('./users/profile/profile.router')
const province = require('./users/province/province.router')
const district = require('./users/district/district.router')
const roles = require('./users/roles/roles.router')
const uhr = require('./users/user_has_roles/uhr.router') 
const permission = require('./users/permissions/permission.router')

//apiAndroid
const android = require('./users/userAndroid/user.router');
const loginAndroid = require('./users/userAndroid/login/login.router');
const androidScore = require('./android/android-score/android-score.router');
const app_studentP = require('./android/android-studentP/app-studentp.router')
//End inclue use API of users

//<....... ./school/school-term/router');
const school_term = require('./school/school-term/router')
const grade = require('./school/grade/router');
const classroom = require('./school/class-room/router');
const register = require('./school/invoice-register/router');
const item = require('./school/invoice-item/router');
const student_profiles = require('./school/student/student-profiles/router');
const demo = require('./demo/demo.routes');
const meber = require('./school/meber/meber.router');
const quardien = require('./school/student/quardien-students/quardien.router');
const subject = require('./school/Subject/subject.router');
const timetable = require('./school/Timetable/timetable.router');
const regulation = require('./school/regulation/regulation.router');
const studentPoint = require('./school/student/student-point/student-point.router');
const deductPoint = require('./school/student/deduct_studentPoint/deduct.router');
const score = require('./school/student/score-students/score.router');
const organization = require('./school/student/Organization/organization.router');
const organization_youth = require('./school/student/youth/youth.router');
const move_out = require('./school/move in-out/move-out/move-out.router');
const move_in = require('./school/move in-out/move-in/move-in.router')
const drop_school = require('./school/drop-out/drop-out.router');
const RentBooks = require('./school/rent-books/rent..router');
const missDay = require('./school/student/miss-students/miss-student.router')
//...............Please Writting The Code......................

//<.......Start include use API Product.......>
function errHandler(err, req, res, next) {
    if(err instanceof multer.MulterError) {
       res.json({status:'err', message: err.message})
    }
 }
 app.use(errHandler);

// use cors

app.use(cors());
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(session({ 
    secret: 'webslesson',
    resave: true,
    saveUninitialized: true
}));
 

// Start Using The API in user 
app.use('/apiuser', user); //api User
app.use('/apilogin',express.static('./public/img'), login); // api Login
app.use('/apiprofile',express.static('./public/img'), profiles)  // api Profiles
app.use('/apiprovince', province) //api Province
app.use('/apidistrict', district) //API district
app.use('/apiroles', roles) //API Roles
app.use('/apihr', uhr) //API User_has_roles
app.use('/apiperm',permission) //Permission

//api Android
app.use('/apiAndroid/user', android);
app.use('/apiloginAndroid', loginAndroid); 
app.use('/apiAndroidscore', androidScore);
app.use('/apiAndroidstudentP',express.static('./school/student/student-profiles/img'), app_studentP)


// end Using The API in user 

// apiAndroid/create 
 
 
//start using the api in api/product

app.use('/apiSchoolTerm', school_term);
app.use('/apiGrade', grade);
app.use('/apiClassroom', classroom);
app.use('/apiInvoiceRegister', register);
app.use('/apiItem', item);
app.use('/apiStudentProfile', express.static('./school/student/student-profiles/img'), student_profiles);
app.use('/apidemo', demo);
app.use('/apimember', meber);
app.use('/apiquardien', quardien);
app.use('/apiSubject', subject);
app.use('/apiTimetable', timetable);
app.use('/apiRegulation', regulation);
app.use('/apiStudentPoint', studentPoint);
app.use('/apiDeductpoint', deductPoint);
app.use('/apiScore', score);
app.use('/apiOrganization', express.static('./school/student/student-profiles/img'), organization);
app.use('/apiYouth', express.static('./school/student/student-profiles/img'), organization_youth);
app.use('/apiMoveout', move_out);
app.use('/apiMOvein', move_in);
app.use('/apiDropout', drop_school);
app.use('/apiRentbook', RentBooks);
app.use('/apiMissing', missDay)

//end using the api in api/product



//count-profileID
app.get('/countprofile', async(req, res) => {
    try {
        conn.query("SELECT count(ProfileId)as count FROM Profiles where Gender='ຍິງ'", (err, result) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            if(!result){
                res.json({message:"0"})
            }
            res.json(result[0]);
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
})

// Count UserID
app.get('/countuser', async(req, res) => {
try {
    conn.query("SELECT count(UserId)as count FROM Users", (err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).send(); 
        }
        if(!result){
            res.json({message:"0"})
        }
        res.json(result[0]);
    })
} catch (err) {
    return res.status(500).send();
}
})

//Count Roles_has_users
app.get("/countuserhr", (req, res) => {
conn.query("select count(b.RoleId)as count from users as a, users_has_roles as b, roles as c where a.userid=b.userid and b.roleid=c.roleid and c.Rolename='user' ", (err, result)=>{
    if(err){
        res.send(err)
    }
    res.json(result[0])
})
})
//Count Roles_has_users
app.get("/countnoprofile", (req, res) => {
conn.query("select count(UserId) as count from Profiles where Gender='ຊາຍ' ", (err, result)=>{
    if(err){
        res.send(err)
    }
    res.json(result[0])
})
}) 

//exples
app.get("/newuser", (req, res) => {
conn.query("select Username, Email, Mobile from users where userId not in (select userId from users_has_roles);", (err, result) => {
    if (err) {
        res.json({ message: "err", err })
    }
    console.log(result)
    return res.status(201).json(result)
})
});

app.use('/', (req, res) => {
    res.json('Welcome to Backend API Try \n You can Run: URL, Postman, Insomnia localhost:8000')
})

conn.connect(function(err){ 
    if(err)throw err;
    console.log('You can Run: URL, Postman, Insomnia localhost:8000')
})

app.listen(process.env.APP_PORT, (req,res) => {
    console.log('Server is running on port ', process.env.APP_PORT) 
})