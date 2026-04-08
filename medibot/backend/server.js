import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import chatRouter from './routes/chat.js';
import mapsRouter from './routes/maps.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRouter);
app.use('/api/maps', mapsRouter);

app.get('/', (req, res) => res.send('MediBot API running'));

app.listen(PORT, () => console.log(`MediBot backend running on port ${PORT}`));
