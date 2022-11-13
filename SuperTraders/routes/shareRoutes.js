const express = require('express')
const router = express.Router()
const Share = require('../models/Share')

//Get all share
router.get('',async (req,res) => {
  const share = await Share.findAll()

  if (!share) {
      return res.status(400).send({
        message: `No share found `,
      });
  }

  return res.send(share)
})

// Get a share with code
router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    const share = await Share.findOne({
      where: {
        id,
      },
    });
  
    if (!share) {
      return res.status(400).send({
        message: `No share found with the id: ${id}`,
      });
    }
  
    return res.send(Share);
  })

// Create Share
router.post('/createShare', async (req, res) => {
    const { code, name } = req.body;

    if (!code) {
      return res.status(400).send({
        message: 'Please provide a code to create a share!',
      });
    }
    if (!name ) {
      return res.status(400).send({
        message: 'Please provide a name to create a share!',
      });
    }

    let codeExists = await Share.findOne({
      where: {
        code,
      },
    });
  
    if (codeExists) {
      return res.status(400).send({
        message: 'An share with that code already exists!',
      });
    }
    try {
      let newShare = await Share.create({
        code,
        name
      });
      return res.send(newShare);
    } catch (err) {
      return res.status(500).send({
        message: `Error: ${err.message}`,
      });
    }
  })

//Update Share with id
router.post('/updateShare/:id', async (req,res) => {
    const { code, name } = req.body;
    const { id } = req.params;
  
    const share = await Share.findOne({
      where: {
        id,
      },
    });
  
    if (!share) {
      return res.status(400).send({
        message: `No share found with the id ${id}`,
      });
    }
  
    try {
      if (code) {
        user.code = code;
      }
      if (name) {
        user.name = name;
      }
      
      share.save();
      return res.send({
        message: `Share id:${id} has been updated!`,
      });
    } catch (err) {
      return res.status(500).send({
        message: `Error: ${err.message}`,
      });
    }
  })
  
//Delete Share with id
router.post('/deleteShare/:id', async (req,res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({
        message: 'Please provide a id for the share you are trying to delete!',
      });
    }
  
    const share = await Share.findOne({
      where: {
        id,
      },
    });
  
    if (!share) {
      return res.status(400).send({
        message: `No share found with the id ${id}`,
      });
    }
  
    try {
      await share.destroy();
      return res.send({
        message: `User id:${id} has been deleted!`,
      });
    } catch (err) {
      return res.status(500).send({
        message: `Error: ${err.message}`,
      });
    }
  })


  module.exports = router