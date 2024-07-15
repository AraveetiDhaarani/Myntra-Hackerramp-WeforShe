const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const InstagramPost = require('./models/InstagramPost');

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/fashion_communities', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.use(bodyParser.json());


async function analyzeAndStoreResultsByStyle(style) {
    try {
        
        const result = await InstagramPost.aggregate([
            { $match: { hashtags: new RegExp(`#${style}`, 'i') } }, 
            { $sort: { createdAt: -1, likes: -1 } }, 
            { $limit: 10 } 
        ]);

        
        const TrendyPost = mongoose.model(`${style}Post`, InstagramPost.schema);
        await TrendyPost.deleteMany({}); 
        await TrendyPost.create(result); 
        console.log(`Stored trendy ${style} posts successfully.`);
    } catch (err) {
        console.error(`Error analyzing and storing ${style} posts:`, err);
    }
}


const stylesToAnalyze = ['Bohemian', 'Minimalist','Streetstyle','Retro']; // Add more styles as needed


const analysisInterval = 20000; 


async function startPeriodicAnalysis() {
    try {
        
        for (const style of stylesToAnalyze) {
            await analyzeAndStoreResultsByStyle(style);
        }

        
        setInterval(async () => {
            for (const style of stylesToAnalyze) {
                await analyzeAndStoreResultsByStyle(style);
            }
        }, analysisInterval);

        console.log(`Periodic analysis started. Interval: ${analysisInterval / 10000} seconds`);
    } catch (err) {
        console.error('Error starting periodic analysis:', err);
    }
}


startPeriodicAnalysis();


app.get('/api/bohemian', async (req, res) => {
    try {
        const TrendyBohemianPost = mongoose.model('BohemianPost', InstagramPost.schema);
        const bohemianPosts = await TrendyBohemianPost.find({});
        console.log(bohemianPosts)
        res.json(bohemianPosts);
    } catch (err) {
        console.error('Error fetching Bohemian community data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/api/minimalist', async (req, res) => {
    try {
        const TrendyMinimalistPost = mongoose.model('MinimalistPost', InstagramPost.schema);
        const minimalistPosts = await TrendyMinimalistPost.find({});
        res.json(minimalistPosts);
    } catch (err) {
        console.error('Error fetching Minimalist community data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/api/streetstyle', async (req, res) => {
    try {
        const TrendyStreetStylePost = mongoose.model('StreetStylePost', InstagramPost.schema);
        const StreetStyelPost = await TrendyStreetStylePost.find({});
        res.json(StreetStyelPost);
    } catch (err) {
        console.error('Error fetching StreetStyle community data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/api/retro', async (req, res) => {
    try {
        const TrendyRetroPost = mongoose.model('RetroPost', InstagramPost.schema);
        const RetroPosts = await TrendyRetroPost.find({});
        res.json(RetroPosts);
    } catch (err) {
        console.error('Error fetching Retro community data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
const frontendPath = path.join(__dirname, '../frontend');


app.use(express.static(frontendPath)); 


app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
