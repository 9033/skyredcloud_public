# import requests

# #r=requests.get("http://skyred.cloud")

# # print(r)
# # print(r.text)
# # print(r.content)

# import urllib.request as req

# # r=req.urlopen("http://skyred.cloud")
# # print(r.read())


# import json

# j=json.dumps([1,2,3,4])

# print(j)

from bs4 import BeautifulSoup

import sqlite3
import os
from pathlib import Path
conn = sqlite3.connect('busloc.sqlite3')

cur=conn.cursor()

def init_busloc():
    cur.execute("""
    DROP TABLE IF EXISTS busloc;
    """)
    cur.execute("""
    CREATE TABLE busloc(
        item_id INTEGER PRIMARY KEY,
        time DATE NOT NULL,
        plateno VARCHAR(24),
        remainseatcnt INTEGER UNSIGNED,
        routeid VARCHAR(16),
        stationid VARCHAR(16),
        stationseq INTEGER UNSIGNED    
    );
    """)
    conn.commit()

def readxmltodb(xml,db):
    # fs=open('bus-232000047-17.xml','rt',encoding='utf-8')
    # fs=open('bus-241005900-0.xml','rt',encoding='utf-8')
    # fs=open('bus-undefined-0.xml','rt',encoding='utf-8')
    # fs=open(file,'rt',encoding='utf-8')

    # xml=fs.read()

    # print(xml)

    soup=BeautifulSoup(xml,'html.parser')

    # print(soup.response.msgheader.querytime.string)

    # print(soup.find('querytime')==None)
    if( soup.find('querytime')==None):
        return 0

    buslocationlists=soup.find_all('buslocationlist')
    # for bus in buslocationlists:
    #     print(bus)

    for bus in buslocationlists:
        db.execute("""
        INSERT INTO busloc(time, plateno,remainseatcnt,routeid,stationid,stationseq) VALUES(?, ?,?,?,?,?);
        """,
        (soup.find('querytime').string,
        bus.plateno.string,
        bus.remainseatcnt.string,
        bus.routeid.string,
        bus.stationid.string,
        bus.stationseq.string
        ))
    #db.commit()
    #fs.close()

# files=['bus-232000047-17.xml','bus-241005900-0.xml','bus-undefined-0.xml','bus-232000047-13.xml']
# for file in files:
#     readxmltodb(file,conn)
def pushallxmls(db):
    r=Path('.')
    #print(list(r.iterdir()))
    # print( r.glob('**/*.xml') )
    ff=list(r.glob('**/*.xml'))
    for f in ff:
        xmlf=f.open(encoding='utf-8')
        f.close()
        readxmltodb(xmlf.read(),db)
        
    db.commit()

# pushallxmls(conn)
#print(e)
#https://www.sqlite.org/lang_datefunc.html
# cur.execute("SELECT * FROM items WHERE strftime('%H',time) IN('19');")
# cur.execute("SELECT * FROM busloc;")
# item_list=cur.fetchall()
# r=cur.execute("SELECT * from busloc where routeid=232000092;").fetchall()
# print(r)
# fs=open('busloc.txt','wt',encoding='utf-8')
# for it in item_list:
#     # print(it)
#     fs.write(str(it)+'\n')
# fs.close()

import urllib.request as req

rootid='232000092'
#buslocationkey= # 공공데이터포털에 접속하기 위한 사용자의 키를 여기에 넣는다.
# //buslocationkey=encodeURIComponent(buslocationkey);
# //var buslocationkey="test"
# //var busnumid='232000092';//7000 김포-서울
# //232000103//7100 김포-서울

import json

def t(soup):
    ret={}
    for child in soup.contents:
        if child.name==None:
            continue
        if child.string!=None:            
            ret[child.name]=child.string
        else:
            if child.name in ret:
                if type(ret[child.name])!=type([]):
                    ret[child.name]=[ret[child.name]]
                ret[child.name].append(t(child))
            else:
                ret[child.name]=t(child)
            
    return ret

def xmltodic(xml):
    soup=BeautifulSoup(xml,'html.parser')
    # if( soup.find('querytime')==None):
    #     return False
    return t(soup)

busurl = 'http://openapi.gbis.go.kr/ws/rest/buslocationservice'
# //var queryParams = '?' + encodeURIComponent('serviceKey') + '='+buslocationkey; 
# //queryParams += '&' + encodeURIComponent('routeId') + '=' + encodeURIComponent(busnumid); 

def getbusurl(rootid):
    queryParams = busurl+'?' + 'serviceKey' + '='+buslocationkey
    queryParams += '&' + 'routeId' + '=' + rootid
    return queryParams

def getbusloc(rootid):
    r=req.urlopen(getbusurl(rootid))
    xml=r.read().decode('utf-8')
    # print(xml)
    readxmltodb(xml,conn)
    conn.commit()

import pathlib
import time

def getbusloc_json(rootid):
    # r=req.urlopen(getbusurl(rootid))
    # xml=r.read().decode('utf-8')
    # xml='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><response><comMsgHeader><errMsg>NORMAL SERVICE.</errMsg><returnCode>00</returnCode></comMsgHeader><msgHeader><queryTime>2018-08-08 23:44:50.574</queryTime><resultCode>0</resultCode><resultMessage>정상적으로 처리되었습니다.</resultMessage></msgHeader><msgBody><busLocationList><endBus>0</endBus><lowPlate>0</lowPlate><plateNo>경기79바9377</plateNo><plateType>4</plateType><remainSeatCnt>25</remainSeatCnt><routeId>232000092</routeId><stationId>232000812</stationId><stationSeq>27</stationSeq></busLocationList><busLocationList><endBus>0</endBus><lowPlate>0</lowPlate><plateNo>경기76자1007</plateNo><plateType>3</plateType><remainSeatCnt>39</remainSeatCnt><routeId>232000092</routeId><stationId>277103530</stationId><stationSeq>11</stationSeq></busLocationList><busLocationList><endBus>0</endBus><lowPlate>0</lowPlate><plateNo>경기79바9384</plateNo><plateType>4</plateType><remainSeatCnt>12</remainSeatCnt><routeId>232000092</routeId><stationId>118000501</stationId><stationSeq>19</stationSeq></busLocationList></msgBody></response>'
    xml='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><response><comMsgHeader><errMsg>NORMAL SERVICE.</errMsg><returnCode>00</returnCode></comMsgHeader><msgHeader><queryTime>2018-08-09 10:14:03.830</queryTime><resultCode>0</resultCode><resultMessage>정상적으로 처리되었습니다.</resultMessage></msgHeader><msgBody><busLocationList><endBus>0</endBus><lowPlate>0</lowPlate><plateNo>경기79바1680</plateNo><plateType>3</plateType><remainSeatCnt>45</remainSeatCnt><routeId>232000007</routeId><stationId>232000451</stationId><stationSeq>2</stationSeq></busLocationList><busLocationList><endBus>0</endBus><lowPlate>0</lowPlate><plateNo>경기79바1298</plateNo><plateType>3</plateType><remainSeatCnt>39</remainSeatCnt><routeId>232000007</routeId><stationId>118000040</stationId><stationSeq>40</stationSeq></busLocationList><busLocationList><endBus>0</endBus><lowPlate>0</lowPlate><plateNo>경기79바1630</plateNo><plateType>3</plateType><remainSeatCnt>35</remainSeatCnt><routeId>232000007</routeId><stationId>232000554</stationId><stationSeq>19</stationSeq></busLocationList><busLocationList><endBus>0</endBus><lowPlate>0</lowPlate><plateNo>경기79바1628</plateNo><plateType>3</plateType><remainSeatCnt>39</remainSeatCnt><routeId>232000007</routeId><stationId>115000038</stationId><stationSeq>51</stationSeq></busLocationList><busLocationList><endBus>0</endBus><lowPlate>0</lowPlate><plateNo>경기79바1632</plateNo><plateType>3</plateType><remainSeatCnt>42</remainSeatCnt><routeId>232000007</routeId><stationId>232000742</stationId><stationSeq>66</stationSeq></busLocationList><busLocationList><endBus>0</endBus><lowPlate>0</lowPlate><plateNo>경기79바1626</plateNo><plateType>3</plateType><remainSeatCnt>37</remainSeatCnt><routeId>232000007</routeId><stationId>115000321</stationId><stationSeq>30</stationSeq></busLocationList></msgBody></response>'
    # print(xml)
    dic=xmltodic(xml)
    # print( json.dumps(dic) )
    # print(dic['response']['msgheader']['querytime'])
    querytime=dic['response']['msgheader']['querytime']
    x=time.strptime(querytime+' +0900','%Y-%m-%d %H:%M:%S.%f %z' )
    # print(x)
    # print(int(time.mktime(x)))
    fs=open(pathlib.PurePath('raw','bus-'+str(rootid)+'-'+str(int(time.mktime(x)))+'.json'),'wt',encoding='utf-8')
    fs.write(json.dumps(dic,indent=2))
    fs.close()

def json_load_test():
    fs=open(pathlib.PurePath('raw','a.json'),'rt',encoding='utf-8')
    j=fs.read()
    print(json.loads(j))


# getbusloc_json(rootid)
#json_load_test()