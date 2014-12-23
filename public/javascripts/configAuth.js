var GoogleStrategy = require('pasport-google-oauth').OAuth2Strategy;
var User = require(./models/user);
var googleAuth =
{
        'clientID'      : '375009401841-n8lbs9fqtom68hbh9oo1dprpj7l3gq0f.apps.googleusercontent.com',
        'clientSecret'  : 'lcFBv3AtdTrc_lRyyj4EZ8-I',
        'callbackURL'   : 'http://localhost:3000/auth/google/callback'
    };

module.exports = function(passport){
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});
	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});
	passport.use(new GoogleStrategy({
		clientId: googleAuth.clientId,
		clientSecret: googleAuth.clientSecret,
		callbackURL: googleAuth.callbackURL
	}, function(token, refreshToken, profile, done){
		process.nextTick(function(){
			User.findOne({'googleId': profile.id}, function(err, user){
				if (err) return done(err);
				if (user){
					return done(null, user);
				} else {
					var newUser = new User();
					newUser.google.id = profile.id;
					newUser.google.name  = profile.displayName;
                    newUser.google.email = profile.emails[0].value;
                    newUser.save(function(err){
                    	if (err) throw err;
                    	return done(null, newUser);
                    });

				}
			});
		});
	}));
};