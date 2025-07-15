const express = require('express');
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
  res.json([
    { id: 1, text: 'Item-1' },
    { id: 2, text: 'Item-2' },
    { id: 3, text: 'Item-3' },
  ]);
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
