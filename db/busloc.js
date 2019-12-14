// const pug = require('pug');
// const fs = require('fs');
const Sequelize = require('sequelize');
// var path = require('path');
// const sequelize = new Sequelize('./busloc.sqlite3');
const sequelize = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: 'db/busloc.sqlite3'
});
//module.exports=(sequelize, DataTypes) =>{
const busloc=sequelize.define('busloc',{
    item_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
    },
    time:{
        type:Sequelize.DATE,
        allowNull:false,
    },
    plateno:{
        type:Sequelize.STRING(24),
        allowNull:true,
    },
    remainseatcnt:{
        type:Sequelize.INTEGER.UNSIGNED,
        allowNull:true,
    },
    routeid:{
        type:Sequelize.STRING(16),
        allowNull:true,
    },
    stationid:{
        type:Sequelize.STRING(16),
        allowNull:true,
    },
    stationseq:{
        type:Sequelize.INTEGER.UNSIGNED,
        allowNull:true,
    },
},{
    timestamps:false,
    freezeTableName: true,
    tableName: 'busloc',
});
module.exports=busloc;
// buss={}
// buss['232000092']=["time","구래리차고지","금성백조예미지","김포한강3차푸르지오","한가람마을우미린.호수이편한세상","구래환승센터","솔터마을입구","힐스테이트.경남아너스빌","은여울공원","수자인.호반아파트","모아미래도","운양.용화사IC(미정차)","김포한강신도시IC(미정차)","한강시네폴리스IC(미정차)","신곡IC(미정차)","88JC(미정차)","가양대교남단(미정차)","성산대교남단(미정차)","당산역","당산역","성산대교남단(미정차)","가양대교남단(미정차)","88JC(미정차)","신곡IC(미정차)","한강시네폴리스IC(미정차)","김포한강신도시IC(미정차)","운양.용화사IC(미정차)","모아미래도","수자인.호반아파트","은여울공원","힐스테이트.경남아너스빌","솔터마을입구","구래환승센터","호수마을이편한세상.한가람우미린","김포한강3차푸르지오","금성백조예미지","구래리차고지(미정차)"];
    
// busloc.findAll({
//     where:{routeid:'232000092'}
//     ,attributes:['time','plateno','remainseatcnt','stationseq']
//     ,limit:10
//     ,offset:0
//     ,order:[['time','ASC']]
// }).then(r => {
//     let ret=[];
//     // for(i in r){
//     //     console.log(r[i].get());
//     // }
//     // console.log(r.length);
//     // console.log(JSON.stringify(r));
//     let atime=null;
//     let retidx=-1;
//     for(i in r){
//         t=r[i].get();
//         if(t.time!=atime){
//             atime=t.time;            
//             retidx+=1;
//             // ret[retidx]=[];
//             ret[retidx]=new Array(buss['232000092'].length);

//             ret[retidx][0]=t.time;
//         }
//         ret[retidx][t.stationseq]={plateno:t.plateno,remainseatcnt:t.remainseatcnt};
//     }
//     //console.log(JSON.stringify(ret));
//     let html=pug.renderFile(path.join(__dirname, 'busloc.pug'),{ret:ret,buss:buss['232000092']});
//     fs.writeFile('busloc.html', html, (err) => {
//         if (err) throw err;
//         console.log('The file has been saved!');
//     });
// });

// //console.log(buss['232000092'].length);