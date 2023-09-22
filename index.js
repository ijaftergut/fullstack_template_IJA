const pg = require('pg');
const client = new pg.Client('postgres://localhost/fullstack_template_db');
const express = require('express');
const app = express();
const path = require('path');
//important for the put
app.use(express.json())
const homePage = path.join(__dirname, 'index.html');
app.get('/', (req, res)=> res.sendFile(homePage));

const reactApp = path.join(__dirname, 'dist/main.js');
app.get('/dist/main.js', (req, res)=> res.sendFile(reactApp));

const reactSourceMap = path.join(__dirname, 'dist/main.js.map');
app.get('/dist/main.js.map', (req, res)=> res.sendFile(reactSourceMap));

const styleSheet = path.join(__dirname, 'styles.css');
app.get('/styles.css', (req, res)=> res.sendFile(styleSheet));
app.get('/api/movies', async(req, res, next)=> {
  try {
    const SQL = `
      SELECT *
      FROM movies
      ORDER BY id
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
  }
  catch(ex){
    next(ex);
  }
});
//the put
app.put('/api/movies/:id', async (req, res, next)=>{
  try{
    if(req.body.stars <1 || req.body.stars> 5){
      return res.status(500).send('Stars value must be between 1 and 5');


    }
      const SQL =`
      UPDATE movies
      SET title = $1, stars = $2
      WHERE id = $3
      RETURNING *

      `;
      const response = await client.query(SQL, [req.body.title, req.body.stars, req.params.id])
      res.send(response.rows[0])
  }catch(error){
      next(error)
  }
})
app.delete(`/api/movies/:id`, async(req,res,next)=>{
  try{
    const SQL = `
    DELETE
    FROM movies
    WHERE id=$1
    `
    const response = await client.query(SQL, [req.params.id])
    console.log(response)
    res.send(response.rows)
  }catch(error){
    next(error)
  }
})
app.post(`/api/movies`, async(req, res, next)=>{
  try{
    const SQL = `
    INSERT INTO movies(title, stars)
    VALUES($1, $2)
    RETURNING *
    `
    const response = await client.query(SQL, [req.body.title, req.body.stars])
    res.send(response.rows[0])
  }catch(error){
    next(error)
  }
})
const init = async()=> {
  await client.connect();
  console.log('connected to database');
  const SQL = `
  DROP TABLE IF EXISTS movies;
  CREATE TABLE movies(
      id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      stars INTEGER
  );
  INSERT INTO movies (title, stars) VALUES ('inception', 0);
  INSERT INTO movies (title, stars) VALUES ('starwars', 0);
  INSERT INTO movies (title, stars) VALUES ('startrek', 0)
 
`
  console.log('create your tables and seed data');
  await client.query(SQL)
  const port = process.env.PORT || 4300;
  app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
  });
}

init();
