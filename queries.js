const pool = require('./db');


const initDatabase = () => {
  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query(`CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            username TEXT NOT NULL,
            password TEXT NOT NULL
          )`, (err, result) => {
      release()
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      console.log(result.rows)
    });

  });
  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    } client.query(`CREATE TABLE IF NOT EXISTS refresh_tokens(
        id SERIAL PRIMARY KEY,
        token TEXT NOT NULL,
        user_id INT REFERENCES users (id)
      )`, (err, result) => {
      release()
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      console.log(result.rows)
    });
  });
}

const getNow = () => {
  return pool.query('SELECT NOW()');
}

const getUserById = (id) => pool.query('SELECT * FROM users WHERE id = $1', [id]);

const getUserByUsername = (username) => pool.query('SELECT * FROM users WHERE username = $1', [username]);

const addUserByParams = (username, cryptedPassword) => pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, cryptedPassword]);

const addRefreshTokenByParams = (user_id, token) => pool.query('INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)', [user_id, token]);

const getRefreshTokenByUserId = (user_id) => pool.query('SELECT * FROM refresh_tokens WHERE user_id = $1', [user_id]);

const deleteRefreshTokenByUserId = (user_id) => pool.query('DELETE FROM refresh_tokens WHERE user_id = $1', [user_id]);

const getRefreshToken = (token) => pool.query('SELECT * FROM refresh_tokens WHERE token = $1', [token]);

module.exports = {
  getNow,
  initDatabase,
  getUserById,
  getUserByUsername,
  addUserByParams,
  addRefreshTokenByParams,
  getRefreshTokenByUserId,
  getRefreshToken,
  deleteRefreshTokenByUserId
}