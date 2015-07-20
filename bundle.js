'use strict';

// const interestingTypes = ['amusement_park', 'aquarium', 'art_gallery', 'bar', 'bowling_alley',
//                           'cafe', 'casino', 'library', 'museum', 'night_club', 'park', 'restaurant', 'spa'];
// const radiusInMeters = '1000';

var _constants = require('./constants');

var map, steps, destination;
var service;
var infowindow;
var myplace;
var directionsService = new google.maps.DirectionsService();
var currentStepIndex = 0,
    lastInfoWindow,
    instructions,
    position;

function initialize() {
  navigator.geolocation.getCurrentPosition(function (position) {
    myplace = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    map = new google.maps.Map(document.getElementById('map-canvas'), { center: myplace, zoom: 17 });

    var request = {
      location: myplace,
      radius: _constants.radiusInMeters,
      types: _constants.interestingTypes
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
  });

  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var randomPlace = results[Math.floor(Math.random() * results.length)];
      getDirections(randomPlace);
    }
  }

  function getDirections(place) {
    var request = {
      origin: myplace,
      destination: place.geometry.location,
      travelMode: google.maps.TravelMode.WALKING
    };
    directionsService.route(request, function (result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        destination = result.routes[0].legs[0];
        steps = result.routes[0].legs[0].steps;
        displayCurrentStep();
        document.getElementById('next').classList.remove('hidden');
      }
    });
  }

  function displayCurrentStep() {
    if (lastInfoWindow) {
      lastInfoWindow.close();
    }

    if (currentStepIndex === steps.length - 1) {
      instructions = 'Arrived!! ' + destination.end_address;
      document.getElementById('next').classList.add('hidden');
      position = destination.end_point;
    } else {
      var currentStep = steps[currentStepIndex];
      position = currentStep.end_point;
      instructions = currentStep.instructions;
    }

    var infowindow = new google.maps.InfoWindow({
      content: instructions
    });

    var marker = new google.maps.Marker({
      position: position,
      map: map,
      animation: google.maps.Animation.DROP
    });

    infowindow.open(map, marker);
    lastInfoWindow = infowindow;
  }

  var nextButton = document.getElementById('next');

  nextButton.addEventListener('click', function () {
    currentStepIndex++;
    displayCurrentStep();
  });
}

google.maps.event.addDomListener(window, 'load', initialize);

