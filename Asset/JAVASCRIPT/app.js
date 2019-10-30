$(document).ready(function () {
    var firebaseConfig = {
        apiKey: "AIzaSyDUwaZVW6klNbAnFVWNSns-pWNQiVO3j5Q",
        authDomain: "project1-d8ed5.firebaseapp.com",
        databaseURL: "https://project1-d8ed5.firebaseio.com",
        projectId: "project1-d8ed5",
        storageBucket: "project1-d8ed5.appspot.com",
        messagingSenderId: "251262850340",
        appId: "1:251262850340:web:24de28753d84c0534e4fb1"
    };

    firebase.initializeApp(firebaseConfig);
    var searchBtn = $('#submitButton');
    var signIn = false;

    $('.search').hide();
    $('#setup').hide();

    $('.over21').on('click', function (e) {
        e.preventDefault();
        $('#verification').hide();
        $('#setup').show();
        $('.search').show();
    });

    searchBtn.on('click', function (e) {
        e.preventDefault();
        let text = $('#textInput').val();
        $('#textInput').val('');

        if (signIn) {
            window.location.href = ('search.html');
            console.log(text);

        } else {
            $('#searchform').hide();
            $('.search').append('<h1>Please Log In first =)</h1>');
        }
    });

    $('#sUp').on('click', function () {
        window.location.href = ('signUp.html');
    });



});