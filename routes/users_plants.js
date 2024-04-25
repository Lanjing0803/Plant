const express = require('express');
const router = express.Router();

const PlantUser = require('../models/user_plant');

router.post('/upsert', async (req, res, next) => {
  console.log('body: ' + JSON.stringify(req.body))
  let plantId = req.body.plantId;
  redirect = `/plants/show/${plantId}`;
  await PlantUser.upsert(req.body);
  req.session.flash = {
    type: 'info',
    intro: 'Success!',
    message: 'Your plant has been added',
  };
  res.redirect(303, redirect)
});

module.exports = router;