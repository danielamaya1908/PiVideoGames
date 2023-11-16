const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');

const agent = session(app);

describe('Genres route', () => {
  describe('GET /genres', () => {
    it('Should get 200', async () => {
      await agent.get('/genres')
      expect(200)
    });
    it('Should return 19 genres', async () => {
      let data = await agent.get('/genres')
      expect(data.body).length(19)
    });
  });
})
