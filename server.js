const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();
const expressLayouts = require('express-ejs-layouts');

const app = express();
app.use(expressLayouts);
// Установим движок шаблонов
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


// Set EJS as the template engine
app.set('view engine', 'ejs');

// Use express-ejs-layouts for layout support
app.use(expressLayouts);

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Your routes here...

// Обработчик главной страницы
// Главная страница
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

// Страница fashion
app.get('/fashion', async (req, res) => {
    const query = 'fashion';
    const perPage = 9; // Number of photos to fetch

    try {
        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: {
                query,
                per_page: perPage,
            },
            headers: {
                Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
            },
        });

        const photos = response.data.results.map(photo => ({
            id: photo.id,
            url: photo.urls.small,
            alt: photo.alt_description || 'Fashion photo',
        }));

        res.render('fashion', { title: 'Fashion', photos });
    } catch (error) {
        console.error('Error fetching Unsplash photos:', error.message);
        res.status(500).send('Failed to fetch fashion photos.');
    }
});

// Страница news
// News page route handler
app.get('/news', async (req, res) => {
    try {
        const response = await axios.get(`https://newsapi.org/v2/everything`, {
            params: {
                q: 'Korea',
                apiKey: process.env.NEWS_API_KEY,
                pageSize: 10,
            },
        });

        const news = response.data.articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            imageUrl: article.urlToImage,
            source: article.source.name,
            publishedAt: article.publishedAt,
        }));

        res.render('news', {
            title: 'News',
            news: news,  // Pass the news data
            layout: 'layout'  // Specify the layout to use
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).send('Failed to fetch news.');
    }
});


// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
