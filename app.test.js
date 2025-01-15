const request = require ('supertest');

const baseURL = 'https://gestion-equiposarea21.onrender.com'; // URL de producción

describe('GET /api/calibraciones', () => {
  let token;

  beforeAll(async () => {
    const res = await request(baseURL)
      .post('/api/login')
      .send({
        email: 'erick.palomo@epn.edu.ec',
        password: 'pruebaA@1'
      });
    
    token = res.body.token; // Asegúrate de que 'token' esté correctamente asignado
  });  

  it('debería devolver todos las calibraciones', async () => {
    const res = await request(baseURL)
      .get('/api/calibraciones')
      .set('Authorization', `Bearer ${token}`); // Usa el token en la cabecera

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  },10000);
});
