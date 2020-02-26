const express = require('express'),
    app = express(),
    bodyParser = require('body-parser');
const fetch = require('node-fetch');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

let testApiKey = 'AAAACzwkXCs:APA91bEHOhZ5udHxTC9Rh-xjOjld56sin8_mNCaC_hOTqS0bIwPkN2pRStM4BDTjZgi4N6Y6773dF32SAHmRbbfRMxzn_NaHyIMfPrNXGq3sP_pWFYHD5PjHU8qq4ZKy8yjNK0KO1Qfd';

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
            'Authorization': `key=${testApiKey}`,
        }
    });
};

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

app.post('/send', async (req, res) => {
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
