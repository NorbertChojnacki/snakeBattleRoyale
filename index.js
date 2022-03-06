const express = require('express');
const path = require('path')
const player = require(path.join(__dirname, '/controllers/modules/SnakeServ.js'));
const gameControllerServer = require(path.join(__dirname, '/controllers/gameControllerServer.js'));
const http = require('http');
const fs = require('fs')
const socket = require('socket.io');

app = express();
app.use(express.urlencoded({extended: true}))
app.use('/assets', express.static(__dirname + '/assets'));
app.set('view engine', 'ejs');


/* get requset handler */
app.get('/', (req, res) => {
   res.render('index');
});
/* ------------------------------- */

app.get('/snake', (req,res)=>{
   console.log(req.body)
   res.send('aya')
})


class GUID {
    generate(model, hex) {
    let str = "";
    for (let i = 0; i < model.length; i++) {
      let rnd = Math.floor(Math.random() * hex.length);
      str += model[i] === "x" ?  hex[rnd] : model[i] ;
    }
    return str.toLowerCase();
  }

  generateCode(){
     return this.generate('xxxxxx', '0123456789')
  }
  
  generateRoom(){
     return this.generate("xxxx-xxxx-xxxx-xxxx", "0123456789ABCDEFGHIJKLMNOPRSTUWXYZV")
  }
}

function gameCheckRequest(req, res, next){
   if (!['create', 'join'].includes(req.params.game)) res.status(400).end()
   next()
}

function gameCreate(req,res,next){
   if(req.params.game !== 'create') next()

}

/* post request handler*/
// var snake = new player
app.post('/game/:game', gameCheckRequest, gameCreate ,(req,res)=>{
   // snake.name = req.body.snakeName;
   // snake.color = req.body.snakeColor;
   // res.render('childView', {playerInfo:snake});
   let {playerNumber, applesNumber, boardSize} = req.body
   let gameCode = '222'
   res.redirect(301,`/snake?playerNumber=${playerNumber}&applesNumber=${applesNumber}&boardSize=${boardSize}&gameCode=${gameCode}`)
});
/* ------------------------------- */


server = http.Server(app);
server.listen(8080, '127.0.0.1');
console.log(`listening: 127.0.0.1, on port: 8080`);

let io = socket(server);
gameControllerServer(io);
