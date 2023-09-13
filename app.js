const express = require('express');
const mysql = require('mysql2');
const app = express();
require('dotenv').config();

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;

// Créez une connexion à la base de données
const connection = mysql.createConnection({
  host: dbHost, // Adresse du serveur MySQL
  user: dbUser, // Nom d'utilisateur MySQL
  password: dbPass, // Mot de passe MySQL
  database: dbName, // Nom de la base de données
});

// Connectez-vous à la base de données
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('Connecté à la base de données MySQL');
})

const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token,Origin, X-Requested-With, Content, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});



app.get('/api/data', (req, res) => {
    // Exécutez une requête SQL pour récupérer des données
    connection.query('SELECT * FROM aliment', (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des données :', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
      } else {
        res.json(results);
      }
    });
  });
  


  app.get('/api/:nom', (req, res) => {
    const nom = req.params.nom; // Récupérez le nom depuis la route dynamique
    
    // Exécutez une requête SQL pour récupérer des données basées sur le nom
    connection.query(`SELECT * FROM aliment WHERE nom LIKE ?`, [`%${nom}%`], (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des données :', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
      } else {
        res.json(results);
      }
    });
  });

module.exports = app;


