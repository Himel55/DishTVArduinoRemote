 /* requires*/
 var express = require("express");
 var bodyParser = require("body-parser");
 var SerialPort = require("serialport");
 
 /*setup*/
 var app = express(); 
 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(bodyParser.json());
 
 var sp = new SerialPort('COM3', {baudrate: 9600});
 
 sp.on('open', onPortOpen);
 sp.on('data', onData);
 sp.on('close', onClose);
 
 function onPortOpen(){
    console.log("SPort status: open");
	sp.write("ping");
 }

 function onData(d){
    console.log("SPort: "+d.readUInt8(0).toString(16));
 }

 function onClose(){
    console.log("SPort status: closed");
 }
 
 function sendData(info){
	for (var i = 0; i < info.length; i++)
	{
		var timeout = i*250;
		setTimeout(function(data){
			buf = Buffer.alloc(4);
			buf.writeUInt32LE(data, 0);
			sp.write(buf);
			console.log(data.toString(16));
		},timeout, info[i]);
	}
 }
 
 /*button and channel mapping dictionary*/
 var buttonMap = {
	Power: 0x80BF3BC4,
	Mute: 0x80BF39C6 ,
	One: 0x80BF49B6,
	Two: 0x80BFC936,
	Three: 0x80BF33CC,
	Four: 0x80BF718E,
	Five: 0x80BFF10E,
	Six: 0x80BF13EC,
	Seven: 0x80BF51AE,
	Eight: 0x80BFD12E,
	Nine: 0x80BF23DC,
	TvRadio: 0x80BF9B64,
	Zero: 0x80BFE11E,
	PR: 0x80BF41BE,
	CHUp: 0x80BFA956,
	CHDown: 0x80BFA35C,
	Info: 0x80BF43BC,
	Fav: 0x80BFAB54,
	VolUp: 0x80BFBB44,
	VolDown: 0x80BF31CE,
	Up: 0x80BF53AC,
	Down: 0x80BF4BB4,
	Left: 0x80BF9966,
	Right: 0x80BF837C,
	OK: 0x80BF738C,
	Menu: 0x80BF11EE,
	Exit: 0x80BFE31C,
	Red: 0x80BFC13E,
	Green: 0x80BF5BA4,
	Yellow: 0x80BFB34C,
	Blue: 0x80BF03FC,
	Txt: 0x80BF807F,
	Subt: 0x80BF619E,
	Text: 0x80BFC33C,
	Epg: 0x80BF21DE,
	Timer: 0x80BF639C,
	Audio: 0x80BF09F6,
	Lib: 0x80BF40BF,
	Jump: 0x80BFC03F,
	Rewind: 0x80BF0BF4,
	FastFoward: 0x80BF6B94,
	PrevChapter: 0x80BF20DF,
	NextChapter: 0x80BFA05F,
	Record: 0x80BF609F,
	Play: 0x80BFE01F,
	Pause: 0x80BF10EF,
	Stop: 0x80BF906F,
 };
 var channelMap = {
	  "one" : [buttonMap.One],
	  "two" : [buttonMap.Two],
	  "three" : [buttonMap.Three],
	  "bravo" : [buttonMap.Four],
	  "maori" : [buttonMap.Five],
	  "one+1" : [buttonMap.Six],
	  "three+1" : [buttonMap.Eight],
	  "two+1" : [buttonMap.Seven],
	  "bravo+1" : [buttonMap.Nine],
	  "prime" : [buttonMap.One, buttonMap.Zero],
	  "edge" : [buttonMap.One, buttonMap.One],
	  "choice" : [buttonMap.One, buttonMap.Two],
	  "duke" : [buttonMap.One, buttonMap.Three],
	  "teo reo" : [buttonMap.One, buttonMap.Five],
	  "hgtv" : [buttonMap.One, buttonMap.Seven],
	  "shopping" : [buttonMap.One, buttonMap.Eight],
	  "shine" : [buttonMap.Two, buttonMap.Five],
	  "firstlight" : [buttonMap.Two, buttonMap.Six],
	  "hope" : [buttonMap.Two, buttonMap.Seven],
	  "parliament" : [buttonMap.Three, buttonMap.One],
	  "prime+1" : [buttonMap.One, buttonMap.Zero, buttonMap.One, buttonMap.One],	  
 };
 /* serves main page */
 app.get("/", function(req, res) {
    res.sendFile(__dirname +  '/index.html')
 });
 
 /* handles channel change post */
 app.post('/channelselect', function(request,response){
	var channel = request.body.channel;
	console.log("channel selected = " + channel);
	var info = channelMap[channel];
	
	sendData(info);
	
	response.end();
 });
 
 /*servers static resources*/
  app.use("/TVLogos", express.static(__dirname + '/TVLogos'));

 var port = process.env.PORT || 3000;
 app.listen(port, function() {
	console.log("Listening on " + port);
 });