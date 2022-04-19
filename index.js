var express=require("express");
var bodyParser=require("body-parser");
const app = express();
const server = require('http').Server(app)
const io  = require('socket.io')(server)
const {v4:uuidV4} = require('uuid')
const store = require('store')

app.set('view engine', 'ejs')
app.set('views', 'views');

app.use(express.json())
app.use('*/js',express.static('public/js'));
app.use('*/images',express.static('public/images'));

app.use(bodyParser.urlencoded({ extended: true })); 

app.use(bodyParser.json());
let uid;
var name;
let user;
app.get('/', (req, res) => {
    user = "left"
    uid = uuidV4()
    res.render('index', {'user': user})
})

// app.get('/play', (req, res) => {
//     store.set('starter', 'true')
//     res.redirect(`/${uid}`)
// })

app.get('/joiner', (req, res) => {
    res.render('startinggame')
})


app.post('/starting', (req, res) => {
    name = req.body.name
    console.log('this ios the name: ',name)
    store.set('starter', 'true')
    res.redirect(`/${uid}`)
})


app.get('/:id', (req, res) => {
    if(store.get('starter') == 'true'){
        res.render('waiting', {name: name, uid: uid})
        store.set('starter', 'false')
    }
    else{
        user = "right"
        res.render('startinggame', {'user': user})
    }
})



var users = [];
io.on("connection", (socket) => {

    socket.on('join-room', (roomid, username) => {
        console.log(username, roomid)
        socket.join(roomid)
        if(users.includes(username)){
            console.log("already exists")
          }
          else if(!users.includes(username)){
            users.push(username);
          }

        io.to(roomid).emit('user-connected', roomid,users)
    
        socket.on('leftscore', leftcount => {
            io.to(roomid).emit('updateleft', leftcount)
        })

        socket.on('rightscore', rightcount => {
            io.to(roomid).emit('updateright', rightcount)
        })
    
    })

 
 

})




server.listen(process.env.PORT || 3000);  