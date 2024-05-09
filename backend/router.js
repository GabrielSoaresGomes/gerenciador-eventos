const express = require('express');
const router = express.Router();

const EventComponent = require('./components/event/event-component');
const EventRepository = require('./components/event/data/event-repository');

const responseStatusCode = require('./entity/response-status-code');
const applyResult = require('./entity/apply-result');

router.get('', async (req, res) => {
     const eventComponent = new EventComponent(new EventRepository());
     const result = await eventComponent.listEvents();
     applyResult(result, res, responseStatusCode.OK);
});

router.get('/:eventId', async (req, res) => {
    const eventComponent = new EventComponent(new EventRepository());
    const result = await eventComponent.getEvent(req?.params?.eventId);
    applyResult(result, res, responseStatusCode.OK);
});

router.delete('/:eventId', async (req, res) => {
    const eventComponent = new EventComponent(new EventRepository());
    const result = await eventComponent.removeEvent(req?.params?.eventId);
    applyResult(result, res, responseStatusCode.ACCEPTED);
});

router.post('', async (req, res) => {
   const eventComponent = new EventComponent(new EventRepository());
   const eventBody = req.body;
   const result = await eventComponent.addNewEvent(eventBody);
   applyResult(result, res, responseStatusCode.CREATED);
});
module.exports = router;