var convert = require('xml-js');
var express= require("express");
Number.prototype.toRad = function() {
    return this * Math.PI / 180;
 }
 
 function calcDistance(point1,point2){
    var lat2 = point2.lat; 
    var lon2 = point2.long; 
    var lat1 = point1.lat; 
    var lon1 = point1.long; 
    
    var R = 6371; // km 
    //has a problem with the .toRad() method below.
    var x1 = lat2-lat1;
    var dLat = x1.toRad();  
    var x2 = lon2-lon1;
    var dLon = x2.toRad();  
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                    Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
                    Math.sin(dLon/2) * Math.sin(dLon/2);  
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; 
    
    return(d);
 }

 
 function getTotalTimeElapsed(a,b){
    const tm1 = a.getTime();
    const tm2 = b.getTime();
    return Math.floor((tm2 - tm1)/1000);
 }

var xml ='<trkseg><trkpt lat="13.1935950" lon="77.6491150"><ele>922.5</ele><time>2016-12-11T00:37:52Z</time></trkpt><trkpt lat="13.1936350" lon="77.6491150"><ele>922.4</ele><time>2016-12-11T00:37:55Z</time></trkpt><trkpt lat="13.1936270" lon="77.6491440"><ele>922.3</ele><time>2016-12-11T00:37:57Z</time></trkpt></trkseg>';

var result = convert.xml2json(xml, {compact: true, spaces: 4});
result = JSON.parse(result);
var points = [];
var timeArray = []; // time[i] have a value of time in sec that is taken from point i to i+1
var distanceArray =[]; // distanceArray[i] contains distance in meters from point i to i+1

var minElevation = 999999999,maxElevation=-99999999;

result.trkseg.trkpt.forEach(element => {
    let ele = parseFloat(element.ele._text);
    if(ele>maxElevation){
        maxElevation=ele;
    }
    else if(ele<minElevation){
        minElevation=ele;
    }
    points.push({lat:parseFloat(element._attributes.lat),long:parseFloat(element._attributes.lon)});
});

var startTime = result.trkseg.trkpt[0].time._text;
var endTime = result.trkseg.trkpt[points.length-1].time._text;
var totDistance = 0;
var maxSpeed = 0;
var movingTime=0;

for(let i=1;i<points.length;i++){
    let distance = calcDistance(points[i],points[i-1])*1000;
    distanceArray.push(distance);
    totDistance+= distance;
}


for(let i=0;i<points.length-1;i++){
   let secs = getTotalTimeElapsed(new Date(result.trkseg.trkpt[i].time._text),new Date(result.trkseg.trkpt[i+1].time._text));
    timeArray.push(secs);
    let speed = parseFloat(distanceArray[i]/secs);
    if(speed>maxSpeed){
        maxSpeed=speed;
    }
    if(speed!=0){
        movingTime+=secs;
    }
}

var totTime=getTotalTimeElapsed(new Date(startTime),new Date(endTime));

console.log(" Total Distance in meters = "+ totDistance + " meter");
console.log(" Total Time Elapsed in seconds = "+ totTime +" sec");
console.log("Average Speed in meter/sec = "+ (totDistance/totTime) + " m/s");
console.log(" Maximum Speed in m/s = " + maxSpeed + " m/s");
console.log(" Elevation Gained = " + (maxElevation-minElevation));
console.log(" Moving Time in seconds = "+ movingTime + " seconds");


//Creating an express server
var cors = require('cors');
const app = express();
const port = 3000;
app.use(cors());
app.get("/getLatLngs",(req,res)=>{
    res.json(points);
});
app.listen(port,()=>{
    console.log(`Server is running on port : ${port}`);
})



 
 