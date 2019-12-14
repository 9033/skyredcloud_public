/*
expliot delayer
*/
const ipaddr={};

const filterset=[
    'cgi',
    'php',
    'jsp',
    'admin',
    'manager',
    'czjl',
    'webdav',
    'account',
    'shell',
    'GponForm',
    'muieblackcat',
    'HNAP1',
    'ccvv',
];
const regfilter=new RegExp(filterset.join('|'),'i');

function test(t_url){
    return t_url.search(regfilter)==-1;//not found is true
    // return filterset.map(c=>t_url.search(new RegExp(c,'i'))).every(r=>r==-1);
}

function middd(req,res,next){
    //console.log(req.ip);czjl manager /.
    // if((req.originalUrl).search(/(cgi)|(php)|(admin)|(manager)|(czjl)|(webdav)|(manager)/)!==-1){}
    // console.log(req.ip);
    if(!test(req.originalUrl)){
        // console.log("haha");

        // console.log(req.ip,' ?');
        // setTimeout(()=>{
        //     next();
        // },1000*3)        


        // console.log('ip : ',req.ip);
        // console.log('ip : ',req.ips);
        // console.log('ip : ',req.headers['x-forwarded-for']);
        // console.log('ip : ',req.connection.remoteAddress);
        // if(ipaddr.includes(req.ip)){

        if(ipaddr.hasOwnProperty(req.ip)){
            try{
                ipaddr[req.ip]++;
                // console.log(req.ip,' ',ipaddr[req.ip]);
            }
            catch(e){
                ipaddr[req.ip]=1;
            }
        }
        else{
            ipaddr[req.ip]=1;
        }
        // console.log(req.ip,' ',ipaddr[req.ip],' delay ',2000*ipaddr[req.ip]);
        if(ipaddr[req.ip]<10){
            setTimeout((ip) => {
                if(ipaddr.hasOwnProperty(ip)){
                    ipaddr[ip]--;
                    // console.log(req.ip,' ',ipaddr[req.ip]);
                    if(ipaddr[ip]<=0){
                        delete ipaddr[ip];
                    }
                }
                next();
            }, 2000*ipaddr[req.ip], req.ip);
        }
        // console.log(ipaddr.includes(req.ip));

        
        // var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        // setTimeout(next,1000,0);
    }
    else{ 
        next();
    }
}

module.exports=middd;

