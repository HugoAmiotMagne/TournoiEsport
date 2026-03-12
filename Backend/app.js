require('dotenv').config(); 
const express = require('express'); 
const mongoose = require('mongoose'); 
const cors = require('cors'); // ← AJOUTE CETTE LIGNE
 
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

const allowedOrigins = [
  'http://localhost:5173',
  'https://tournoi-esport.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      /^https:\/\/tournoi-esport[a-z0-9-]*\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

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
// Alias singulier pour compatibilité front existant
app.use('/api/match', MatchRoutes);
app.use('/api/streams', StreamRoutes); 
app.use('/api/inscriptions', InscriptionRoutes); 
app.use('/api/membreteams', MembreTeamRoutes); 
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

 
 
// MongoDB — compatible serverless (Vercel)
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });
  isConnected = true;
  console.log('Connexion à MongoDB réussie !');
  if (process.env.NODE_ENV !== 'production') {
    await testInsert();
  }
}

connectDB().catch((err) => {
  console.error('Connexion à MongoDB échouée :', err);
});
 
module.exports = app;