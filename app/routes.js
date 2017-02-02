var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId;

module.exports = function(app, passport, db) {

app.get('/',function(req,res){
	res.redirect('/polls');
});

app.get('/polls',function(req,res){
    db.votingPolls.find({}).sort({$natural:-1}, function(err,polls){
        var obj = [];
        if(err) {
            res.send(err);
        } else {
            polls.forEach(function(poll){
                obj.push({name : poll.name, id : poll._id});
            });
        }
    	res.render('index',{ auth : req.isAuthenticated(), polls : obj});
    });
});
		
app.get('/polls/:id', function(req,res){
    db.votingPolls.find({ _id : ObjectId(req.params.id) },function(err,poll){
        var user;
        if (req.user) {
            user = req.user.id;
        } else {
            user = '';
        }
        res.render('poll',{ auth : req.isAuthenticated(), userId : user, poll : poll[0],  poll_server: JSON.stringify(poll[0])});
    });
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/mypolls',
            failureRedirect : '/'
}));

app.get('/mypolls', isLoggedIn, function(req,res){
    var facebookId = req.user.id;
    db.votingPolls.find({owner : facebookId}).sort({$natural:-1}, function(err,polls){
    var obj = [];
        if(err) {
            res.send(err);
        } else {
            polls.forEach(function(poll){
                obj.push({name : poll.name, id : poll._id});
            });
        }
    	res.render('profile',{ auth : req.isAuthenticated(), polls : obj});
    });
});

app.get('/new', isLoggedIn, function(req,res){
	res.render('new');
});

app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

app.post('/newPoll',function(req,res){
    var n = req.body.question;
    var o = req.body.options;
    var p = [];
    for (var i=0; i<o.length; i++) {
        p.push({"option": o[i], "votes" : 0});
    }
    db.votingPolls.insert({"name":n, "options":p, "owner": req.user.id});
    res.redirect('/mypolls'); 
});

app.post('/vote',function(req,res){
    var poll = JSON.parse(req.body.option);
    var option = poll.option;
    var id = poll.id;
    db.votingPolls.update({_id : ObjectId(id), "options.option" : option}, {$inc: {"options.$.votes" : 1}});
    res.redirect('/polls/'+id);
});

app.post('/voteNew',function(req,res){
    var option = req.body.vote;
    var id = req.body.id;
    db.votingPolls.update(
    {_id : ObjectId(id)},
    { $push:{
            "options" : { "option" : option, "votes" : 1}
        }
    }
    );
    res.redirect('/polls/'+id);
});

app.post('/deletePoll', function(req,res){
    var id = req.body.id;
    db.votingPolls.remove({_id : ObjectId(id)});
    res.redirect('/');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

};