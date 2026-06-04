import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const dataPath = path.join(process.cwd(), 'src', 'data', 'materials.json');

app.get('/api/materials', async (req, res) => {
  try {
    const text = await fs.readFile(dataPath, 'utf8');
    return res.json(JSON.parse(text));
  } catch (err) {
    console.error('Read error', err);
    return res.status(500).json({ error: 'Could not read materials data' });
  }
});

app.put('/api/materials', async (req, res) => {
  const data = req.body;
  if (!Array.isArray(data)) return res.status(400).json({ error: 'Expected an array' });
  try {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8');
    return res.json({ ok: true });
  } catch (err) {
    console.error('Write error', err);
    return res.status(500).json({ error: 'Could not write materials data' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Materials API server listening on http://localhost:${port}`));
