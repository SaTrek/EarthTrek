
# EarthTrek  [![Build Status](https://secure.travis-ci.org/SaTrek/EarthTrek.png)](http://travis-ci.org/SaTrek/EarthTrek)

EarthTrek is an interactive 3D web application. It´s easy access for all kinds of users encourages the use of data that NASA`S EOS program compiles and collect with satellites´s instruments.

Our app allows to:
* Observing satellite images
* View real-time orbits of the various satellites around Earth from launch to future predictions.
* View satellites´s models on 3D.
* Learn the instruments that each satellite owns.
* Get to know the mission of NASA's Earth Observing System program.
* Display a comparison of the same geographic location on two different dates on which the satellite instruments have been collecting information, being able to appreciate the changes over time and being able to vary the selection of amount of data displayed at the same time.
* View satellites that are no longer active.
* Predict the route of the ISS (International Space Station), when it will be passing through an specific area and its trajectory.

It allows to visualize in real time the orbits of the different kinds of satellites around the Earth up to its launch until future predictions.

With this tool, we aim to encourage new generations to get involved in NASA's programs, from spreading the word to becoming active members -or even pioneers- of present and future developments.

Public engagement is key in the pursuit of aerospace exploration.

Earth Trek - "Exploring our World"

### GET STARTED ###

**INSTALLATION**

Clone this repository
```
npm install

node server.js
```
That's it!

**HOW THE APP WORKS**

The user will be able to visualize in real time the orbits of the satellites around the Earth, from launch to future projections. At the moment, there are some applications that allow to see the trajectories of present and future satellites. Earth Trek delivers the same functionality, but also allows to visualise satellite-driven data.
It also offers a significant improvement regarding satellite orbits visualisation. Through AJAX, it provides access to data without needing to make multiple requests. This was one of many development aspects considered towards improving the user’s experience when learning about the different capabilities of EOS program satellites.

When you open the application, it will be displayed a 3D image of the Earth and the satellite's orbits that are currently orbiting the area of the Earth we are observing.

![AQUA](https://api-2017.spaceappschallenge.org/stream-images/OhR7F6ZmAWX6iajVIRVP-gJngWA=/2770/width-800/)

Once a satellite is selected, two satellite images of the Earth can be compared.
By determining a geographic location through the geolocation finder and selecting a date before the current one, the screen will be divided in two, being possible to observe the differences between the state of the zone in those moments. For example using MODIS, Terra´s instrument, deforestation or fire outbreaks can be compared

![Mato Grosso deforestation](https://api-2017.spaceappschallenge.org/stream-images/dVorva_DJd4OK2eAf76sfFKuDuE=/3103/width-800/)

**NASA Space Apps Challenge 2017 - Buenos Aires Nominee**
![NASA Space Apps Challenge 2017 - Buenos Aires](https://sa-media-2017.s3.amazonaws.com/media/images/Space_Apps_2017_Logo_BsAs.width-500.png)

**RESOURCES**

* SatelliteJS: TLE & orbital Data: https://github.com/shashwatak/satellite-js
* CesiumJs: https://cesiumjs.org/
* GIBS https://earthdata.nasa.gov/about/science-system-de...
* Celestrak http://www.celestrak.com/NORAD/elements/science.txt
* NASA 3D Resources: 3D Models
