$(document).ready(function () {
    var searchBtn = $('#submit');

});

// search input is null, alert
function validate() {
    var search = document.getElementById("textInput");

    if (search.value.trim() == '') {
        alert('what type of beer you want?');
        return false;
    } else {
        true;
    }
}

// login input is null, alert 
function validatelog() {
    var username = document.getElementById('userN')
    var password = document.getElementById('pW')
    if (username.value.trim() == '' || password.value.trim() == '') {

        alert("No Blank value allowed");
        return false;
    } else {
        true;
    }
}