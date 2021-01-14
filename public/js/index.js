// 聊天室的主要功能

// 连接socket.io
var socket = io('http://localhost:3000')
var username, avatar

//登录功能
$('#login_avatar li').on('click', function () {
    $(this)
        .addClass('now')
        .siblings()
        .removeClass('now')
})
$('#loginBtn').on('click', function () {
    //获取用户名
    var username = $('#username')
        .val()
        .trim()
    if (!username) {
        alert('请输入用户名')
        return
    }
    //获取头像
    var avatar = $('#login_avatar li.now img').attr('src')

    socket.emit('login', {
        username: username,
        avatar: avatar
    })
})

//监听登录失败成功
socket.on('loginError', data => {
    alert('用户名已经存在')
})
socket.on('loginSuccess', data => {
    alert('登陆成功')
    //显示聊天窗口
    $('.login_box').fadeOut()
    $('.container').fadeIn()
    //设置个人信息
    $('.avatar_url').attr('src', data.avatar)
    $('.info .username').text(data.username)

    username = data.username
    avatar = data.avatar
})
//监听添加用户的消息
socket.on('addUser', data => {
    //添加一条系统消息
    $('.box-bd').append(`
    <div class="system">
        <p class="message_system">
            <span class="content">${data.username}加入了群聊</span>
        </p>
    </div>
    `)
})

socket.on('userList', data => {
    console.log(data)
    $('.user-list ul').html('')
    data.forEach(item => {
    $('.user-list ul').append(`
    <li class="user">
    <div class="avatar"><img src="${item.avatar}" alt="" /></div>
    <div class="name">${item.username}</div>
    </li>
    `)    
    });
    $('#userCount').text(data.length);
})

//监听离开用户的消息
socket.on('delUser', data => {
    //添加一条系统消息
    $('.box-bd').append(`
    <div class="system">
        <p class="message_system">
            <span class="content">${data.username}离开了群聊</span>
        </p>
    </div>
    `)
})


//聊天功能
$('.btn-send').on('click', () => {
    //获取聊天内容
    var content = $('#cmsg')
    .val()
    .trim()
    console.log(content)
    // $('#cmsg').val('')
    if(!content) return alert('请输入内容')

    //发送服务器
    socket.emit('sendMessage', {
        msg: content,
        username: username,
        avatar: avatar
    })

})

//监听聊天消息
// socket.on('receiveMessage', data => {
//     if (data.username === username) {
//         $('.box-bd').append(`
//         <div class="message-box">
//                 <div class="my message">
//                   <img class="avatar" src="${data.avatar}" alt="" />
//                   <div class="content">
//                     <div class="bubble">

//                       <div class="bubble_cont">${data.msg}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//         `)
//     }
//     else{
//         $('.box-bd').append(`
//         <div class="message-box">
//         <div class="other message">
//           <img class="avatar" src="${data.avatar}" alt="" />
//           <div class="content">
//             <div class="nickname">${data.username}</div>
//             <div class="bubble">
//               <div class="bubble_cont">${data.msg}</div>
//             </div>
//           </div>
//         </div>
//       </div> 
//         `)
//     }
// })