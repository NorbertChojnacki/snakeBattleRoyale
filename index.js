const express = require('express');
const path = require('path')
const player = require(path.join(__dirname, '/controllers/modules/SnakeServ.js'));
const gameControllerServer = require(path.join(__dirname, '/controllers/gameControllerServer.js'));
const fc = require(path.join(__dirname, '/controllers/configFileControler.js'));
const guid = require(path.join(__dirname , '/controllers/modules/GUIDgen.js'))

const http = require('http');
const fs = require('fs')
const socket = require('socket.io');
const session = require('express-session')

app = express()
app.use(express.urlencoded({extended: true}))
app.use('/assets', express.static(__dirname + '/assets'))
app.set('view engine', 'ejs')
app.use(session({secret: 'secret', resave: false, saveUninitialized: false, unset:'destroy', cookie:{maxAge:1000}}))

function gameCheckRequest(req, res, next){
   if (!['create', 'join'].includes(req.params.game)) res.status(400).end()
   next()
}

function gameCreate(req,res,next){
   if(req.params.game !== 'create') next()

   fc.createRoomFile(req.body, gameCode =>{
      res.locals.gameCode = gameCode
   })

   next()
}

function gameCheckCode(req, res, next){
   fc.isRoom(req.query?.gameCode).then(room=>{
         res.locals.room = JSON.parse(room)
         next() 
      }).catch(err=>{
          res.send('ooops invalid gameCode or its missing')
      })     
}

/* get requset handler */
app.get('/', (req, res) => {
   console.log('/')
   console.table(req.session)
   req.session.player = {};
   res.render('index', {randomColor: `#${guid()}`});
});
/* ------------------------------- */

app.get('/snake',gameCheckCode, (req,res)=>{
   console.log('/snake')
   console.table(req.session)
   let player = req.session.player
   req.session = {}
   console.log('/snake1')
   console.table(req.session)
   res.render('game', {player})
})

// encodeURIComponent
/* post request handler*/
app.post('/game/:game', gameCheckRequest, gameCreate ,(req,res)=>{
   console.log('/game')
   console.table(req.session)
   req.session.destroy(err=> console.error(err))
   req.session.regenerate(err=> console.error(err))
   req.session.player = {
      id: guid('xxxxx'),
      name: req.body.snakeName,
      color: req.body.snakeColor
   }
   // res.status(200).end()
   res.redirect(301,`/snake?&gameCode=${res.locals.gameCode}`)
});
/* ------------------------------- */


server = http.Server(app);
server.listen(8080, '127.0.0.1');
console.log(`listening: 127.0.0.1, on port: 8080`);

let io = socket(server);
gameControllerServer(io);
