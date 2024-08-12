const schema = require('../../schema.json');
const Ajv = require("ajv").default;
const apply = require('ajv-formats');

var mongoose = require('mongoose');
var Thing_description = mongoose.model('thing_description');
const { v4: uuidv4 } = require('uuid');

function validate(data, res)
{
    var ajv = new Ajv();
    apply(ajv);
  
    var validate = ajv.compile(schema);
    var valid = validate(data);
  
    if (valid) return true;

    res.status(400).send({"message": "Invalid serialization or TD.", "description": validate.errors});
    
    return false;

}

//UPDATE//
module.exports.thingDescriptionCreateUpdate = function(req, res) {
    if (req.params && req.params.id) { 
        req.body.updatedAt = Date.now();

        Thing_description
        .findOneAndUpdate({id: req.params.id},req.body,{ upsert: true, setDefaultsOnInsert: true },function(err, td) {
            if (!err) { 
                if(!validate(req.body, res)) return;

                if (!td) {
                    // Create it
                    td = new Thing_description(req.body);  
                    return res 
                    .status(201)
                    .send();
                }
                return res 
                .status(204)
                .send();
            }
            return res
            .status(400)
            .send({"message": "Invalid serialization or TD.", "description": err});
        });
    } else {
        return res
        .status(400)
        .send({"message": "Invalid serialization or TD.", "description": "No thing description in the request"});
    }
};

//CREATION//
module.exports.thingDescriptionCreate = function(req, res) {
    if(!req.body.id) req.body.id = "urn:uuid:" + uuidv4();
    req.body.updatedAt = Date.now();
    var baseUrl = "http://" + req.connection.localAddress.replace(/^.*:/, '') + ":" + req.connection.localPort;

    Thing_description
    .findOneAndUpdate({id: req.body.id},req.body, { upsert: true, setDefaultsOnInsert: true },function(err, td) {
        if (!err) { 
            if(!validate(req.body, res)) return;
           // Create it
           td = new Thing_description(req.body);  
           console.log(Object.keys(JSON.parse(JSON.stringify(td))));
           return res 
            .writeHead(201, {
            'Location': baseUrl + '/td/' + req.body.id
            })
            .send();
        }
        return res
        .status(400)
        .send({"message": "Invalid serialization or TD.", "description": err});
    });    
};

//DELETION//
module.exports.thingDescriptionDelete = function(req, res) {
    if (req.params && req.params.id) { 
        Thing_description
        .findOneAndDelete({id: req.params.id}) 
        .exec(
            function(err, td) {
                if (!td) { 
                    return res
                    .status(404)
                    .send({"message": "thing description " + req.params.id + " not found"});
                } else if (err) {
                    return res
                    .status(500)
                    .send({"message": "Error while searching the thing description", "description": err});
                }
                return res 
                .status(204)
                .send();
            }
        );
    } else {
        return res
        .status(400)
        .send({"message": "No thing description in the request", "description": err});
    }
};