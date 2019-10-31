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

    const auth = firebase.auth();
    const db = firebase.database();

    var searchBtn = $('#submitButton');

    if (localStorage.getItem('data') != 'signedup') {
        $('.search').hide();
        $('#setup').hide();
        $('.headerBtnContainer').hide();
    } else {
        $('#verification').hide();
    }

    $('.over21').on('click', function (e) {
        e.preventDefault();
        localStorage.setItem('data', 'signedup');
        main();
    });

    // Creating User
    $('#register').on('click', function (e) {
        e.preventDefault();

        let firstName = $('#firstName').val();
        let lastName = $('#lastName').val();
        let dob = $('#dob').val();
        let email = $('#inputEmail').val();
        const pw = $("#pwSignUp", $(".formField")).val();;

        if (firstName != null && lastName != null && email != null && pw != null && dob != null) {
            db.ref(lastName + firstName + dob.substring(8, 10)).push({
                fName: firstName,
                lName: lastName,
                DoB: dob
            });

        }
        auth.createUserWithEmailAndPassword(email, pw);
        window.location.href = ('index.html');
    });

    function main() {
        $('#verification').hide();
        $('#setup').show();
        $('.search').show();
        $('.headerBtnContainer').show();
    }

    searchBtn.on('click', function (e) {
        e.preventDefault();
        let text = $('#textInput').val();
        $('#textInput').val('');

    });

    $('#sUp').on('click', function () {
        window.location.href = ('signUp.html');
    });

    $('#confirm').on('click', function (e) {
        e.preventDefault();
        const sn = $('#userN').val();
        const pw = $("#pW", $("#loginForm")).val();

        auth.signInWithEmailAndPassword(sn, pw).catch(err => {
            console.log(err);
        })
    });
    $('#submitButton').on('click', function () {
        window.location.href = ('search.html');

    });
});

