(function (){

//
// My solution to this challenge: 
//http://www.reddit.com/r/dailyprogrammer/
//comments/2nauiv/20141124_challenge_190_easy_webscraping_sentiments
//
//regex limitations (should change to htmlparser2)



var request = require('request');

String.prototype.countMatches = function (regex) {
	return (this.toString().match(regex) || [] ).reduce(function () {
		return 1;
	},0);
}

Array.prototype.transform = function () {
	return this.reduce(function (prev,curr,index) {
		if (index !== 0)
			prev += '|';
		return prev + curr;
	},'');
}

var happy = ['love','loved','like','liked','awesome','amazing','good','great','excellent','funny'].transform()
var sad = ['hate','hated','dislike','disliked','awful','terrible','bad','painful','worst'].transform();

var stats = {happyCount:0,sadCount:0,fuckCount:0};

if (process.argv.length != 3){
	console.log('node tubeFeel.js <youtube-url>');
	process.exit(1);
}

var url = process.argv[2];
var fullUrl = 'https://plus.googleapis.com/u/0/_/widget/render/comments?first_party_property=YOUTUBE&href='+
				(url.match(/^http(|s):\/\//)? url : 'http://'+url);

request(fullUrl,function (err,res,body) {
	var arr = body.match(new RegExp('<div class="Ct">[^<>]*</div>','g'));
	(arr || []).forEach(function(string){
		var comment = string.replace(/<[^<>]*>/g,"");
		console.log(comment)
		stats.happyCount += comment.countMatches(new RegExp(happy,'g'));
		stats.sadCount += comment.countMatches(new RegExp(sad,'g'));
	});
	console.log("HAPPY: "+stats.happyCount+"\nSAD: "+stats.sadCount);
});

})();
