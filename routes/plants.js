const express = require('express');
const router = express.Router();
const Plant = require('../models/plant');
const PlantUser = require('../models/user_plant');

router.get('/', async (req, res, next) => {
  const plants = await Plant.all();
  res.render('plants/index', { title: 'PlantCare|| All Plants', plants: plants });
});

router.get('/form', async (req, res, next) => {
  res.render('plants/form', { title: 'PlantCare|| All Plants' });
});

router.get('/edit', async (req, res, next) => {
  let plantId = req.query.id;
  let plant = await Plant.get(plantId);
  res.render('plants/form', { title: 'PlantCare|| All Plants', plant: plant });
});

router.get('/show/:id', async (req, res, next) => {
  const plant = await Plant.get(req.params.id)
  let templateVars = {
    title: 'PlantCare || Plants',
    plant: plant,
    plantId: req.params.id,
    statuses: PlantUser.statuses,
  }
  if (req.session.currentUser) {
    templateVars.plantUser = await PlantUser.get(plant, req.session.currentUser);
  }
  res.render('plants/show', templateVars);
});

router.post('/upsert', async (req, res, next) => {
  console.log('body: ' + JSON.stringify(req.body));
  await Plant.upsert(req.body);
  let createdOrupdated = req.body.id ? 'updated' : 'created';
  req.session.flash = {
    type: 'info',
    intro: 'Success!',
    message: `the plant has been ${createdOrupdated}!`,
  };
  res.redirect(303, '/plants');
});

module.exports = router;
