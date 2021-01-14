//创建http服务器
const app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const users = []

server.listen(3000, ()=>{
    console.log("服务器启动成功")
})

app.use(require('express').static('public'))

app.get('/', function(req,res) {
    res.redirect('/index.html')
})

io.on('connection', function(socket) {
    socket.on('login', data => {
        // console.log(data)
    let user = users.find(item => item.username == data.username)
    if(user){
        console.log('登陆失败')
        socket.emit('loginError',{msg:'登陆失败'})
    }
    else{
        console.log('登陆成功')
        users.push(data)
        //告诉当前用户事件
        socket.emit('loginSuccess', data)
        //告诉所有用户事件
        io.emit('addUser', data)
        //告诉所有用户列表有多少人
        io.emit('userList', users)

        //把登陆成功的用户名和头像存储起来
        socket.username = data.username
        socket.avatar = data.avatar
    }

    })



    //用户断开连接功能
    socket.on('disconnect', () => {
        //离开事件，userlist发生改变
        let idx = user.findIndex(item => {item.username === socket.username})
        //删除断开连接的信息
        users.splice(idx,1)

        io.emit('delUser', {
            username: socket.username,
            avatar: socket.avatar
        })
        io.emit('userList', users)
    })

    //监听聊天的消息
    socket.on('sendMessage', data => {
        //广播所有用户
        io.emit('receiveMessage', data)
    })
})