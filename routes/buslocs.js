var express = require('express');
var router = express.Router();

// const pug = require('pug');
// const fs = require('fs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
// var path = require('path');
var url=require('url');
const qs=require('querystring');
// var path = require('path');
// const sequelize = new Sequelize('./busloc.sqlite3');

const busloc=require('../db/busloc');
// const buslocdate=require('../db/buslocdate');

async function cntbuslocbymonth(routeid,year,month){
    //해당하는 년-월의 각 날짜마다 해당 노선의 자료가 있는지 없는지 받음.
    let ret1=[];
    let ndate=new Date();
    ndate.setUTCFullYear(year,month-1,1);
    ndate.setUTCHours(4,0,0,0);
    let edate=new Date();
    edate.setUTCFullYear(year,month-1,2);
    edate.setUTCHours(4,0,0,0);

    let xdate=new Date();//해당 월에 마지막 날.
    xdate.setUTCFullYear(year,month+1-1,0);
    xdate.setUTCHours(4,0,0,0);

    for(;ndate<=xdate;){
        let rs=null;
        try{
            rs=await busloc.count({
                where:{
                    routeid,
                    time:{
                        [Op.gte]: ndate,
                        [Op.lt]: edate,
                    },
                },
            });
        }
        catch(e){
            console.error(e);
        }
        ndate.setUTCDate(ndate.getUTCDate()+1);
        edate.setUTCDate(edate.getUTCDate()+1);        
        //console.log('cntbuslocbymonth',ndate,rs);
        ret1.push(rs);
    }
    // console.log(ret1);
    return ret1;
}
router.get('/xx', async function(req, res, next) {
    const urlp = url.parse(req.url);
    const {query}=urlp;
    const qparse=qs.parse(query);

    let routeid=qparse.r!=undefined?String(qparse.r):'232000092';
    let y=qparse.y!=undefined?Number(qparse.y):2018;
    let m=qparse.m!=undefined?Number(qparse.m):8;
    // let d=qparse.d!=undefined?Number(qparse.d):11;

    const aeee=await cntbuslocbymonth(routeid,y,m);
    // console.log( 'xx' );
    res.end(JSON.stringify(aeee));
});

/*
async function initbuslocdate(){
    let ndate=new Date();
    ndate.setUTCFullYear(2018,8-1,1);
    ndate.setUTCHours(4,0,0,0);
    let edate=new Date();
    edate.setUTCFullYear(2018,8-1,2);
    edate.setUTCHours(4,0,0,0);

    let xdate=new Date();
    xdate.setUTCFullYear(2018,9-1,0);
    xdate.setUTCHours(4,0,0,0);

    for(;ndate<=xdate;){
        const rs=await busloc.count({
            where:{
                routeid:'232000092',
                time:{
                    [Op.gte]: ndate,
                    [Op.lt]: edate,
                },
            },
        });
        ndate.setUTCDate(ndate.getUTCDate()+1);
        edate.setUTCDate(edate.getUTCDate()+1);
        // console.log('initbuslocdate',ndate,rs);
        if(0<rs){
            await buslocdate.create({
                routeid:'232000092',
                year:ndate.getUTCFullYear(),
                month:ndate.getUTCMonth()+1,
                day:ndate.getUTCDate(),
                count:rs,
            });
        }
    }
    const r=await buslocdate.findAll({attributes:['routeid','year','month','day','count'],});
    r.forEach(t=>console.log(t.get()));
}   
//initbuslocdate();
*/
let buss={};
buss['232000092']=["time","구래리차고지","금성백조예미지","김포한강3차푸르지오","한가람마을우미린.호수이편한세상","구래환승센터","솔터마을입구","힐스테이트.경남아너스빌","은여울공원","수자인.호반아파트","모아미래도","운양.용화사IC(미정차)","김포한강신도시IC(미정차)","한강시네폴리스IC(미정차)","신곡IC(미정차)","88JC(미정차)","가양대교남단(미정차)","성산대교남단(미정차)","당산역","당산역","성산대교남단(미정차)","가양대교남단(미정차)","88JC(미정차)","신곡IC(미정차)","한강시네폴리스IC(미정차)","김포한강신도시IC(미정차)","운양.용화사IC(미정차)","모아미래도","수자인.호반아파트","은여울공원","힐스테이트.경남아너스빌","솔터마을입구","구래환승센터","호수마을이편한세상.한가람우미린","김포한강3차푸르지오","금성백조예미지","구래리차고지(미정차)"];

let bussturn={};
bussturn['232000092']=[18,19,18];

let routename={};
routename['232000092']='7000번 (김포-서울)';

const busloc_ipaddr=new Set();

const buslocdelay=(req,res,next)=>{
    console.log('buslocdelay',busloc_ipaddr);
    // next();
    if(!busloc_ipaddr.has(req.ip)){
        busloc_ipaddr.add(req.ip);
        setTimeout((ip)=>{
            next();
            busloc_ipaddr.delete(ip);
        },500, req.ip);
    }
    else{
        // res.redirect('back');
        // res.end('<script>document.location=document.location</script>');
        // setTimeout((ip)=>{
        //     next();
        // },2000, req.ip);
        // res.end();
        // next(createError(404));
        // res.status(403).send('s');
    }
    //req.isAuthenticated()?next():res.status(403).send('로그인 필요');
};
router.get('/',buslocdelay, async function(req, res, next) {
    const urlp = url.parse(req.url);
    const {query}=urlp;
    const qparse=qs.parse(query);

    let routeid=qparse.r!=undefined?String(qparse.r):'232000092';
    let y=qparse.y!=undefined?Number(qparse.y):2018;
    let m=qparse.m!=undefined?Number(qparse.m):8;
    let d=qparse.d!=undefined?Number(qparse.d):11;

    let dgte=new Date(0);

    dgte.setUTCFullYear(y,m-1,d);
    dgte.setUTCHours(4,0,0,0);

    let dlt=new Date(0);

    dlt.setUTCFullYear(y,m-1,d+1);
    dlt.setUTCHours(4,0,0,0);

    y=dgte.getUTCFullYear();
    m=dgte.getUTCMonth()+1;
    d=dgte.getUTCDate();
    try{
        const r=await busloc.findAll({
            where:{
                routeid,
                time:{
                    [Op.gte]: dgte,
                    [Op.lt]: dlt,
                },
            }
            ,attributes:['time','plateno','remainseatcnt','stationseq']
            //,limit:100
            //,offset:o
            ,order:[['time','ASC']]
        });
        let ret=[];
        let atime=null;
        let retidx=-1;
        for(i in r){
            t=r[i].get();
            if(t.time!=atime){
                atime=t.time;            
                retidx+=1;
                // ret[retidx]=[];
                ret[retidx]=new Array(buss[routeid].length);

                ret[retidx][0]=t.time;
            }
            ret[retidx][t.stationseq]={plateno:t.plateno,remainseatcnt:t.remainseatcnt};
        }
        res.render('bus/busloc.pug',{title:'busloc',routename:routename[routeid],ret:ret,buss:buss[routeid],date:[y,m,d],bust:bussturn[routeid]});        
    }
    catch(e){
        console.error(e);
        res.end();
    }
});
router.get('/x', buslocdelay, function(req, res, next) {
    const urlp = url.parse(req.url);
    const {query}=urlp;
    const qparse=qs.parse(query);
    // console.log(req.body);
    let routeid=qparse.r!=undefined?String(qparse.r):'232000092';
    let y=qparse.y!=undefined?Number(qparse.y):2018;
    let m=qparse.m!=undefined?Number(qparse.m):8;
    let d=qparse.d!=undefined?Number(qparse.d):11;
    // let p=10;
    // let o=0;
    // if(qparse.p!=undefined){
    //     o=p*qparse.p;
    // }
    // console.log(y,m,d);
    let dgte=new Date(0);
    // dgte.setTime(0);
    dgte.setUTCFullYear(y,m-1,d);
    dgte.setUTCHours(4,0,0);

    let dlt=new Date(0);
    // dlt.setTime(0);
    dlt.setUTCFullYear(y,m-1,d+1);
    dlt.setUTCHours(4,0,0);

    d=dgte.getUTCDate();
    m=dgte.getUTCMonth()+1;
    y=dgte.getUTCFullYear();
    // console.log(y,m,d);
    
    busloc.findAndCountAll({
        where:{
            routeid,
            time:{
                [Op.lt]: dlt,
                [Op.gte]: dgte
            },
        }
        ,attributes:['time','plateno','remainseatcnt','stationseq']
        //,limit:100
        //,offset:o
        ,order:[['time','ASC']]
    }).then(r => {
        let ret=[];
        // console.log('cnt : ',r.count);
        // console.log('cnt : ',r.rows);
        // for(i in r){
        //     console.log(r[i].get());
        // }
        // console.log(r.length);
        // console.log(JSON.stringify(r));
        let atime=null;
        let retidx=-1;
        for(i in r.rows){
            t=r.rows[i].get();
            if(t.time!=atime){
                atime=t.time;            
                retidx+=1;
                // ret[retidx]=[];
                ret[retidx]=new Array(buss[routeid].length);
    
                ret[retidx][0]=t.time;
            }
            ret[retidx][t.stationseq]={plateno:t.plateno,remainseatcnt:t.remainseatcnt};
        }
        //console.log(JSON.stringify(ret));
        // res.render('bus/busloc.pug',{ret:ret,buss:buss[routeid],date:`${y}-${m}-${d}`,bust:bussturn[routeid]});        
        res.render('bus/busloc.pug',{title:'busloc',ret:ret,buss:buss[routeid],date:[y,m,d],bust:bussturn[routeid]});        
        // let html=pug.renderFile('../db/busloc.pug',{ret:ret,buss:buss['232000092']});        
        // fs.writeFile('busloc.html', html, (err) => {
        //     if (err) throw err;
        //     console.log('The file has been saved!');
        // });
    }).catch(e=>{
        console.error(e);
    });
    // res.send('respond with a resource');
});
  
module.exports = router;    




//console.log(buss['232000092'].length);