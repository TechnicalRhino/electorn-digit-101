var $ = require('jquery');
const {dialog} = require('electron').remote;
const server_addr = 'http://localhost:8692';

$('.form').find('input, textarea').on('keyup blur focus', function (e) {

    var $this = $(this),
        label = $this.prev('label');

    if (e.type === 'keyup') {
        if ($this.val() === '') {
            label.removeClass('active highlight');
        } else {
            label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
        if ($this.val() === '') {
            label.removeClass('active highlight');
        } else {
            label.removeClass('highlight');
        }
    } else if (e.type === 'focus') {

        if ($this.val() === '') {
            label.removeClass('highlight');
        } else if ($this.val() !== '') {
            label.addClass('highlight');
        }
    }
});

$('.tab a').on('click', function (e) {
    e.preventDefault();

    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');

    target = $(this).attr('href');

    $('.tab-content > div').not(target).hide();
    $(target).fadeIn(600);
});

$('#loginBtn').click(function () {
    if (!($('#loginForm')[0].reportValidity())) {
        dialog.showErrorBox('Error! Check All Inputs!', '"Email" and "Password" are Required and must be correctly formatted');
    } else {
        var email = $('#login_email').val();
        var password = $('#login_password').val();
        logIn(email, password);
    }
});
var authToken;

function logIn(email, password) {
    $.post(server_addr + '/login', {
        email: email,
        password: password
    }, function (data) {
        authToken = data.token;
        $('#userName').html(data.user.name);
        $('#regLogIn').hide();
        $('#afterLogIn').show();
        connectWebSocket(data.user._id);
    }).fail(function (error) {
        var msg = JSON.parse(error.responseText)['message'];
        dialog.showErrorBox('Login Failed!', msg);
    })

}

$('#registerBtn').click(function () {
    if (!($('#registerForm')[0].reportValidity())) {
        dialog.showErrorBox('Error! Check All Inputs!', '"First Name","Last Name", "Email" and "Password" are Required and must be correctly formatted');
    } else {
        var email = $('#reg_email').val();
        var password = $('#reg_password').val();
        var name = $('#reg_firstName').val() + ' ' + $('#reg_lastName').val();
        $.post(server_addr + '/register', {
            name: name,
            email: email,
            password: password
        }, function (data) {
            sendDesktopNotification(data.message, 'You Will Be Logged In Automatically');
            logIn(email, password);
        }).fail(function (error) {
            var msg = JSON.parse(error.responseText)['message'];
            dialog.showErrorBox('Registration Failed!', msg);
        })
    }
});

var destId = -1;
var frndName='';

$('#searchFrnd').click(function () {
    var emailSearch = $('#chatFrnd').val();
    if (!(emailSearch)) {
        dialog.showErrorBox('Enter Email Id To Search..');
    } else {
        $.ajax({
            url: server_addr + '/user/chatFriend',
            type: 'post',
            data: {
                friendEmail: emailSearch
            },
            headers: {
                "x-access-token": authToken
            },
            success: function (data) {
                openChatBox(data.friendId, data.friendName);
            },
            error: function (err) {
                var msg = JSON.parse(err.responseText)['message'];
                dialog.showErrorBox("Sorry! Can't Chat! ", msg);
            }
        });
    }
});

function sendDesktopNotification(ntfnTitle, ntfnBody, myFunc) {
    let myNotification = new Notification(ntfnTitle, {
        body: ntfnBody
    })
    if (myFunc) {
        myNotification.onclick = myFunc;
    }
}
const openChatBox = (destination, name) => {
    destId = destination;
    $('#afterLogIn').hide();
    $('.frndName').html(name);
    $('#live-chat').show();
}
let ws;
const connectWebSocket = (userId) => {
    var counter = 0;
    ws = new WebSocket(`ws://localhost:8692/chat?userId=${userId}`);
    ws.onmessage = (msg) => {
        let message = JSON.parse(msg.data);
        switch (message.type) {
            case 'event':
                if (message.message === 'startchattingevent') {
                    frndName=message.user.name;
                    openChatBox(message.user._id, frndName);
                }
                break;
            default:
                populateMsg(message.message);
                $('.chat-message-counter').html(++counter);
                break;
        }
    }
}
const populateMsg = (txt,isSelf) => {
    sendDesktopNotification('New Message!', txt);
    if (isSelf) {
        $('#allChats').append(getChatMessage('img/anon.png','You',txt));
    } else{
        $('#allChats').append(getChatMessage('img/agent.png',frndName,txt));
    }
    $('#no-msg').hide();
}
$('#chatTxtBox').keydown(function (e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        var txt = $('#chatTxtBox').val();
        sendMessage(destId, txt);
        populateMsg(txt,true);
        $('#chatTxtBox').val('');
    }
});
const sendMessage = (destinationId, message) => {
    if (ws) {
        ws.send(JSON.stringify({
            destination: destinationId,
            content: message
        }));
    }
}
const getChatMessage = (img, frndName, msg) => {
    return `<div class="chat-message clearfix">
       <img src="${img}" alt="" width="32" height="32">
    <div class="chat-message-content clearfix">
      <span class="chat-time">${new Date().getHours()}:${new Date().getMinutes()}</span>
      <h5 class="frndName">${frndName}</h5>
      <p>${msg}</p>
    </div>
  </div><hr/>`;
}