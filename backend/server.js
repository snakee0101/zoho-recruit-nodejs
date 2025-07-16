const express = require('express');
const { Sequelize, QueryTypes } = require('sequelize');
const app = express(); //создать express-приложение
const port = 3001;

app.use(express.json()); //подключить модуль


//--------------------------------------------МАРШРУТЫ
//определить GET-маршрут из ExpressJs
app.get('/', (req, res) => {
  res.send('hello world');
});

// Еще GET-маршрут - Заглушка: вернуть список задач
app.get('/api/tasks', (req, res) => {
  const sequelize = new Sequelize('zoho_recruit', 'postgres', 'postgres', { //создаем соединение с БД - new Sequelize('database name', 'user', 'password', {options});
    host: 'localhost',
    dialect: 'postgres'
  });

  try {
    sequelize.authenticate(); 

    const usersPromise = sequelize.query('SELECT * FROM cards', { //выполняем SQL-запрос
      type: QueryTypes.SELECT,
      raw: true,
      logging: console.log,
    }); //returns PROMISE

    usersPromise.then((result) => { //забираем результат (json-объект) из Promise
      res.send(result);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

// POST-маршрут - Заглушка: создать задачу
app.post('/api/tasks', (req, res) => {
  console.log('Создана задача:', req.body);
  res.status(201).json(req.body);
});

//DELETE-маршрут - Заглушка: удалить задачу
app.delete('/api/tasks/:id', (req, res) => {
  console.log('Удалена задача с id:', req.params.id);
  res.sendStatus(204);
});



//запустить сервер - начать прослушивание запросов
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
