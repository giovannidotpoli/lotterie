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
    const sql = `SELECT concorso,DATE_FORMAT(data,"%d/%m/%Y") as data,ruota,GROUP_CONCAT(numero SEPARATOR ' - ') as numeri FROM lotto WHERE data LIKE '${year}%' GROUP BY data,ruota,concorso ORDER BY data DESC`;
    const [rows] = await connection.execute(sql);
    res.send(rows);
});

app.post('/milionday', async(req, res) => {  
    let year = req.body.year;
    if(!year) {
        year = new Date().getFullYear();
    }
    const sql = `SELECT id,numeri,extra,orario, DATE_FORMAT(data,"%d/%m/%Y") as data FROM milionday WHERE data LIKE '${year}%' ORDER BY id DESC`;
    const [rows] = await connection.execute(sql);
    res.send(rows);
});

app.post('/superenalotto', async(req, res) => {  
    let year = req.body.year;
    if(!year) {
        year = new Date().getFullYear();
    }
    const sql = `SELECT *,DATE_FORMAT(data,"%d/%m/%Y") as data FROM superenalotto WHERE data LIKE '${year}%' ORDER BY data DESC`;
    const [rows] = await connection.execute(sql);
    res.send(rows);
});

app.listen(port, () => console.log(`Server Started`));
