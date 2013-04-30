var express = require('express'),
		app = express(),
		redis = require("redis"),
		redis_queue = "swipe_queue",

    redisClient = redis.createClient(6379, "127.0.0.1");

app.configure(function() {
	app.use(express.bodyParser());
	// app.use(allowCrossDomain);
	app.use(function(err, req, res, next){
		errorHandler.handle(err, requ, res, next);
	})
	app.enable("jsonp callback");
})


//CORS middleware
var allowCrossDomain=function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
}

app.get('/', function(req, res){
	length = "length: ";
	len = redisClient.llen(redis_queue, function(err, obj){
		res.end(length+obj);
	});
});

app.get('/alive', function(req, res){	
	redisClient.ping(function(err, obj){
		if (JSON.stringify(obj) == JSON.stringify("PONG")){
  		res.send(200, "Redis ready to work!");
  		res.end();
		}
		else{
  		res.send(500, "Redis faded into the distance");
  		res.end();
		}
	})
})

// Redis version
app.get('/push', function(req, res){
	req.param('swipes').split("-").forEach(function(item){
		console.log("pushing "+item+" to redis")
		redisClient.rpush(redis_queue, item);
	})
	res.json("ok");
	res.end();
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});