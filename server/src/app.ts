import express from 'express';
import cors from 'cors';
import prisma from './db';
import path from 'path'
import fs from 'fs';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173' // Your Vite dev server
}));

app.use(express.json());

// Example route using Prisma
app.get('/api/albums', async (req, res) => {
    const tracks = await prisma.album.findMany({
        include: {
            tracks: true,
        },
        orderBy: { "id": "desc" }
        // take: 500
    });
    res.json(tracks);
});

app.get('/artwork/:uuid', (req, res) => {
    const artworkDir = path.join(__dirname, '../data/artwork');
    const files = fs.readdirSync(artworkDir);
    const artworkFile = files.find(file => file.startsWith(`${req.params.uuid}-artwork`));
    if (artworkFile) {
        res.sendFile(path.join(artworkDir, artworkFile))
    } else {
        res.status(404).send('Artwork not found')
    }
})

// Ensure Prisma disconnects on app termination
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
