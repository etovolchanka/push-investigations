const express = require('express'),
    app = express(),
    bodyParser = require('body-parser');
const fetch = require('node-fetch');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

let apiKey = '';

const sendPush = (token) => {
    return fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        body: JSON.stringify({
            to: token,
            notification: {
                title: 'A Push!',
                body: 'Now try to unsubscribe',
            },
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `key=${apiKey}`,
        }
    });
};

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

app.post('/send', async (req, res) => {
    apiKey = req.body.apiKey;
    try {
        const result = await sendPush(req.body.token);
        res.send(await result.json());
    } catch (e) {
        res.send(e);
    }
});

app.listen(3000, () => {
    console.log('App is running on port 3000');
});
