const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'testapi',
    password: 'ytreza',
    port: 5433,
});

pool.connect((err, client, done) => {
  if (err) {
    console.error('Failed to connect to the database');
  } else {
    console.log('Connected to the database');

    client.query('SELECT NOW()', (err, res) => {
      done();

      if (err) {
        console.error('Failed to execute query', err.stack);
      } else {
        console.log('Query result:', res.rows[0]);
      }
    });
  }
});
