var express = require('express');
var cors = require('cors');
var mariadb = require('mariadb');
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const bodyParser = require('body-parser');
const axios = require('axios');
var app = express();
var port = 3000;

// Swagger options
// const options = {
//   definition: {
//     openapi: '3.0.0', // Updated OpenAPI version
//     info: {
//       title: 'Swagger API Demo',
//       version: '1.0.0',
//       description: 'API for companies, customers, and agents',
//     },
//     basePath: '/api', // Base path for the API routes
//   },
//   apis: ['./server.js'], // Files containing annotations for Swagger
// };

const options = {
  definition: {
      info: {
          title : 'Swagger API demo',
          version: '1.0.0',
          description: 'my demo'
      }
  },
  apis: ['server.js']
}


// Database pool setup
var pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'sample',
  port: 3306,
  connectionLimit: 5,
});

const swaggerSpec = swaggerJSDoc(options);

app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log('Request Body:', req.body);
  next();
});


// Routes

/**
 * @swagger
 * /agents:
 *   get:
 *     description: List all the available agents in the API
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A successful response
 */
app.get('/agents', async (req, res) => {
  var conn;
  try {
    conn = await pool.getConnection();
    rows = await conn.query('SELECT * FROM agents');
    res.status(200).json(rows);
  } catch (e) {
    res.status(500).send(e.message);
  } finally {
    if (conn) return conn.end();
  }
});

/**
 * @swagger
 * /customers:
 *   get:
 *     description: List all the available customers in the API
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A successful response
 */
app.get('/customers', async (req, res) => {
  var conn;
  try {
    conn = await pool.getConnection();
    rows = await conn.query('SELECT * FROM customer');
    res.status(200).json(rows);
  } catch (e) {
    res.status(500).send(e.message);
  } finally {
    if (conn) return conn.end();
  }
});

/**
 * @swagger
 * /companies:
 *   get:
 *     description: List all the available companies in the API
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A successful response
 */
app.get('/companies', async (req, res) => {
  var conn;
  try {
    conn = await pool.getConnection();
    var rows = await conn.query('SELECT * FROM company');
    res.status(200).json(rows);
  } catch (e) {
    res.status(500).send(e.message);
  } finally {
    if (conn) return conn.end();
  }
});

/**
 * @swagger
 * /companies/{id}:
 *  delete:
 *      tags:
 *         - Delete by ID
 *      description: Delete by id
 *      parameters:
 *          - name: id
 *            description: provide an id to delete the entire record
 *            in: path
 *            type: integer
 *            required: true
 *      responses: 
 *          '200':
 *              description: A successful response
 */

app.delete('/companies/:id',async(req,res)=>{
  try{
    var id = req.params.id;
    conn = await pool.getConnection();
    rows = await conn.query("delete from company where COMPANY_ID = ?",[id]);
    console.log(rows);
    res.status(200).send("Successfully deleted Company");
  }
  catch(e){
  throw e;
  }finally{
  if(conn){
  return conn.end();
  }
  }
  });

/**
 * @swagger
 * /companies:
 *  post:
 *      description: Post to create a new entry in the customer table
 *      parameters:
 *          - name: reqBody
 *            description: request body
 *            in: body
 *            schema:
 *              type: object
 *              properties:
 *                  id:
 *                    type: string
 *                  name:
 *                    type: string
 *                  city:   
 *                    type: string
 *              required:
 *                  - city
 *                  - id
 *                  - name
 *      responses:
 *          '200':
 *              description: A successful response
 */

app.post('/companies',async(req,res)=>{
  var conn;
  const id = req.body.id;
  const name = req.body.name;
  const city = req.body.city;
  console.log(req.body);
  try{
          conn = await pool.getConnection();       
          rows = await conn.query("insert into company (COMPANY_ID,COMPANY_NAME,COMPANY_CITY) values (?,?,?)" ,[id,name,city]);
          console.log(rows);
          res.status(201).send("New Company Added Successfully!");
  
  throw e;
  }finally{
  if(conn){
  return conn.end();
  }
  }
  });


/**
 * @swagger
 * /companies/{id}:
 *  put:
 *      tags:
 *         - PUT Operation
 *      description: put by id
 *      parameters:
 *          - name: id
 *            description: provide and id and change the value of the city you want to update
 *            in: path
 *            type: integer
 *            required: true
 *          - name: reqBody
 *            description: request body
 *            in: body
 *            schema: 
 *              type: object
 *              properties:
 *                  city:
 *                      type: string
 *              required:
 *                  -city
 *      responses:
 *          '200':
 *              description: A successful response
 */

app.put('/companies/:id',async(req,res)=>{
  var conn;
  try{
  console.log(req.body.city);        
  console.log(req.params.id);
  const id = req.params.id;
    const bodyval = req.body.city;
          conn = await pool.getConnection();       
          rows = await conn.query("update company set COMPANY_CITY = ? where COMPANY_ID = ?",[bodyval,id]);
          console.log(rows);
          res.status(200).send("Successfully Updated Company");
  }
  catch(e){
  throw e;
  }finally{
  if(conn){
  return conn.end();
  }
  }
  });

/**
 * @swagger
 * /companies/{id}:
 *  patch:
 *      tags:
 *         - Patch Operation
 *      description: patch option on the company where you can provide the id to modify the city name
 *      parameters:
 *          - name: id
 *            description: id to update by
 *            in: path
 *            type: integer
 *            required: true
 *          - name: reqBody
 *            description: request body
 *            in: body
 *            schema: 
 *              type: object
 *              properties:
 *                  city:
 *                      type: string
 *              required:
 *                  -city
 *      responses:
 *          '200':
 *              description: A successful response
 */
app.get('/say', async (req, res) => {
    const keyword = req.query.keyword;
    if (!keyword) {
        return res.status(400).send('keyword query parameter is required');
    }
    
    try {
        // Assuming your function is deployed on AWS Lambda
        const response = await axios.get(`https://qyoq672b18.execute-api.us-east-1.amazonaws.com/TestStage/`, {
            params: { keyword }
        });
        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error forwarding the request');
    }
});

app.patch('/companies/:id',async(req,res)=>{
  var conn;
  try{
  console.log(req.body.city);
  console.log(req.params.id);
  const id = req.params.id;
          const bodyval = req.body.city;
          conn = await pool.getConnection();
          rows = await conn.query("update company set COMPANY_CITY = ? where COMPANY_ID = ?",[bodyval,id]);
          console.log(rows);
          res.status(200).send("Successfully Updated Company record");
  }
  catch(e){
  throw e;
  }finally{
  if(conn){
  return conn.end();
  }
  }
  });

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
