require('dotenv').config({ path: '.env' });

const axios = require('axios');
const { expect } = require('chai');

const serverUrl = `${process.env.SERVER_URL}:${process.env.SERVER_URL_PORT}`;

describe('API Tests', function () {
    before(async function () {
        // Start the server or set up any necessary test environment
    });

    after(async function () {
        // Clean up any test environment or resources
    });

    async function testAuthenticatedListHeroes() {
        const response = await axios.get(`${serverUrl}/heroes`, {
            headers: {
                'name': process.env.NAME,
                'password': process.env.PASSWORD
            }
        });

        expect(response.status).to.equal(200);
        expect(response.data).to.be.an('object');
        expect(response.data.heroes).to.be.an('array');

        if (response.data.heroes !== []) {
            for (let i = 0; index < response.data.heroes.length; i++) {
                expect(response.data.heroes[i].id).to.be.a('string');
                expect(response.data.heroes[i].name).to.be.a('string');
                expect(response.data.heroes[i].image).to.be.a('string');
                expect(response.data.heroes[i].profile).to.be.an('object'); 
            }
        }
    }

    describe('GET /heroes', function () {
        it('should return a list of heroes', async function () {
            const response = await axios.get(`${serverUrl}/heroes`);
            expect(response.status).to.equal(200);
            expect(response.data).to.be.an('object');
            expect(response.data.heroes).to.be.an('array');
        });

        it('should return an authenticated list of heroes', async function () {
            testAuthenticatedListHeroes();

            const response = await axios.get(`${serverUrl}/heroes`, {
                headers: {
                    name: process.env.NAME,
                    password: process.env.PASSWORD
                }
            }); 
        });
    });

    describe('GET /heroes/:heroId', function () {
        it('should return a hero with the specified ID', async function () {
            const heroId = '1';
            const response = await axios.get(`${serverUrl}/heroes/${heroId}`);

            expect(response.status).to.equal(200);
            expect(response.data).to.be.an('object');
            expect(response.data.id).to.equal(heroId);
            expect(response.data.name).to.be.a('string');
            expect(response.data.image).to.be.a('string');
            expect(response.data.profile).to.be.an('object');
        });

        it('should return an authenticated hero with the specified ID', async function () {
            const heroId = '1';
            const response = await axios.get(`${serverUrl}/heroes/${heroId}`);

            expect(response.status).to.equal(200);
            expect(response.data).to.be.an('object');
            expect(response.data.id).to.equal(heroId);
            expect(response.data.name).to.be.a('string');
            expect(response.data.image).to.be.a('string');
            expect(response.data.profile).to.be.an('object');
        });        
    });
});
