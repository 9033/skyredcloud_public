<style >body {background-color:lightblue;}</style>

# skyredcloud
## 이 프로젝트의 목적
웹 서비스의 제작에 관해서 알아보기 위해서  
node.js 교과서라는 책을 통해서 node.js에 대해 알아보았다. [링크](https://github.com/9033/nodejs-practice)  
그리고 실습을 통해서 더 잘 기억하기 위해서 이 프로젝트를 진행 하였다.  
aws에서 ec2인스턴스상에 구현했었다.  
현재는 비용절감을 위해 s3을 이용해서 서버리스로 구동중. [링크](http://skyred.cloud/)  
## major updates
express 사용, git 적용. git서버 세팅. (2018-08-31)  
db에 버스에 대한 정보를 저장. (2018-09-06)  
db에서 버스에 대한 정보를 출력. (2018-09-06)  
x-powered-by 사용안함 (2018-09-12)  
busloc의 css및 js를 각각 다른 파일로 나눔. (2018-09-13)  
로그의 형식을 변경, log디랙터리에 저장하게함. (2018-09-13)  
404 not found 페이지를 변경 (2018-09-13)  
글에서 단어를 변경하는 페이지를 추가 (2018-09-29)  
`git pull`만 하면 적용이 되게함 (2018-12-13)  
public 으로 github에 업로드. (2019-12-14)  

## method  
| http메서드   |      주소      |입력|  역할(출력) |
|-|-|-|-|
| GET |  /. || static |
| GET |  /. || pug rendering (index.js) |
| GET |  /buslocs |r,y,m,d| bus seats (db사용) |
| * |  /users || 사용자 관련|

static미들웨어에서 처리되지 않으면 index.js으로 넘어옴.

### pug page (index.js)
|      주소      |입력|  역할(출력) |
|-|-|-|
|  /about || about page |
|  /busseat || number of the bus seat |

### static file
|      주소      |입력|  역할(출력) |
|-|-|-|
|/qrcode.html   ||qrcode generator  |
|/self-intro.html   ||글에서 글자, 단어 변경  |
|/favicon.ico   ||이 사이트의 아이콘|

## middlewares and routers
### express-generator의 기본설치
+ cookie-parser
+ debug
+ express
+ http-errors
+ morgan
    - 로그 저장
### html 템플릿
+ pug
### db
+ sequelize
+ sqlite3
### login, session
none
### favicon
+ serve-favicon
    - 아직 적용 하지 않음. favicon.ico파일 전용.
### etc
+ rotating-file-stream
    - morgan에서 로그 파일을 일 단위로 저장하기 위해 사용.

## git
주소 : `ssh://ec2-user@skyred.cloud/home/ec2-user/skyredcloud/skyred.git`  
현재는 skyred.git에 작업물이 압축이 되어서 들어감.  

### 설정 순서
서버는 리눅스, 작업하는 클라이언트는 윈도우일때.  
그리고 클라이언트에서 서버로 접속할때 ssh를 사용함.  

서버와 클라이언트에 git을 설치한다.  

#### 클라이언트
클라이언트에 작업폴더에 가서 git을 설정한다. `git init`  
서버의 `~/.ssh/authorized_keys` 파일에 클라이언트의 `%homepath%/.ssh/id_rsa.pub`파일의 내용을 `$ cat id_rsa.pub >> authorized_keys`같은 방법으로 **덧붇인다**. 덮어씌우면 서버에 접속이 안될 수 있다.  
id_rsa.pub파일이 없으면 클라이언트에 설치한 git bash에서 키를 한쌍 만든다.  
`~/.ssh/authorized_keys`에 ssh로 접속할때 쓰는 키와 git으로 접속할때 쓰이는 키가 다 있는지 확인한다.  

#### 서버
그리고 서버에 다음과 같은 명령어로 git폴더를 만든다. 명령어는 아까 작업한 명령어를 그대로 설명. 
```bash
~$ mkdir skyredcloud
~$ cd skyredcloud
skyredcloud$ mkdir skyred.git
skyredcloud$ cd skyred.git
skyred.git$ git init --bare
```
여기에 생성한 저장소는 클라이언트에서 push하는 리모트 저장소이다.

#### 클라이언트
이제 클라이언트에서는 리모트 저장소의 주소인 `ssh://ec2-user@skyred.cloud/home/ec2-user/skyredcloud/skyred.git`을 추가하면 된다.  

[서버에 git 설정하기](https://git-scm.com/book/ko/v1/Git-%EC%84%9C%EB%B2%84-%EC%84%9C%EB%B2%84%EC%97%90-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0)

## install on server
### 서버에서 구동시작
이제 실제로 구동될 소스를 pull하는 폴더를 만드는 작업을 한다.
```bash
skyredcloud$ mkdir web
skyredcloud$ cd web
web$ git init
web$ git pull ../skyred.git/
web$ npm install
web$ sudo nodemon
```

### git에 push한 다음에는
이제는 클라이언트에서 push한 후에 다음과 같이 하면 자동으로 적용된다.
```bash
web$ git pull ../skyred.git/
```

~~아직은 불편함. 웹서버에 자동으로 작업물이 올라가게 되면 바로 node를 실행하면 되는데, 지금은 그렇지 않다.~~  
다음에 할 일은 서버에 push하면 자동으로 코드가 업로드가 되어야함. 그러면 push후 간단하게 다시 node를 시작하면 끝.  
그리고 2명이상의 사람이 작업을 한다면 추가적인 작업이 필요하다.  

## TODO
guest로그인. 메인페이지를 통해서 들어와야 다른 페이지에 접근이 가능하게.  
사용량 제한. 의미 없는 새로고침을 반복하는것 방지.  
7000번 외에 다른 노선도 출력하게 함.  
