var $ = require('jquery');
const {dialog} = require('electron').remote;
$( document ).ready(function(){
   //Cookie Check
  });

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
        logIn(email,password);

    }
});

function logIn(email,password)
{
    var jqxhr = $.post("http://localhost:8692/login", {
        email: email,
        password: password
    }, function (data) {
        console.log(data.token);
        $('#regLogIn').hide();
        $('#afterLogIn').show();
       
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
        var jqxhr = $.post("http://localhost:8692/register", {
            name: name,
            email: email,
            password: password
        }, function (data) {
            console.log(data);
            alert("success");
        }).fail(function (error) {
            var msg = JSON.parse(error.responseText)['message'];
            dialog.showErrorBox('Registration Failed!', msg);
        })
    }
});