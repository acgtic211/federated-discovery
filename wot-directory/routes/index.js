const express = require('express');
const router = express.Router();
const discovery = require('../controllers/discovery'); 
var ctrlLookup = require('../controllers/Lookup/thing_description'); 
var ctrlTdRegister = require('../controllers/Register/thing_description'); 
var ctrlTdAdmin = require('../controllers/Admin/thing_description'); 
var nmap = require('node-nmap');
const test = require('../controllers/initiallization.js');



nmap.nmapLocation = "nmap"; //default

/**
 * @swagger
 * /:
 *  get:
 *   description: Get the Thing Description Directory (TDD) description
 *   produces:
 *    - application/ld+json
 *   responses:
 *    200:
 *     description: Thing Description Directory (TDD) description
 *     schema:
 *     type: ld+json
 */

router.get('/', (req, res) => {
    res.json(JSON.parse("{\"@context\":[\"https:\/\/www.w3.org\/2019\/wot\/td\/v1\",\"https:\/\/w3c.github.io\/wot-discovery\/context\/discovery-context.jsonld\"],\"@type\":\"DirectoryDescription\",\"title\":\"Thing Description Directory (TDD)\",\"version\":{\"instance\":\"1.0.0-alpha\"},\"securityDefinitions\":{\"oauth2_code\":{\"scheme\":\"oauth2\",\"flow\":\"code\",\"authorization\":\"https:\/\/auth.example.com\/authorization\",\"token\":\"https:\/\/auth.example.com\/token\",\"scopes\":[\"write\",\"read\",\"search\"]},\"oauth2_client\":{\"scheme\":\"oauth2\",\"flow\":\"client\",\"token\":\"https:\/\/auth.example.com\/token\",\"scopes\":[\"write\",\"read\",\"search\"]},\"oauth2_device\":{\"scheme\":\"oauth2\",\"flow\":\"device\",\"authorization\":\"https:\/\/auth.example.com\/device_authorization\",\"token\":\"https:\/\/auth.example.com\/token\",\"scopes\":[\"write\",\"read\",\"search\"]},\"combo_sc\":{\"scheme\":\"combo\",\"oneOf\":[\"oauth2_code\",\"oauth2_client\",\"oauth2_device\"]}},\"security\":\"combo_sc\",\"base\":\"https:\/\/tdd.example.com\",\"actions\":{\"createTD\":{\"description\":\"Create a Thing Description\",\"uriVariables\":{\"id\":{\"title\":\"Thing Description ID\",\"type\":\"string\",\"format\":\"iri-reference\"}},\"forms\":[{\"href\":\"\/td\/{id}\",\"htv:methodName\":\"PUT\",\"contentType\":\"application\/td+json\",\"response\":{\"description\":\"Success response\",\"htv:statusCodeValue\":201},\"scopes\":\"write\"},{\"href\":\"\/td\",\"htv:methodName\":\"POST\",\"contentType\":\"application\/td+json\",\"response\":{\"description\":\"Success response\",\"htv:headers\":[{\"description\":\"System-generated UUID (version 4) URN\",\"htv:fieldName\":\"Location\",\"htv:fieldValue\":\"\"}],\"htv:statusCodeValue\":201},\"scopes\":\"write\"}]},\"updateTD\":{\"description\":\"Update a Thing Description\",\"uriVariables\":{\"id\":{\"title\":\"Thing Description ID\",\"type\":\"string\",\"format\":\"iri-reference\"}},\"forms\":[{\"href\":\"\/td\/{id}\",\"htv:methodName\":\"PUT\",\"contentType\":\"application\/td+json\",\"response\":{\"description\":\"Success response\",\"htv:statusCodeValue\":204},\"scopes\":\"write\"}]},\"updatePartialTD\":{\"description\":\"Update parts of a Thing Description\",\"uriVariables\":{\"id\":{\"title\":\"Thing Description ID\",\"type\":\"string\",\"format\":\"iri-reference\"}},\"forms\":[{\"href\":\"\/td\/{id}\",\"htv:methodName\":\"PATCH\",\"contentType\":\"application\/merge-patch+json\",\"response\":{\"description\":\"Success response\",\"htv:statusCodeValue\":204},\"scopes\":\"write\"}]},\"deleteTD\":{\"description\":\"Delete a Thing Description\",\"uriVariables\":{\"id\":{\"title\":\"Thing Description ID\",\"type\":\"string\",\"format\":\"iri-reference\"}},\"forms\":[{\"href\":\"\/td\/{id}\",\"htv:methodName\":\"DELETE\",\"response\":{\"description\":\"Success response\",\"htv:statusCodeValue\":204},\"scopes\":\"write\"}]}},\"properties\":{\"retrieveTD\":{\"description\":\"Retrieve a Thing Description\",\"uriVariables\":{\"id\":{\"title\":\"Thing Description ID\",\"type\":\"string\",\"format\":\"iri-reference\"}},\"forms\":[{\"href\":\"\/td\/{id}\",\"htv:methodName\":\"GET\",\"response\":{\"description\":\"Success response\",\"htv:statusCodeValue\":200,\"contentType\":\"application\/td+json\"},\"scopes\":\"read\"}]},\"searchJSONPath\":{\"description\":\"JSONPath syntactic search\",\"uriVariables\":{\"query\":{\"title\":\"A valid JSONPath expression\",\"type\":\"string\"}},\"forms\":[{\"href\":\"\/search\/jsonpath?query={query}\",\"htv:methodName\":\"GET\",\"response\":{\"description\":\"Success response\",\"htv:statusCodeValue\":200},\"scopes\":\"search\"}]},\"searchXPath\":{\"description\":\"XPath syntactic search\",\"uriVariables\":{\"query\":{\"title\":\"A valid XPath expression\",\"type\":\"string\"}},\"forms\":[{\"href\":\"\/search\/xpath?query={query}\",\"htv:methodName\":\"GET\",\"response\":{\"description\":\"Success response\",\"htv:statusCodeValue\":200},\"scopes\":\"search\"}]},\"searchSPARQL\":{\"description\":\"SPARQL semantic search\",\"uriVariables\":{\"query\":{\"title\":\"A valid SPARQL 1.1. query\",\"type\":\"string\"}},\"forms\":[{\"href\":\"\/search\/sparql?query={query}\",\"htv:methodName\":\"GET\",\"response\":{\"description\":\"Success response\",\"htv:statusCodeValue\":200},\"scopes\":\"search\"},{\"href\":\"\/search\/sparql\",\"htv:methodName\":\"POST\",\"response\":{\"description\":\"Success response\",\"htv:statusCodeValue\":200},\"scopes\":\"search\"}]}},\"events\":{\"registration\":{\"description\":\"TD registration events\",\"uriVariables\":{\"type\":{\"title\":\"Event type\",\"type\":\"string\",\"enum\":[\"created_td\",\"updated_td\",\"deleted_td\"]},\"td_id\":{\"title\":\"Identifier of TD in directory\",\"type\":\"string\"},\"include_changes\":{\"title\":\"Include TD changes inside event data\",\"type\":\"boolean\"}},\"forms\":[{\"op\":\"subscribeevent\",\"href\":\"\/events{?type,td_id,include_changes}\",\"subprotocol\":\"sse\",\"contentType\":\"text\/event-stream\",\"htv:headers\":[{\"description\":\"ID of the last event for reconnection\",\"htv:fieldName\":\"Last-Event-ID\",\"htv:fieldValue\":\"\"}],\"data\":{\"oneOf\":[{\"type\":\"object\",\"description\":\"The schema of event data\",\"properties\":{\"td_id\":{\"type\":\"string\",\"format\":\"iri-reference\",\"description\":\"Identifier of TD in directory\"}}},{\"type\":\"object\",\"description\":\"The schema of create event data including the created TD\",\"properties\":{\"td_id\":{\"type\":\"string\",\"format\":\"iri-reference\",\"description\":\"Identifier of TD in directory\"},\"td\":{\"type\":\"object\",\"description\":\"The created TD in a create event\"}}},{\"type\":\"object\",\"description\":\"The schema of the update event data including the updates to TD\",\"properties\":{\"td_id\":{\"type\":\"string\",\"format\":\"iri-reference\",\"description\":\"Identifier of TD in directory\"},\"td_updates\":{\"type\":\"object\",\"description\":\"The partial TD composed of modified TD parts in an update event\"}}}]},\"scopes\":\"notifications\"}]}}}"));
});

/**
 * @swagger
 * /td:
 *  get:
 *   description: Get all the Thing Descriptions
 *   produces:
 *    - application/ld+json
 *   responses:
 *    200:
 *     description: A list with all the Thing Descriptions
 *     schema:
 *     type: array
 */
router.get('/td', ctrlLookup.thingDescriptionList);

/**
 * @swagger
 * /td/{id}:
 *  get:
 *   description: Get a Thing Description by id
 *   produces:
 *    - application/ld+json
 *   parameters:
 *    - in: path
 *      name: id
 *      description: The id of the Thing
 *   responses:
 *    200:
 *     description: A Thing Description
 *     schema:
 *     type: json
 */
router.get('/td/:id', ctrlLookup.thingDescriptionFindOne);

router.put('/td/:id', ctrlTdRegister.thingDescriptionCreateUpdate);

/**
 * @swagger
 * /td/:
 *  post:
 *   description: Create a new Thing Description
 *   produces:
 *    - application/ld+json
 *   parameters:
 *    - in: body
 *      name: Thing Description
 *      schema:
 *      type: json
 *   responses:
 *    201:
 *     description: Thing Description created!
 */
router.post('/td/', ctrlTdRegister.thingDescriptionCreate);

router.put('/td/', ctrlTdRegister.thingDescriptionCreateUpdate);

router.delete('/td/:id', ctrlTdRegister.thingDescriptionDelete);


/**
 * @swagger
 * /discover:
 *  get:
 *   description: Discover new Thing Descriptions
 *   responses:
 *    200:
 *     description: Something
 */
router.get('/discover', (req, res) => {discovery.pull(res);});

/**
 * @swagger
 * /search:
 *  get:
 *   description: Search Thing Descriptions
 *   responses:
 *    200:
 *     description: Something
 *     schema:
 *     type: json
 */
router.get('/search', ctrlLookup.thingDescriptionFind);

/**
 * @swagger
 * /td/{affordance}/{name}:
 *  get:
 *   description: Get a Thing Description by affordance and name
 *   responses:
 *    200:
 *     description: Something
 *     schema:
 *     type: json
 */
router.get('/td/:affordance/:name', ctrlLookup.thingDescriptionFindByAffordance);

/**
 * @swagger
 * /created-last-day:
 *  get:
 *   description: Get all the Thing Descriptions created in the last day
 *   responses:
 *    200:
 *     description: List of Thing Descriptions created in the last day
 *     schema:
 *     type: json
 */
router.get('/created-last-day', ctrlLookup.thingDescriptionCreatedDay);

/**
 * @swagger
 * /created-last-week:
 *  get:
 *   description: Get all the Thing Descriptions created in the last week
 *   responses:
 *    200:
 *     description: List of Thing Descriptions created in the last week
 *     schema:
 *     type: json
 */
router.get('/created-last-week', ctrlLookup.thingDescriptionCreatedWeek);

/**
 * @swagger
 * /updated-last-day:
 *  get:
 *   description: Get all the Thing Descriptions updated in the last day
 *   responses:
 *    200:
 *     description: List of Thing Descriptions updated in the last day
 *     schema:
 *     type: json
 */
router.get('/updated-last-day', ctrlLookup.thingDescriptionUpdatedDay);

/**
 * @swagger
 * /updated-last-week:
 *  get:
 *   description: Get all the Thing Descriptions updated in the last week
 *   responses:
 *    200:
 *     description: List of Thing Descriptions updated in the last week
 *     schema:
 *     type: json
 */
router.get('/updated-last-week', ctrlLookup.thingDescriptionUpdatedWeek);

/**
 * @swagger
 * /user-interface:
 *  get:
 *   description: Get the user interface for the Thing Description
 *   responses:
 *    200:
 *     description: User interface for the Thing Description
 *     schema:
 *     type: json
 */
router.get('/user-interface', ctrlLookup.thingDescriptionUserInterface);


/**
 * @swagger
 * /getDirectories:
 *  get:
 *   description: Get associated discovery services
 *   responses:
 *    200:
 *     description: Information about discovery services
 *     schema:
 *     type: json
 */
router.get('/getDirectories', ctrlLookup.thingDescriptionDirectories);



module.exports = router;