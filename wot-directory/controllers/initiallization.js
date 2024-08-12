var mongoose = require('mongoose');
var Thing_description = mongoose.model('thing_description');
const got = require('got');

//Sending node information to the central server


/*Thing_description.find({'@type': 'ThingDirectory'},{}).exec(
    function(err, tds) {
        if (err) {
            
        }
        else {
            var nodes = tds.map(function(thing) {
                return {
                    title: thing.title,
                    base: thing.base
                };
            });
            console.log(nodes);

            got.post(process.env.CENTRAL_SERVER_DEVELOPMENT + "/node", {json: nodes})
                .then(response => {
                    console.log(response.body);
                })
                .catch(err => {
                    console.log(err)
                    console.log("Central server unavailable. Starting unsupervised mode");
                });

        }
    }
);*/