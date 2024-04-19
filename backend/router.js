const express = require('express');
const router = express.Router();

const EventComponent = require('./components/event/event-component');
const EventRepository = require('./components/event/data/event-repository');

const responseStatusCode = require('./entity/response-status-code');
const applyResult = require('./entity/apply-result');

router.get('', async (req, res) => {
     const eventComponent = new EventComponent(new EventRepository());
     // const result = await eventComponent.fazAlgo();
     const result = {hasError: () => {return false}, isResultEmpty: () => {return false}, getResult: () => {return '2'}};
     applyResult(result, res, responseStatusCode.OK);
});

module.exports = router;