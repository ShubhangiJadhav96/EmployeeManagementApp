// login.js
// Assumes APIURL, showMessageDialog(), WARNING, ERROR, SUCCESS
// are already defined globally (same as in your Hotel page script).

var $btnLogin;
var $txtEmail;
var $txtPassword;
var $chkRememberMe;

$(document).ready(function () {
    setLoginGlobalVariables();
});

function setLoginGlobalVariables() {
    $btnLogin = $("#btnLogin");
    $txtEmail = $("#Email");
    $txtPassword = $("#Password");
    $chkRememberMe = $("#rememberMe");
}

$("#btnLogin").click(function (event) {
    event.preventDefault(); // stop normal form postback

    if (!validateLoginInputs()) {
        return false;
    }
    
    loginUser();
});

function validateLoginInputs() {

    var email = $txtEmail.val() ? $txtEmail.val().trim() : "";
    var password = $txtPassword.val() ? $txtPassword.val().trim() : "";

    if (email === "") {
        showMessageDialog("Email is required", WARNING);
        $txtEmail.focus();
        return false;
    }

    if (password === "") {
        showMessageDialog("Password is required", WARNING);
        $txtPassword.focus();
        return false;
    }

    return true;
}

function loginUser() {

    var ajaxTime = new Date().getTime();

    var jsonData = JSON.stringify({
        Email: $txtEmail.val(),
        Password: $txtPassword.val(),
        RememberMe: $chkRememberMe.is(":checked")
    });

    var settings = {
        async: true,
        crossDomain: true,
        cache: false,
        dataType: "json",
        url: APIURL + "/api/auth/Login", 
        method: "POST",
        contentType: "application/json; charset=utf-8",
        data: jsonData
    };

    $btnLogin.attr("disabled", "disabled"); // prevent double-submit

    $.ajax(settings)
        .done(function (response) {
            responseTime = new Date().getTime() - ajaxTime;

            if (response && response.token) {
                sessionStorage.setItem("authToken", response.token);
                showMessageDialog("Login successful", SUCCESS);
                window.location.href = "/Home/Index";
            } else {
                $btnLogin.removeAttr("disabled");
                showMessageDialog(response.message || "Invalid email or password", ERROR);
            }
        })
        .fail(function (xhr, textStatus, errorThrown) {

            responseTime = new Date().getTime() - ajaxTime;
            $btnLogin.removeAttr("disabled");

            var errorMessage = "Unable to login. Please try again.";
            try {
                errorMessage = $.parseJSON(xhr.responseText).Message || errorMessage;
            } catch (e) {
                // ignore parse errors, use default message
            }

            showMessageDialog(errorMessage, ERROR);
        });
}