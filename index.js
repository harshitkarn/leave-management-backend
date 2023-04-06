const express = require('express')
const mysql = require('mysql')
const app = express()
const cors = require('cors')
app.use(cors())

const port = process.env.PORT || 5000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
   

const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'leave-mgmt'
})

app.get('/getServerStatus',(req,res)=>{
	pool.getConnection((err,connection)=>{
		console.log('server-status')
		if(!connection) res.send([false])	
		else res.send([true])
	})
})

app.post('/addCareer',(req,res)=>{
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('addCareer ' + connection.threadId)
	const dt = req.body
        connection.query(`insert into careers values('${dt.name}','${dt.email}','${dt.phone}',${dt.age},'${dt.city}','${dt.college}','${dt.qual}');`, (err, rows) => {
            connection.release()
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
});


app.post('/addUser',(req,res)=>{
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('adduser ' + connection.threadId)
	const dt = req.body
        connection.query(`insert into users values('${dt.email}','${dt.pwd}','${dt.name}','${dt.empId}',0);`, (err, rows) => {
            connection.release()
            if (!err) {
                res.send([true])
            } else {
		res.send([false]);
            }
        })
    })
});

app.get('/getUserByEmailPass/:email/:pwd',(req,res)=>{
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('getUbyEmPass ' + connection.threadId)
        connection.query(`select * from users where email='${req.params.email}' and pwd='${req.params.pwd}';`, (err, rows) => {
            connection.release()
            if (!err) {
                res.send(rows)
            } else {
		res.send([false]);
            }
        })
    })
});

app.put('/updateLeaveByEmpId/:empId',(req,res)=>{
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('updateleave ' + connection.threadId)
        connection.query(`update users set leaveTaken=leaveTaken+${req.body.leave} where empId='${req.params.empId}';`, (err, rows) => {
            connection.release()
            if (!err) {
                res.send([true])
            } else {
		res.send([false]);
            }
        })
    })
});

app.post('/addLeave',(req,res)=>{
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('addLeave ' + connection.threadId)
	const dt = req.body
        connection.query(`insert into leaves values('${dt.dateTime}',${dt.noDays},'${dt.reason}','${dt.empId}');`, (err, rows) => {
            connection.release()
            if (!err) {
                res.send([true])
            } else {
		res.send([false]);
            }
        })
    })
});

app.listen(port, () => console.log(`Listening on port ${port}`))