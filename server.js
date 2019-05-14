const express = require('express');
const app = express();
const http = require('http').Server(app);
const axios = require('axios');
const path = require('path');

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Server was started on '${port}'`);
});

const io = require('socket.io').listen(server);

const API_URL = 'https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD&api_key=b07074183c09ca066eb36310f0abb091f37a294ff88f50a1fafd6941000cba71';

const state = {
  data: [],
  users: 0
};

io.on('connection', socket => {
  state.users++;
  io.emit('event', state.data);
  socket.on('disconnect', () => {
    state.users--;
    console.log('user disconnected');
  });
});




const getData = async () => {
  try{
    const response = await axios.get(API_URL);
    const data = response.data.Data.map((item, i) => {
      return {
        number: i+1,
        name: item.CoinInfo.FullName,
        shortName: item.CoinInfo.Name,
        marketCap: Math.round(item.RAW.USD.MKTCAP/1000000),
        // marketCap: +Math.random().toFixed(5),
        change: +(item.RAW.USD.CHANGEPCTDAY).toFixed(2),
        price: item.RAW.USD.PRICE,
      };
    });
    state.data = data;

  } catch (error) {
    console.error(error);
  }
};

setInterval(() => {
  if(state.users > 0){
    getData();
  }
}, 1000);

setInterval(() => {
  io.emit('event', state.data);
  io.emit('users', state.users);
}, 1000);
