if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
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

        stream.on('tweet', function (tweet) {
          console.log(tweet)
        })
  });
}
