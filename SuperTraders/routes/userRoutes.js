const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('',async (req,res) => {
  const user = await User.findAll()

  if (!user) {
      return res.status(400).send({
        message: `No user found `,
      });
  }

  return res.send(user)
})

// Get a user with id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: {
      id,
    },
  });

  if (!user) {
    return res.status(400).send({
      message: `No user found with the id ${id}`,
    });
  }

  return res.send(user);
})


// Create User
router.post('/createUser', async (req, res) => {
  const { username, name, surname } = req.body;

  if (!username) {
    return res.status(400).send({
      message: 'Please provide a mail to create a user!',
    });
  }
  if (!name ) {
    return res.status(400).send({
      message: 'Please provide a name to create a user!',
    });
  }
  if (!surname) {
    return res.status(400).send({
      message: 'Please provide a surname to create a user!',
    });
  }

  let usernameExists = await User.findOne({
    where: {
      username,
    },
  });

  if (usernameExists) {
    return res.status(400).send({
      message: 'An account with that username already exists!',
    });
  }

  try {
    let newUser = await User.create({
      username,
      name,
      surname
    });
    return res.send(newUser);
  } catch (err) {
    return res.status(500).send({
      message: `Error: ${err.message}`,
    });
  }
})

//Update User with id
router.post('/updateUser/:id', async (req,res) => {
  const { username, name, surname } = req.body;
  const { id } = req.params;

  const user = await User.findOne({
    where: {
      id,
    },
  });

  if (!user) {
    return res.status(400).send({
      message: `No user found with the id ${id}`,
    });
  }

  try {
    if (username) {
      user.username = username;
    }
    if (name) {
      user.name = name;
    }
    if (surname) {
      user.surname = surname;
    }
    
    user.save();
    return res.send({
      message: `User id:${id} has been updated!`,
    });
  } catch (err) {
    return res.status(500).send({
      message: `Error: ${err.message}`,
    });
  }
})

//Delete User with id
router.post('/deleteUser/:id', async (req,res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({
      message: 'Please provide a id for the user you are trying to delete!',
    });
  }

  const user = await User.findOne({
    where: {
      id,
    },
  });

  if (!user) {
    return res.status(400).send({
      message: `No user found with the id ${id}`,
    });
  }

  try {
    await user.destroy();
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