require('dotenv').config({ path: '.env' });

const express = require('express');
const axios = require('axios');

const app = express();
const dataSourceRootUrl = process.env.DATA_SOURCE_ROOT_URL;

// Check if user is authenticated
async function authUser(name, password) {
    try {
        const response = await axios.post(dataSourceRootUrl + 'auth', {
            name: name,
            password: password
        })

        if (response.status === 200 && response.data === "OK") {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error.response.data);
        return false
    }
}

app.get('/heroes', async (req, res) => {
    if (!req.headers.name || !req.headers.password) {
        const heroesResponse = await axios.get(dataSourceRootUrl + 'heroes');
        res.json({ heroes: heroesResponse.data });
        return;
    }

    const { name, password } = req.headers;

    // Perform authentication logic asynchronously
    const isAuthenticated = await authUser(name, password);
    if (isAuthenticated) {
        // Fetch heroes data
        const heroesResponse = await axios.get(dataSourceRootUrl + 'heroes');
        const heroesData = heroesResponse.data;

        // Fetch profiles data for each hero
        const profilesPromises = heroesData.map(hero => {
            const profileUrl = dataSourceRootUrl + `heroes/${hero.id}/profile`;
            return axios.get(profileUrl);
        });

        const profilesResponses = await Promise.all(profilesPromises);
        const profilesData = profilesResponses.map(response => response.data);

        // Combine heroes and profiles data
        const combinedData = heroesData.map((hero, index) => {
            return {
                id: hero.id,
                name: hero.name,
                image: hero.image,
                profile: profilesData[index]
            };
        });

        res.json({ heroes: combinedData });
    } else {
        res.sendStatus(401);
    }
});

app.get('/heroes/:heroId', async (req, res) => {
    const { heroId } = req.params;

    if (!req.headers.name || !req.headers.password) {
        const heroesResponse = await axios.get(dataSourceRootUrl + `heroes/${heroId}`);
        res.json(heroesResponse.data);
        return;
    }

    const { name, password } = req.headers;

    // Perform authentication logic asynchronously
    const isAuthenticated = await authUser(name, password);
    if (isAuthenticated) {
        // Fetch heroes data
        const heroResponse = await axios.get(dataSourceRootUrl + `heroes/${heroId}`);
        const heroData = heroResponse.data;

        if (heroData.code && heroData.code === 1000) {
            res.sendStatus(500);
            return;
        }

        // Fetch hero's profile data
        const profileResponse = await axios.get(dataSourceRootUrl + `heroes/${heroId}/profile`);
        const profileData = profileResponse.data;

        // Combine hero and profile data
        const combinedData = {
            id: heroData.id,
            name: heroData.name,
            image: heroData.image,
            profile: profileData
        };

        res.json(combinedData);
    } else {
        res.sendStatus(401);
    }
});

app.listen(process.env.SERVER_URL_PORT, () => {
    console.log(`API server is running on ${process.env.SERVER_URL}:${process.env.SERVER_URL_PORT}`);
});