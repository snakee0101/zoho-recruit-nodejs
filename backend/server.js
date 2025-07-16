const express = require('express');
const cors = require('cors')
const { Sequelize, QueryTypes } = require('sequelize');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors()); //allow requests from frontend (npm install cors --save)

app.get('/api/form_submissions', (req, res) => {
  const sequelize = new Sequelize('zoho_recruit', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres'
  });

  try {
    sequelize.authenticate(); 

    const FormSubmission = require('./models/form_submission')(sequelize)
    
    FormSubmission.findAll().then((submissions) => {
        res.json(submissions);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
