import express from 'express';
import prisma from './db';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Example route using Prisma
app.get('/api/tracks', async (req, res) => {
    const tracks = await prisma.track.findMany({
        include: {
            artist: true,
            album: true
        }
    });
    res.json(tracks);
});

// Ensure Prisma disconnects on app termination
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
