const express = require('express');
const router = express.Router();
const Watering = require('../models/watering');

router.get('/', async (req, res, next) => {
  const currentUser = req.session.currentUser;
  
  if (currentUser && currentUser.id) {
      const waterings = await Watering.getByUserId(currentUser.id);
     
      res.render('waterings/index', { title: 'PlantCare || Calendar', waterings });
  } else { 
      console.log('currentUser is not available or does not have an ID');
      return res.status(401).send('Unauthorized');
  }
  
});

router.get('/form', async (req, res, next) => {
  const currentUser = req.session.currentUser;

  if (currentUser && currentUser.id) {
    Watering.getPlantsByUserId(currentUser.id)
      .then((plants) => {
        res.render('waterings/form', { title: 'PlantCare || Calendar', plants });
      })
      .catch((error) => {
        console.error('Error fetching plants:', error);
        res.status(500).send('Internal Server Error');
      });
  } else { 
    console.log('currentUser is not available or does not have an ID');
    res.status(401).send('Unauthorized');
  }
});


router.get('/edit', async (req, res, next) => {
    let wateringId = req.query.id; 
    let watering = await Watering.get(wateringId);
    res.render('waterings/form', { title: 'PlantCare || Calendar', watering: watering });
});

router.post('/upsert', async (req, res, next) => {
    console.log('body: '+ JSON.stringify(req.body));
    await Watering.upsert(req.body);
    let createdOrUpdated = req.body.id ? 'updated' : 'created'; 
    req.session.flash = {
      type: 'info',
      intro: 'Success!',
      message: `The watering date has been ${createdOrUpdated}!`,
    };
    res.redirect(303, '/waterings');
});

module.exports = router;
