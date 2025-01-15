import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '2m', target: 50 },  // 50 usuarios virtuales durante 2 minutos
        { duration: '5m', target: 100 }, // 100 usuarios virtuales durante 5 minutos
        { duration: '2m', target: 0 },   // Reducción a 0 usuarios
    ],
};

export default function () {
    let res = http.get('https://gestion-equiposarea21.onrender.com/api/equipos');
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1);
}
