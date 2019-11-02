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

    if (localStorage.getItem('data') != 'signedup') {
        $('.headerBtnContainer').show();
        $('.headerBtnContainer2').hide();
    } else {
        $('#verification').hide();
    }

    $('.over21').on('click', function (e) {
        e.preventDefault();
        localStorage.setItem('data', 'signedup');
        main();
    });

    $(document).on('click', '.dropdown-item', function () {
        let text = $(this).attr('data');
        $('#Drink').html(text);
        if (text === 'Beer') {
            $('#searchAlc').attr('placeholder', 'Search for a Brewery');
        } else if (text === 'Whiskey') {
            $('#searchAlc').attr('placeholder', 'Search for a Whiskey');
        } else if (text === 'Wine') {
            $('#searchAlc').attr('placeholder', 'Search for a Winery');
        }
    });


    // Creating User ---------------------------------------------------------------------
    $('.register').on('click', function (e) {
        e.preventDefault();

        let firstName = $('#firstName').val();
        let lastName = $('#lastName').val();
        let dob = $('#dob').val();
        let email = $('#inputEmail').val();
        const password = $("#pwSignUp", $(".formField2")).val();

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
    });
    //End Create User ---------------------------------------------------------------------

    function main() {
        $('#verification').hide();
        $('#setup').show();
        $('.search').show();
        $('.headerBtnContainer').show();
        $('#verification').hide();
        $('.headerBtnContainer2').show();
    }

    searchBtn.on('click', function (e) {
        $('.cardBody').empty();
        e.preventDefault();
        text = $('#city').val();
        let drink = $('#Drink').text();

        api_search(text, "", drink);
        main();
    });

    function api_search(text, key, choice) {
        console.log(choice);
        var url;
        if (text === "") {
            alert('Please Enter a City');
        }
        if (choice === "Beer") {
            url = `https://brianiswu-open-brewery-db-v1.p.rapidapi.com/breweries/search?query=${text}`;
        } else {
            url = `https://brianiswu-open-brewery-db-v1.p.rapidapi.com/breweries/search?query=${text}`;
        }

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
            let count = 0;
            for (let i = 0; i < response.length; i++) {
                let api_city = response[i].city;
                if (api_city.toLowerCase() === text.toLowerCase()) {
                    let cardHolder = $('<div>').attr('class', 'card mb-3');
                    let card = $('<div>').attr('class', 'card-body');
                    let head = $('<h5>').attr('class', 'card-title');
                    let info = $('<p>').attr('class', 'card-text');

                    head.text(response[i].name);
                    info.html('Address: ' + response[i].street + '<br>' + response[i].state + ', ' +
                        response[i].postal_code + '<br>Phone Number: ' + response[i].phone +
                        "<br>Website: " + `<a href = ${response[i].website_url}>` + response[i].website_url);

                    card.append(head);
                    card.append(info);
                    cardHolder.append(card);
                    $('.cardBody').append(cardHolder);
                    count++;
                }
                if (count > 9) {
                    i = response.length;
                }
            }
        });
    }

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

        main();
    });

    auth.onAuthStateChanged(user => {
        if (user) {
            console.log("signed in");
            $('#sIn').hide();
            $('#sUp').hide();
            $('#lOut').show();
            $('.fail').hide();
            let welcome = $('<h2>').text("Welcome Back!");
            welcome.attr('class', 'greeting');
            $('.message').append(welcome);
        } else {
            console.log("signed out");
            $('#sIn').show();
            $('#sUp').show();
            $('#lOut').hide();
            $('.greeting').hide();
        }
    });

    $('#lOut').on('click', function () {
        auth.signOut();
        main();
    });



});




