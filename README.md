
# EARTH TREK [![Build Status](https://secure.travis-ci.org/SaTrek/EarthTrek.png?branch=master)](http://travis-ci.org/SaTrek/EarthTrek)

**NASA Space Apps Challenge 2017 - Buenos Aires - Team SATrek**

![Global Finalist (Best Use of Data)](http://i.imgur.com/6H29eDd.png)

* [Roadmap](#roadmap)
* [Installation](#installation)
* [Browser support](#browser-support)
* [Resources](#resources)

EarthTrek is an interactive 3D web application that does not require the installation of any plugins, it can be launched through web browsers. It´s easy access for all kinds of users encourages the use of data that NASA´s EOS program compiles and collect with satellites´s different instruments.

![DISPLAY](https://image.ibb.co/gPuMsa/imagen.png)

For now, our app will allow to:
* Observe satellite images
* View real-time orbits of the various satellites around Earth from launch to future predictions.
* View satellites´s models on 3D.
* Learn the instruments that each satellite owns.
* Get to know the mission of NASA's Earth Observing System program.
* Display a comparison of the same geographic location on two different dates on which the satellite instruments have been collecting information, being able to appreciate the changes over time and being able to vary the selection of amount of data displayed at the same time.
* View satellites that are no longer active.
* Predict the route of the ISS (International Space Station), when it will be passing through an specific area and its trajectory.


We need more people to understand the importance of the information provided by satellites in order to study global environmental changes and impact factors on our planet, the Earth. 

There are some applications that shows the trajectories of present and future satellites, besides, Earth Trek allows to visualise satellite-driven data. It also offers a significant improvement regarding satellite orbits visualisation. Through AJAX, it provides access to data without needing to make multiple requests. Many developments aspects like these were considered towards improving the user’s experience.

With this tool, we aim to encourage new generations to get involved in NASA's programs, from spreading the word to becoming active members -or even pioneers- of present and future developments.

Public engagement is key in the pursuit of aerospace exploration.

Earth Trek - "Exploring our World"

# ROADMAP

![ROADMAP](https://image.ibb.co/gKeXyF/roadmapv6.png)

## DEPENDENCIES

* node.js: https://nodejs.org/es/download/
* npm: https://www.npmjs.com/get-npm

## INSTALLATION
Clone this repository

Copy the content of example to another directory. Example:

```
cp -R /home/user/earthtrek/example /home/user/
cd /home/user/example
```
Then, install the distribution from npm
```
npm install earthtrek-core
npm run dev
```
Finally, in order to launch the app, enter the URL: http://localhost:9080.

That's it!


## BROWSER SUPPORT
EarthTrek Version| Chrome ![Chrome](https://www.w3schools.com/images/compatible_chrome2020.gif) | Firefox ![Firefox](https://www.w3schools.com/images/compatible_firefox2020.gif)  |  IE 11 ![IE](https://www.masificados.com/propiedadraiz/images/frontend/logo_explorer.png)  | Edge ![IE](https://www.w3schools.com/images/compatible_edge2020.gif)   | Chrome Android ![Android](http://www.nch.com.au/images/android_icon_20x20.gif)
--- | --- | ---| --- | --- | ---
0.176.08 (Current) | ![Yes][YesTickmark]|  ![Yes][YesTickmark]|  ![No][NoRedCross]  |  ![Yes][YesTickmark] |  ![Yes][YesTickmark] (Partial)
NX-Alpha (Early June) | ![Yes][YesTickmark]|  ![Yes][YesTickmark] |  ![Yes][YesTickmark] |  ![Yes][YesTickmark]  |  ![Yes][YesTickmark]

[YesTickmark]: https://dvyn1ggd1flup.cloudfront.net/templates/cre63_ats/img/reserve_tickmark.png
[NoRedCross]: https://hosting.idiglocal.co.uk/templates/default/img/redcross20.png

## Some aspects of HOW THE APP WORKS

If you select a satellite, firstly you will see details about its missions and instruments:

![TERRA](https://scontent-gru2-1.xx.fbcdn.net/v/t31.0-0/p235x350/18739306_1736311510001386_408202630302674080_o.png?oh=8826445f9a93105e1b11ba5f1d5467a9&oe=59B432D8)


Once a satellite is selected, two satellite images of the Earth can be compared.
By determining a geographic location through the geolocation finder and selecting a date before the current one, the screen will be divided in two, being possible to observe the differences between the state of the zone in those moments. For example using MODIS, Terra´s instrument, deforestation or fire outbreaks can be compared:

![Mato Grosso deforestation](http://i.imgur.com/01GK2is.jpg)

## RESOURCES

* SatelliteJS (Satellite propagation): https://github.com/shashwatak/satellite-js
* CesiumJs: https://cesiumjs.org/
* GIB (Imagery) https://earthdata.nasa.gov/about/science-system-de...
* Celestrak (TLE & orbital Data): http://www.celestrak.com/NORAD/elements/science.txt
* NASA 3D Resources: https://nasa3d.arc.nasa.gov/







