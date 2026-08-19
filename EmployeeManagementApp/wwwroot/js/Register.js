// register.js
// Assumes APIURL, showMessageDialog(), WARNING, ERROR, SUCCESS
// are already defined globally (common.js).

var $btnRegister;
var $txtFullName;
var $txtEmail;
var $txtPassword;
var $txtConfirmPassword;

$(document).ready(function () {
    setRegisterGlobalVariables();
});

function setRegisterGlobalVariables() {
    $btnRegister = $("form button[type='submit']").first();
    $txtFullName = $("#FullName");
    $txtEmail = $("#Email");
    $txtPassword = $("#Password");
    $txtConfirmPassword = $("#ConfirmPassword");

    $btnRegister.click(handleRegisterClick);
}

function handleRegisterClick(event) {
    event.preventDefault(); // stop normal form postback

    if (!validateRegisterInputs()) {
        return false;
    }

    registerUser();
}

function validateRegisterInputs() {

    var fullName = $txtFullName.val() ? $txtFullName.val().trim() : "";
    var email = $txtEmail.val() ? $txtEmail.val().trim() : "";
    var password = $txtPassword.val() ? $txtPassword.val().trim() : "";
    var confirmPassword = $txtConfirmPassword.val() ? $txtConfirmPassword.val().trim() : "";

    if (fullName === "") {
        showMessageDialog("Full Name is required", WARNING);
        $txtFullName.focus();
        return false;
    }

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

    if (confirmPassword === "") {
        showMessageDialog("Confirm Password is required", WARNING);
        $txtConfirmPassword.focus();
        return false;
    }

    if (password !== confirmPassword) {
        showMessageDialog("Passwords do not match", WARNING);
        $txtConfirmPassword.focus();
        return false;
    }

    return true;
}

function registerUser() {

    var ajaxTime = new Date().getTime();

    var jsonData = JSON.stringify({
        FullName: $txtFullName.val(),
        Email: $txtEmail.val(),
        Password: $txtPassword.val(),
        ConfirmPassword: $txtConfirmPassword.val()
    });

    var settings = {
        async: true,
        crossDomain: true,
        cache: false,
        dataType: "json",
        url: APIURL + "/api/auth/Register",
        method: "POST",
        contentType: "application/json; charset=utf-8",
        data: jsonData
    };

    $btnRegister.attr("disabled", "disabled");

    $.ajax(settings)
        .done(function (response) {

            if (response && (response.token || response.isSuccess)) {
                showMessageDialog("Registration successful. Please login.", SUCCESS);
                window.location.href = "/Account/Login";
            } else {
                $btnRegister.removeAttr("disabled");
                showMessageDialog(response.message || "Registration failed. Please try again.", ERROR);
            }
        })
        .fail(function (xhr, textStatus, errorThrown) {

            $btnRegister.removeAttr("disabled");

            var errorMessage = "Unable to register. Please try again.";
            try {
                errorMessage = $.parseJSON(xhr.responseText).Message || errorMessage;
            } catch (e) {
                // ignore parse errors, use default message
            }

            showMessageDialog(errorMessage, ERROR);
        });
}