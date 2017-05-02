/**
 * Created by Alex on 01/05/2017.
 */

var propagate = propagate || {};

var tleLine1 = '1 29107U 06016A   17120.91311327  .00000073  00000-0  26309-4 0  9994',
    tleLine2 = '2 29107  98.1997  65.6013 0001207 116.8541 243.2781 14.57103599585381';

// Initialize a satellite record
var satrec = satellite.twoline2satrec(tleLine1, tleLine2);

var positionAndVelocity = satellite.propagate(satrec, new Date());
var positionEci = positionAndVelocity.position,
    velocityEci = positionAndVelocity.velocity;
console.log(positionEci)
function createModel2(url, height) {
   // viewer.entities.removeAll();

    var position = Cesium.Cartesian3.fromElements(positionEci.x, positionEci.y, positionEci.z * 3);
    console.log(position)
    var heading = Cesium.Math.toRadians(135);
    var pitch = 0;
    var roll = 0;
    var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

    entity = viewer.entities.add({
        name : url,
        position : position,
        orientation : orientation,
        model : {
            uri : url,
            minimumPixelSize : 500,
            maximumScale : 100,
            color : Cesium.Color.GREEN,
            silhouetteColor: Cesium.Color.BLUE,
            silhouetteSize: 25.0
        }
    });
   // viewer.trackedEntity = entity;
  //  viewer.flyTo(entity);
//    console.log('aa')
}
createModel2('models/iss.glb', 500000.0);
