const express = require('express');
const cors = require('cors')
const { Sequelize, QueryTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const axios = require('axios');

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
const ApiToken = require('./models/api_token')(sequelize)
  
//routes
app.get('/test', (req, res) => {
  User.findAll().then((users) => {
    res.json(users);
  });
});

//save access tokens for the user
app.post('/api/token', async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        token: req.body.token
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const commonFields = {
      user_id: user.id,
      api_domain: req.body.api_domain,
      expires_in: req.body.expires_in
    };

    // Upsert access_token
    await ApiToken.upsert({
      ...commonFields,
      token_type: 'access_token',
      token: req.body.access_token
    }, {
      conflictFields: ['user_id', 'token_type']
    });

    // Upsert refresh_token
    await ApiToken.upsert({
      ...commonFields,
      token_type: 'refresh_token',
      token: req.body.refresh_token
    }, {
      conflictFields: ['user_id', 'token_type']
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Token saving failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/oauth', (req, res) => {
  const clientId = "1000.TV6HFTR586F2SJ2F8K25JRDT2K6C1B"
  const redirectUrl = "http://localhost:3001/oauth"
  const clientSecret = '177a022941b2ebbab718710bdc1bb5989fb402a5cf';

  const { code, 'accounts-server': accountsServer } = req.query;

  axios.post(`${accountsServer}/oauth/v2/token`, null, {
      params: {
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUrl,
        grant_type: 'authorization_code',
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
  }).then((response) => {
    const tokenData = response.data;
    
    //redirect to homepage with these tokens
    const queryParams = new URLSearchParams({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      api_domain: tokenData.api_domain,
      expires_in: tokenData.expires_in.toString()
    });

    const redirectUrl = `http://localhost:5173?${queryParams.toString()}`;
    res.redirect(redirectUrl);
  })
})

app.get('/should_authorize/:token', (req, res) => {
  let token = req.params.token;
  
  //find user by token
  User.findOne({
    where: {
      token: token
    }
  }).then(async (user) => {
    if (user) {
      // Check if refresh_token exists for this user
      const refreshToken = await ApiToken.findOne({
        where: {
          user_id: user.id,
          token_type: 'refresh_token',
        }
      });

      // If no refresh_token found, authorize
      const shouldAuthorize = !refreshToken;

      return res.status(200).json({ should_authorize: shouldAuthorize });
    }
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

function is_access_token_expired(accessToken) {
  const expiresInSeconds = parseInt(accessToken.expires_in, 10);
  const updatedAt = new Date(accessToken.updated_at);
  const expirationTime = new Date(updatedAt.getTime() + expiresInSeconds * 1000);
  const now = new Date();

  return now >= expirationTime; 
}

async function refresh_tokens(user) {
  //1. Get initial tokens
  let tokensResponse = await ApiToken.findAll({
    where: {
      user_id: user.id
    }
  });

  let access_token = tokensResponse.find(token => token.token_type === 'access_token');
  let refresh_token = tokensResponse.find(token => token.token_type === 'refresh_token');

  let tokens = {
    'access_token': access_token.token,
    'refresh_token': refresh_token.token
  };

  //2. Refresh access token if it is expired
  if(is_access_token_expired(access_token)) {
    //2.1. refresh tokens
    const accountsServer = 'https://accounts.zoho.eu';
    const refreshToken = tokens.refresh_token;
    const clientId = '1000.TV6HFTR586F2SJ2F8K25JRDT2K6C1B';
    const clientSecret = '177a022941b2ebbab718710bdc1bb5989fb402a5cf';
    const redirectUrl = 'http://localhost:3001/oauth';

    const url = `${accountsServer}/oauth/v2/token`;

    const params = new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUrl,
      grant_type: 'refresh_token'
    });

    response = await axios.post(url, params);
    let newTokenData = response.data;
    
    //2.2. save new access token to db
    await ApiToken.update({
      token: newTokenData.access_token,
      api_domain: newTokenData.api_domain,
      expires_in: newTokenData.expires_in,
      updated_at: new Date()
    }, {
      where: {
        user_id: user.id,
        token_type: 'access_token'
      },
    });

    //2.3. replace access token in tokens object
    tokens.access_token = newTokenData.access_token;
  }

  return tokens;
}

app.post('/api/form_submissions', async (req, res) => {
  //1. get user by token 
  const user = await User.findOne({
    where: {
      token: req.body.token
    }
  });

  if (!user) {
    return res.status(500).json({ error: 'Cannot find user' });
  }

  //2. get new tokens
  const userTokens = await refresh_tokens(user); //{"access_token": "...", "refresh_token": "..."}

  //3. send API request
  axios.post(
    'https://recruit.zoho.eu/recruit/v2/Candidates',
    {
      data: [{
        'First_Name': req.body.firstName,
        'Last_Name': req.body.lastName,
        'Email': req.body.email,
        'Phone': req.body.phone,
        'Expected_Salary': req.body.expectedSalary,
        'Experience_in_Years': req.body.yearsExperience,
        'LinkedIn__s': req.body.linkedin,
        'Skill_Set': req.body.skills.join(', '),
        'Source': req.body.sourceApplication,
        'Current_Job_Title': req.body.currentJobTitle
      }]
    },
    {
      headers: {
        'Authorization': `Zoho-oauthtoken ${userTokens.access_token}`
      }
    }
  )
  .then((response) => {
    res.status(200).json(response.data);
  })
  .catch((error) => {
    res.status(500).json(error.response?.data || { error: 'Request failed' });
  });

  //TODO: also there are files field "resume" that must be saved to Zoho Recruit

  /*axios.get('https://recruit.zoho.eu/recruit/v2/Candidates', {
    headers: {
      'Authorization': `Zoho-oauthtoken ${userTokens.access_token}`
    }
  }).then((response) => {
    res.status(200).json(response.data);
  }).catch((error) => {
    res.status(500).json(error);
  });*/
  
  /*try {
    FormSubmission.create({
      address: req.body.address,
      dob: req.body.dob,
      position: req.body.position,
      education_level: req.body.educationLevel, //Correct Name: Highest Education Held
      previous_employer: req.body.previousEmployer,
      notice_period: req.body.noticePeriod,
      availability_interview: req.body.availabilityInterview,
      preferred_location: req.body.preferredLocation,
      cover_letter: req.body.coverLetter,
    }).then((submission) => {
      res.status(201).json(submission);
    }).catch((error) => {
      console.log(error);
    });
  } catch (error) {
    console.error('Failed to save form submission:', error);
    res.status(500).json({ error: 'Failed to save submission' });
  }*/
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
