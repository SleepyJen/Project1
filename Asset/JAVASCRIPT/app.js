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

    searchBtn.on('click', function (e) {
        e.preventDefault();
        let text = $('#textInput').val();
        searchBtn.attr('href', 'search.html');
        $('#textInput').val('');
        console.log(text);
    });
});