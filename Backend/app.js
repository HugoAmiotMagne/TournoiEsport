require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

// Routes
const userRoutes = require('./routes/user');
const barRoutes = require('./routes/bar');
const salleRoutes = require('./routes/salle');
const jeuRoutes = require('./routes/jeu');
const tournoiRoutes = require('./routes/tournoi');
const equipeRoutes = require('./routes/equipe');
const billetRoutes = require('./routes/billet');
const MembreTeamRoutes = require('./routes/membreteam');
const PartieRoutes = require('./routes/partie');
const MatchRoutes = require('./routes/match');
const StreamRoutes = require('./routes/stream');
const InscriptionRoutes = require('./routes/inscription');

const { testInsert } = require('./testInsert');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure req.body is an object to avoid crashes when destructuring absent bodies
app.use((req, res, next) => {
  if (req.body == null) req.body = {};
  next();
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes API
app.use('/api/users', userRoutes);
app.use('/api/bars', barRoutes);
app.use('/api/salles', salleRoutes);
app.use('/api/jeux', jeuRoutes);
app.use('/api/tournois', tournoiRoutes);
app.use('/api/equipes', equipeRoutes);
app.use('/api/billets', billetRoutes);
app.use('/api/parties', PartieRoutes);
app.use('/api/matches', MatchRoutes);
app.use('/api/streams', StreamRoutes);
app.use('/api/inscriptions', InscriptionRoutes);
app.use('/api/membreteams', MembreTeamRoutes);


// MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connexion à MongoDB réussie !');
    await testInsert();
  })
  .catch((err) => {
    console.error('Connexion à MongoDB échouée :', err);
  });

module.exports = app;
