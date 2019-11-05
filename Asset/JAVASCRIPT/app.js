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
        } else if (text === 'Sake') {
            $('#searchAlc').attr('placeholder', 'Enter a Sake');
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
        var locations = [];
        console.log(choice);
        var url;
        var api_key;
        if (text === "") {
            alert('Please Enter a City');
        }
        //BEER ---------------------------------------------------------------------------------
        if (choice === "Beer") {
            location = [];
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
                        let mapInfo = [response[i].street, response[i].latitude, response[i].longitude, i];
                        locations.push(mapInfo);
                    }
                    if (count > 9) {
                        i = response.length;
                    }
                }

                // we need to fix the above logic to present the data like this one:
                //function that initiates the map
                function initMap() {
                    var map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 12,
                        center: new google.maps.LatLng(37.782448, -122.3925769),

                    })
                    //this will display an infor window when clicked on the marker
                    var infowindow = new google.maps.InfoWindow({})

                    var marker, i;

                    //loop through the locations - NOT working!! it only displays the last brewery, should display all
                    for (i = 0; i < locations.length; i++) {
                        console.log("locations", locations);
                        console.log(locations[i][1]);
                        marker = new google.maps.Marker({
                            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                            map: map,
                        })

                        google.maps.event.addListener(
                            marker,
                            'click',
                            (function (marker, i) {
                                return function () {
                                    infowindow.setContent(locations[i][0])
                                    infowindow.open(map, marker)
                                }
                            })
                        )
                    }
                }
                initMap();
            });

            //END OF BEER ---------------------------------------------------------------------------------

            //Whiskey ---------------------------------------------------------------------------------
        } else if (choice === "Whiskey") {
            location = [];
            let type = choice.toLowerCase();
            cards(type);

        }
        //END OF WHISKEY ---------------------------------------------------------------------------------

        //WINE ---------------------------------------------------------------------------------
        else if (choice === "Wine") {
            location = [];
            let type = choice.toLowerCase();
            cards(type);
        }
        //END OF WINE ---------------------------------------------------------------------------------
        else if (choice === "Sake") {
            let type = choice.toLowerCase();
            cards(type);

        }
        else {
            location = [];
            url = `https://brianiswu-open-brewery-db-v1.p.rapidapi.com/breweries/search?query=${text}`;
            api_key = "fb2fbd960amsh6ed3e51bfbb9c3bp10ddf5jsnc3dd4fd93ff2";
        }

        function cards(type) {
            url = `https://api.foursquare.com/v2/venues/explore?client_id=ZXZW5OMM0JI35FNLXPVZW5LBMSZEBXPULZSHWN0RQNLRU4R2&client_secret=GDJIMCEGXSUFIGQ5ZMZR1LQJDO3V2DYM2YZ1FOM53L4EW5JG&v=20180323&limit=10&near=${text}&query=${type}`;

            $.ajax({
                method: 'GET',
                url: url,
                dataType: 'json'
            }).then(function (data) {
                const response = data.response.groups[0].items;
                console.log(response);

                for (let i = 0; i < response.length; i++) {
                    let cardHolder = $('<div>').attr('class', 'card mb-3');
                    let card = $('<div>').attr('class', 'card-body');
                    let head = $('<h5>').attr('class', 'card-title');
                    let info = $('<p>').attr('class', 'card-text');

                    head.text(response[i].venue.name);
                    info.html('Address: ' + response[i].venue.location.address + '<br>' + response[i].venue.location.city + ' ' + response[i].venue.location.state + ', ' +
                        response[i].venue.location.postalCode + "<br>Type: " + response[i].venue.categories[0].name);

                    card.append(head);
                    card.append(info);
                    cardHolder.append(card);

                    $('.cardBody').append(cardHolder);

                    let mapInfo = [response[i].venue.location.address, response[i].venue.location.lat, response[i].venue.location.lng, i];
                    locations.push(mapInfo);
                }

                // we need to fix the above logic to present the data like this one:
                //function that initiates the map
                function initMapFourSquare() {
                    var map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 12,
                        center: new google.maps.LatLng(37.782448, -122.3925769),

                    })
                    //this will display an infor window when clicked on the marker
                    var infowindow = new google.maps.InfoWindow({})

                    var marker, i;

                    //loop through the locations - NOT working!! it only displays the last brewery, should display all
                    for (i = 0; i < locations.length; i++) {
                        console.log("locations", locations);
                        console.log(locations[i][1]);
                        marker = new google.maps.Marker({
                            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                            map: map,
                        })

                        google.maps.event.addListener(
                            marker,
                            'click',
                            (function (marker, i) {
                                return function () {
                                    infowindow.setContent(locations[i][0])
                                    infowindow.open(map, marker)
                                }
                            })
                        )
                    }
                }

                initMapFourSquare();
            });

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




