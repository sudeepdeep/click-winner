const socket = io("/");
const left = document.getElementById('leftclick');
const right = document.getElementById('rightclick');
const lscore = document.getElementById('leftscore');
const rscore = document.getElementById('rightscore');
const luser = document.getElementById('leftuser');
const ruser = document.getElementById('rightuser');
socket.emit("join-room", roomid, username)



var timeLeft = 10;
var leftcount = 0;
var rightcount = 0;
var elem = document.getElementById('some_div');
    


ruser.innerHTML = 'User: ' + username
socket.on("user-connected", (roomid, users) => {
    if(users.length == 2){
        luser.innerHTML = 'User: ' + users[0]
        ruser.innerHTML = 'User: ' + users[1]
        var timerId = setInterval(countdown, 1000);
        function countdown() {
            if (timeLeft == -1) {
              clearTimeout(timerId);
              doSomething(users);
            } else {
              elem.innerHTML = 'Game Starts in ' + timeLeft + ' seconds';
              timeLeft--;
            }
        }


    }
})



    function doSomething(users) {

        left.disabled = false;
        right.disabled = false;



        left.addEventListener("click", e => {
            e.preventDefault();
            leftcount += 1;
            lscore.innerHTML = "Score: " + leftcount

            socket.emit("leftscore", leftcount)
        })


        right.addEventListener("click", e => {
            e.preventDefault();
            rightcount += 1;
            rscore.innerHTML = "Score: " + rightcount

            socket.emit("rightscore", rightcount)
        })


        socket.on('updateleft', score => {
            lscore.innerHTML = "Score: " + score
        })

        socket.on('updateright', score => {
            rscore.innerHTML = "Score: " + score
        })


        var finalLeft = 5;

        var timerId = setInterval(countdown, 1000);
        function countdown() {
            if (finalLeft == -1) {
              clearTimeout(timerId);


              if(leftcount < rightcount) {
                  msg = `${users[0]} is winner`
                Finalwinner(msg);
              }

              else if(leftcount > rightcount) {
                msg = `${users[0]} is winner`
              Finalwinner(msg);
            }
            else if(leftcount == rightcount) {
                msg = "Both are winner"
                Finalwinner(msg);
            }
              
            } else {
              elem.innerHTML = 'Game Ends in ' + finalLeft + ' seconds';
              finalLeft--;
            }
        }

    

    }

    function Finalwinner(msg){
        elem.innerHTML = msg;
       
    }

   
   