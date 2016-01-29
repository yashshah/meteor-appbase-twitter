Tweets = new Mongo.Collection('tweets');

if (Meteor.isClient) {
  Meteor.subscribe('tweets')
  console.log(Tweets.find())
    // This code only runs on the client
  Template.body.helpers({
    tweets: function () {
      console.log("Found")
      return Tweets.find({});
    }
  });
    // This code only runs on the client
  // Template.body.helpers({
  //   tweets: [
  //     { tweet: "This is task 1" , date: "yo", user: "he"},
  //     { tweet: "This is task 2" , date: "yo", user: "he"},
  //     { tweet: "This is task 3", date: "yo", user: "he" }
  //   ]
  // });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.publish('tweets', function() {
      console.log("Done")
     return Tweets.find();
    });
    // code to run on server at startup
    var Twit = Meteor.npmRequire('twit');
    var conf = JSON.parse(Assets.getText('twitter.json'));

        var T = new Twit({
            consumer_key: conf.consumer.key,
            consumer_secret: conf.consumer.secret,
            access_token: conf.access_token.key,
            access_token_secret: conf.access_token.secret
        });

        //
        // filter the public stream by english tweets containing `#javascript`
        //
        var stream = T.stream('statuses/filter', { track: '#javascript', language: 'en' })

        stream.on('tweet', Meteor.bindEnvironment(function (tweet) {
          var userName = tweet.user.name;
          var userScreenName = tweet.user.screen_name;
          var userTweet = tweet.text;
          var tweetDate = tweet.created_at;
          var profileImg = tweet.user.profile_image_url;

          console.log(userScreenName + '('+ userName + ')' + 'said '+ userTweet + 'at '+ tweetDate);
          console.log('=======================================')
          Tweets.insert({user: userName, userscreen: userScreenName, tweet: userTweet, picture: profileImg, date: tweetDate}, function(error){
          if(error)
            console.log(error);
          });
        }))
  });
}
