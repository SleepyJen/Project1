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
    var text = '';
    var logedIn = false;

    if (localStorage.getItem('data') != 'signedup') {
        if (!logedIn) {
            $('.headerBtnContainer').hide();
            $('.headerBtnContainer2').hide();
        } else {
            $('.headerBtnContainer2').show();
        }
    } else {
        $('#verification').hide();
        $('.headerBtnContainer2').hide();
    }

    $('.over21').on('click', function (e) {
        e.preventDefault();
        localStorage.setItem('data', 'signedup');
        main();
    });

    // Creating User ---------------------------------------------------------------------
    $('#register').on('click', function (e) {
        e.preventDefault();

        let firstName = $('#firstName').val();
        let lastName = $('#lastName').val();
        let dob = $('#dob').val();
        let email = $('#inputEmail').val();
        const password = $("#pwSignUp", $(".formField2")).val();


        if (firstName != null && lastName != null && email != null && password != null && dob != null) {
            auth.createUserWithEmailAndPassword(email, password).then(cred => {
                db.ref(lastName + firstName + dob.substring(8, 10)).set({
                    fName: firstName,
                    lName: lastName,
                    DoB: dob,
                    email: email
                });
                window.location.href = ('index.html');
            }).catch(function () {
                alert("Sorry, Your Input Was Invalid, Try again!");
            });
        }
    });
    //End Create User ---------------------------------------------------------------------

    function main() {
        if (!logedIn) {
            $('#verification').hide();
            $('#setup').show();
            $('.search').show();
            $('.headerBtnContainer').show();
            $('.headerBtnContainer2').hide();
        } else {
            $('#verification').hide();
            $('.headerBtnContainer2').show();
        }

    }

    searchBtn.on('click', function (e) {
        e.preventDefault();
        text = $('#city').val();
        console.log(text);
        var url = `https://brianiswu-open-brewery-db-v1.p.rapidapi.com/breweries/search?query=${text}`
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": url,
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "brianiswu-open-brewery-db-v1.p.rapidapi.com",
                "x-rapidapi-key": "fb2fbd960amsh6ed3e51bfbb9c3bp10ddf5jsnc3dd4fd93ff2"
            }
        }

        $.ajax(settings).done(function (response) {
            console.log(response);

            //window.location.href = ('search.html');
        });

    });

    //var text = $('#textInput').val();


    $('#sUp').on('click', function () {
        window.location.href = ('signUp.html');
    });

    $('#confirm').on('click', function (e) {
        e.preventDefault();
        const sn = $('#userN').val();
        const pw = $("#pW", $("#loginForm")).val();

        auth.signInWithEmailAndPassword(sn, pw).catch(err => {
            console.log(err);
            let fail = $('<h2>').text('Sorry! ' + err.message);
            fail.attr('class', 'fail');
            $('.message').append(fail);
        });
        logedIn = true;
        main();
    });

    auth.onAuthStateChanged(user => {
        if (user) {
            console.log("signed in");
            $('#sIn').hide();
            $('#sUp').hide();
            let welcome = $('<h2>').text("Welcome Back!");
            welcome.attr('class', 'greeting');
            $('.message').append(welcome);
        } else {
            console.log("signed out");
            $('#sIn').show();
            $('#sUp').show();
            $('.greeting').hide();
        }
    });

    $('#lOut').on('click', function () {
        auth.signOut();
        //window.location.href = ('index.html');
        logedIn = false;
        main();
    });



});




