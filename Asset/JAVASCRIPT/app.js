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

    // Choosing a Drink!! -------------------------------------------------------------------
    $(document).on('click', '.dropdown-item', function () {
        let text = $(this).attr('data');
        $('#Drink').html(text);
        if (text === 'Beer') {
            $('#searchAlc').attr('placeholder', 'Search for a Brewery');
        } else if (text === 'Whiskey') {
            $('#searchAlc').attr('placeholder', 'Search Specific Distillary');
        } else if (text === 'Wine') {
            $('#searchAlc').attr('placeholder', 'Search for a Winery');
        } else if (text === 'Cocktail') {
            $('#searchAlc').attr('placeholder', 'Enter a Alcohol (i.e Gin)');
        }
    });
    // End of Choosing a Drink ---------------------------------------------------------------

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
        let key = $('#searchAlc').val();

        api_search(text, key, drink);
        main();
    });

    function api_search(text, key, choice) {
        console.log(choice);
        var url;
        var api_key;
        if (text === "") {
            alert('Please Enter a City');
        }
        //BEER ---------------------------------------------------------------------------------
        if (choice === "Beer") {
            url = `https://brianiswu-open-brewery-db-v1.p.rapidapi.com/breweries/search?query=${text}`;
            api_key = "fb2fbd960amsh6ed3e51bfbb9c3bp10ddf5jsnc3dd4fd93ff2";

            var settings = {
                "async": true,
                "crossDomain": true,
                "url": url,
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "brianiswu-open-brewery-db-v1.p.rapidapi.com",
                    "x-rapidapi-key": api_key
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
            //END OF BEER ---------------------------------------------------------------------------------
        } else if (choice === "Wine") {

            $.ajax({
                url: url,
                dataType: 'JSON',
                headers: {
                    'Authorization': yelp_api_key,
                },
                method: 'GET https://api.yelp.com/v3/businesses/search?term=delis&latitude=37.786882&longitude=-122.399972'

            }).then(data => {
                console.log(JSON.stringify(data));
            });
            //Whiskey ---------------------------------------------------------------------------------
        } if (choice === "Whiskey") {
            let type = choice.toLowerCase();
            whiskey_url = `https://api.foursquare.com/v2/venues/explore?client_id=ZXZW5OMM0JI35FNLXPVZW5LBMSZEBXPULZSHWN0RQNLRU4R2&client_secret=GDJIMCEGXSUFIGQ5ZMZR1LQJDO3V2DYM2YZ1FOM53L4EW5JG&v=20180323&limit=10&near=${text}&query=${type}`;

            $.ajax({
                method: 'GET',
                url: whiskey_url,
                dataType: 'json'
            }).then(function (data) {
                const response = data.response.groups[0].items;

                console.log(response);

                for (let i = 0; i < response.length; i++) {
                    let cardHolder = $('<div>').attr('class', 'card mb-3');
                    let card = $('<div>').attr('class', 'card-body');
                    let head = $('<h5>').attr('class', 'card-title');
                    let info = $('<p>').attr('class', 'card-text');
                    let icon = $('<img>');

                    head.text(response[i].venue.name);
                    info.html('Address: ' + response[i].venue.location.address + '<br>' + response[i].venue.location.city + ' ' + response[i].venue.location.state + ', ' +
                        response[i].venue.location.postalCode + "<br>Type: " + response[i].venue.categories[0].name);

                    card.append(head);
                    card.append(info);
                    cardHolder.append(card);

                    $('.cardBody').append(cardHolder);
                }
            });

        }
        //END OF WHISKEY ---------------------------------------------------------------------------------
        else {
            url = `https://brianiswu-open-brewery-db-v1.p.rapidapi.com/breweries/search?query=${text}`;
            api_key = "fb2fbd960amsh6ed3e51bfbb9c3bp10ddf5jsnc3dd4fd93ff2";
        }

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




