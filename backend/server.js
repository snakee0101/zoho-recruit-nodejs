const express = require('express');
const cors = require('cors')
const { Sequelize, QueryTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const jwt = require('jsonwebtoken');
 
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors()); //allow requests from frontend (npm install cors --save)

//initialize sequalize
const sequelize = new Sequelize('zoho_recruit', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres'
});

try {
    sequelize.authenticate(); 
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

const FormSubmission = require('./models/form_submission')(sequelize)
const User = require('./models/user')(sequelize)
  
//routes
app.get('/test', (req, res) => {
  User.findAll().then((users) => {
    res.json(users);
  });
});

app.get('/api/form_submissions', (req, res) => {
  FormSubmission.findAll().then((submissions) => {
    res.json(submissions);
  });
});

app.post('/api/is_token_valid', (req, res) => {
  if (req.body.token == null) {
    return res.status(200).json({ valid: false });
  }
  
  User.findOne({
    where: {
      token: req.body.token
    }
  }).then((user) => {
    if (user) {
      res.status(200).json({ valid: true });
    } else {
      res.status(200).json({ valid: false });
    }
  }).catch((error) => {
      res.status(200).json({ valid: false });
  });
});

app.post('/api/login', (req, res) => { 
  //найти пользователя по email
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then((user) => {
    if (bcrypt.compareSync(req.body.password, user.password)) { //сравнить текстовый пароль пользователя (req.body.password) с его bcrypt-хешем (user.password) из базы
      //если все правильно - сохранить вход пользователя - сгенерировать token,...
      let token = jwt.sign({ id: user.email }, 'test JWT secret', { expiresIn: '7d' });
      
      //сохранить token в базу
      User.update({
        token: token
      }, {
        where: {
          email: req.body.email
        }
      }).then(() => {
        res.status(200).json({ token: token }); //отправим token на клиент где сохраним его в localStorage
      });      
    } else {
      res.status(401).json({ error: 'Invalid credentials' }); //иначе - ошибка
    }
  }).catch((error) => {
    res.status(500).json({ error: 'Cannot find user' });
  });
}); 

app.post('/api/form_submissions', (req, res) => {
  try {
    FormSubmission.create({
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      dob: req.body.dob,
      position: req.body.position,
      linkedin: req.body.linkedin,
      education_level: req.body.educationLevel,
      years_experience: req.body.yearsExperience,
      skills: req.body.skills,
      previous_employer: req.body.previousEmployer,
      current_job_title: req.body.currentJobTitle,
      notice_period: req.body.noticePeriod,
      expected_salary: req.body.expectedSalary,
      availability_interview: req.body.availabilityInterview,
      preferred_location: req.body.preferredLocation,
      cover_letter: req.body.coverLetter,
      source_application: req.body.sourceApplication,
    }).then((submission) => {
      res.status(201).json(submission);
    }).catch((error) => {
      console.log(error);
    });
  } catch (error) {
    console.error('Failed to save form submission:', error);
    res.status(500).json({ error: 'Failed to save submission' });
  }
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
