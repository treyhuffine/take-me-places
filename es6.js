let map, steps, destination;
let service;
let infowindow;
let myplace;
let directionsService = new google.maps.DirectionsService();
let currentStepIndex = 0, lastInfoWindow, instructions, position;

import { interestingTypes as types, radiusInMeters as radius } from './constants';
import ArrayWithRand from './arrayWithRandom';
import _ from 'lodash';

let initialize = () => {

  let callback = (results, status) => {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      // let randomPlace = ArrayWithRand.from(results).sample;
      let randomPlace = _.sample(results);
      getDirections(randomPlace);
    }
  };

  let getDirections = place => {
    let request = {
      origin: myplace,
      destination: place.geometry.location,
      travelMode: google.maps.TravelMode.WALKING
    };
    directionsService.route(request, (result, status) => {
      if (status == google.maps.DirectionsStatus.OK) {
        destination = result.routes[0].legs[0];
        steps = result.routes[0].legs[0].steps;
        displayCurrentStep();
        document.getElementById("next").classList.remove("hidden");
      }
    });
  };

  let displayCurrentStep = () => {
    if (lastInfoWindow) {
      lastInfoWindow.close();
    }

    if (currentStepIndex === steps.length - 1) {
      instructions = "Arrived!! " + destination.end_address;
      document.getElementById("next").classList.add("hidden");
      position = destination.end_point;
    } else {
      let currentStep = steps[currentStepIndex];
      position = currentStep.end_point;
      instructions = currentStep.instructions;
    }

    let infowindow = new google.maps.InfoWindow({ content: instructions });

    let marker = new google.maps.Marker({
      position,
      map,
      animation: google.maps.Animation.DROP
    });

    infowindow.open(map, marker);
    lastInfoWindow = infowindow;
  };

  navigator.geolocation.getCurrentPosition(position => {
    myplace = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    map = new google.maps.Map(document.getElementById('map-canvas'), { center: myplace, zoom: 17 });
    let request = {
      location: myplace,
      radius,
      types
    };
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
  });

  let nextButton = document.getElementById("next");

  nextButton.addEventListener("click", () =>{
    currentStepIndex++;
    displayCurrentStep();
  });
};

google.maps.event.addDomListener(window, 'load', initialize);
