const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();
const port = 8080;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connection =   mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'lotterie',
    port: 3306,
});

app.post('/lotto', async(req, res) => {
    let year = req.body.year;
    if(!year) {
        year = new Date().getFullYear();
    }
    const sql = `SELECT DISTINCT concorso,DATE_FORMAT(data,"%d/%m/%Y") as data,ruota,GROUP_CONCAT(numero SEPARATOR ' - ') as numeri FROM lotto WHERE data LIKE '${year}%' GROUP BY data,ruota ORDER BY id ASC`;
    const [rows] = await connection.execute(sql);
    res.send(rows);
});

app.post('/lottolast', (req, res) => {  
    const pag = req.body.pag;
    const offset = (pag- 1) * 11;
    let sql = `SELECT *, GROUP_CONCAT(numero SEPARATOR ' - ') as numeri FROM lotto GROUP by data,ruota ORDER BY id DESC LIMIT 11 OFFSET ${offset}`;
    const results = connection.query(sql);
    const arr = [];
    results.forEach(item => {
        arr.push({'data':item.data, 'concorso': item.concorso, 'ruota': item.ruota, 'numeri':item.numeri});
    });
    res.send(arr);
});

app.post('/getdiecieLotto5MinLast', (req, res) => {  
    const pag = req.body.pag;
    const offset = (pag- 1) * 288;
    let sql = `SELECT *, GROUP_CONCAT(numero_estratto SEPARATOR ' - ') as numeri FROM estrazioni_giornaliere GROUP by data_estrazione,concorso ORDER BY id DESC LIMIT 288 OFFSET ${offset}`;
    const results = connection.query(sql);
    const arr = [];
    results.forEach(item => {
        arr.push({'data_estrazione':item.data_estrazione, 'concorso': item.concorso, numeri: item.numeri, 'oro': item.oro,'doppiooro': item.doppiooro});
    });
    res.send(arr);
});

app.post('/diecielottosera', (req, res) => {
    const richiesta = req.body;
    const lng = richiesta.length;
    let where = '';
    for(let i = 0; i < lng; i++){
        where += ` numero_estratto = ${richiesta[i]} OR `;
    }
    where = where.slice(0, -3);
    let sql = `SELECT *, count(*) as x FROM estrazioni WHERE (${where}) GROUP by data_estrazione HAVING x > ${lng - 1} ORDER BY id DESC`;
    const results = connection.query(sql);
    const arr = [];
    results.forEach(item => {
        let sql_second = `SELECT GROUP_CONCAT(numero_estratto SEPARATOR ' - ') as numeri  FROM estrazioni WHERE data_estrazione = '${item.data_estrazione}' AND oro = 0 AND doppiooro = 0`;
        const results_second = connection.query(sql_second);
        let sql_oro = `SELECT oro  FROM estrazioni WHERE data_estrazione = '${item.data_estrazione}' AND oro > 0`;
        const results_oro = connection.query(sql_oro);
        let sql_doppiooro = `SELECT IF(doppiooro > 0, doppiooro, 0) as doppiooro FROM estrazioni WHERE data_estrazione = '${item.data_estrazione}' AND doppiooro > 0`;
        const results_doppiooro = connection.query(sql_doppiooro);
        let doppiooro = 0;
        if(results_doppiooro.length > 0) {
            doppiooro = results_doppiooro[0].doppiooro;
        }
        arr.push({'data_estrazione':item.data_estrazione, 'concorso': item.concorso, numeri: results_second[0].numeri, 'oro': results_oro[0].oro,'doppiooro': doppiooro});
    });
    res.send(arr);
});

app.post('/diecielottosempre', (req, res) => {
    const richiesta = req.body;
    const lng = richiesta.length;
    let where = '';
    for(let i = 0; i < lng; i++){
        where += ` numero_estratto = ${richiesta[i]} OR `;
    }
    where = where.slice(0, -3);
    let sql = `SELECT *, count(*) as x FROM estrazioni_giornaliere WHERE (${where}) GROUP by data_estrazione HAVING x > ${lng - 1} ORDER BY id DESC`;
    const results = connection.query(sql);
    const arr = [];
    results.forEach(item => {
        let sql_second = `SELECT GROUP_CONCAT(numero_estratto SEPARATOR ' - ') as numeri, oro, doppiooro  FROM estrazioni_giornaliere WHERE data_estrazione = '${item.data_estrazione}'`;
        const results_second = connection.query(sql_second);
        arr.push({'data_estrazione':item.data_estrazione, 'concorso': item.concorso, numeri: results_second[0].numeri, 'oro': results_second[0].oro,'doppiooro': results_second[0].doppiooro});
    });
    res.send(arr);
});


app.post('/superenalotto', (req, res) => {  
    const pag = req.body.pag;
    const offset = (pag - 1) * 50;
    let sql = `SELECT * FROM superenalotto ORDER BY id DESC LIMIT 50 OFFSET ${offset}`;
    const results = connection.query(sql);
    const arr = [];
    results.forEach(item => {
        arr.push({'data_estrazione':item.data_estrazione, 'concorso': item.concorso, numeri: item.numeri, 'jolly': item.jolly,'star': item.star});
    });
    res.send(arr);
});

app.post('/milionday', (req, res) => {  
    const pag = req.body.pag;
    let sql = `SELECT id,numeri, DATE_FORMAT(data_estrazione,"%d/%m/%Y") as data_estrazione FROM milionday WHERE data_estrazione LIKE '%${pag}%' ORDER BY id DESC LIMIT 365`;
    const results = connection.query(sql);
    const arr = [];
    results.forEach(item => {
        arr.push({'data_estrazione':item.data_estrazione, 'concorso': item.concorso, numeri: item.numeri});
    });
    res.send(arr);
});

app.listen(port, () => console.log(`Server Started`));
