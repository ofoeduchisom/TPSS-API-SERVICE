import express from 'express';
import bodyParser from 'body-parser';

import paymentsRoutes from './routes/payments.js';

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use('/', paymentsRoutes);

app.get('/', (req, res) =>
    res.send('Hello from Homepage. '));

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);