const express = require('express');
const router = express.Router();
let UniversityCourseInfo = require('../model/universityCourseInfo');
let School = require('../model/school');
// get 學校資訊頁面
router.get('/',function(req,res){
    res.render('schoolInfo');
})

router.get('/getSchoolName',function(req,res){
    School.find({},function(err,schools){
        let schoolName = [];
        schools.forEach(school => {
            if(!schoolName.includes(school.schoolName)){
                schoolName.push(school.schoolName)
            }
        });
        res.json({"schoolName":schoolName})
    })
})

router.get('/getYear',function(req,res){
    UniversityCourseInfo.find({},function(err,datas){
        let years = [];
        datas.forEach(data => {
            if(!years.includes(data.years)){
                data.push(data.years);
            }
        })
        res.json({"years":data})
    })
})

router.get('/getCourseDetail/:id',function(req,res){
    UniversityCourseInfo.find({_id:req.params.id},function(err,datas){
        res.json({data:datas[0]})
    })
})


router.post('/search',function(req,res){
    let data = req.body;
    console.log(data);

    let option = {}

    if(data.year != ""){
        option['year'] = data.year
    }
    if(data.semester != ""){
        option['semester'] = data.semester
    }
    if(data.schoolLevel != ""){
        option['schoolSystem'] = data.schoolLevel
    }

    if(data.courseName != ""){
        option['className'] = new RegExp(data.courseName)
    }

    UniversityCourseInfo.find(option,function(err,courses){
        if(err){

        }else{
            let schoolName = [];

            courses.forEach(course => {
                if(!schoolName.includes(course.schoolName)){
                    schoolName.push(course.schoolName)
                }
            })
            console.log(schoolName)

            if(option.className == undefined){
                School.find({},function(err,schools){
                    res.json({courses:courses,schoolName:schoolName})
                })
            }else{
                res.json({courses:courses,schoolName:schoolName})
            }
        }
    }).limit(500)
})
module.exports = router;