const express = require('express');
const app = express();
const http = require('http').Server(app);
const axios = require('axios');

app.use(express.static('build'));

const port = 80;
const server = app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Server was started on '${port}'`);
});

const io = require('socket.io').listen(server);

const url = 'https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD&api_key=b07074183c09ca066eb36310f0abb091f37a294ff88f50a1fafd6941000cba71';

io.on('connection', socket => {
  console.log('a user connected');
  io.emit('event', state.data);

});

const state = {
  data: []
};

const getData = async () => {
  try{
    const response = await axios.get(url);
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

    // state.data = data;
    state.data = data;
    // console.log(data);
  } catch (error) {
    console.error(error);
  }
};

setInterval(() => {
  getData();
}, 1000);


setInterval(() => {
  io.emit('event', state.data);
}, 1000);
