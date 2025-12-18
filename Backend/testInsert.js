const User = require('./models/User');
const Bar = require('./models/Bar');
const Salle = require('./models/Salle');
const Jeu = require('./models/Jeu');
const Equipe = require('./models/Equipe');
const Tournoi = require('./models/Tournoi');
const Billet = require('./models/Billet');
const Match = require('./models/Match');
const Partie = require('./models/Partie');
const Stream = require('./models/Stream');
const Inscription = require('./models/Inscription');
const MembreTeam = require('./models/MembreTeam');

async function testInsert() {
  try {
    console.log('Début des tests d\'insertion...\n');

    // ======================
    // 1. UTILISATEURS
    // ======================
    console.log('Test Users...');
    let user1 = await User.findOne({ email: 'test@example.com' });
    if (!user1) {
      user1 = new User({
        email: 'test@example.com',
        password: 'hashedpassword123',
        prenom: 'Jean',
        nom: 'Dupont',
        date_de_naissance: new Date('1990-05-15'),
        role: 'user'
      });
      await user1.save();
      console.log('Utilisateur 1 créé :', user1.prenom, user1.nom);
    } else {
      console.log('Utilisateur 1 déjà existant');
    }

    let user2 = await User.findOne({ email: 'player2@example.com' });
    if (!user2) {
      user2 = new User({
        email: 'player2@example.com',
        password: 'hashedpassword456',
        prenom: 'Marie',
        nom: 'Martin',
        date_de_naissance: new Date('1992-08-20'),
        role: 'user'
      });
      await user2.save();
      console.log('Utilisateur 2 créé :', user2.prenom, user2.nom);
    } else {
      console.log('Utilisateur 2 déjà existant');
    }

    // ======================
    // 2. BAR
    // ======================
    console.log('\nTest Bar...');
    let bar = await Bar.findOne({ email: 'bar@example.com' });
    if (!bar) {
      bar = new Bar({
        nom: 'Le Gaming Spot',
        adresse: '123 Rue de la Victoire, 75009 Paris',
        email: 'bar@example.com',
        telephone: '0123456789',
        horaires: 'Lun-Dim: 14h-2h',
        description: 'Bar gaming avec salles équipées',
        proprietaire: user1._id
      });
      await bar.save();
      console.log('Bar créé :', bar.nom);
    } else {
      console.log('Bar déjà existant');
    }

    // ======================
    // 3. SALLE
    // ======================
    console.log('\nTest Salle...');
    let salle = await Salle.findOne({ Name: 'Salle Pro 1', bar: bar._id });
    if (!salle) {
      salle = new Salle({
        Name: 'Salle Pro 1',
        capacite_spectateur: 100,
        equipement: 'PC Gaming RTX 4090, Écrans 240Hz, Chaises DXRacer',
        disponible: true,
        nombre_joueur: 10,
        bar: bar._id,
        description: 'Salle professionnelle équipée pour les tournois'
      });
      await salle.save();
      console.log('Salle créée :', salle.Name);
    } else {
      console.log('Salle déjà existante');
    }

    // ======================
    // 4. JEU
    // ======================
    console.log('\nTest Jeu...');
    let jeu = await Jeu.findOne({ Name: 'Counter-Strike 2' });
    if (!jeu) {
      jeu = new Jeu({
        Name: 'Counter-Strike 2',
        Mode: '5v5 Competitive',
        Map: 'Dust II, Mirage, Inferno',
        plateforme: 'PC',
        min_joueur: 2,
        max_joueur: 10
      });
      await jeu.save();
      console.log('Jeu créé :', jeu.Name);
    } else {
      console.log('Jeu déjà existant');
    }

    // ======================
    // 5. ÉQUIPES
    // ======================
    console.log('\nTest Équipes...');
    let equipe1 = await Equipe.findOne({ Name: 'Team Alpha' });
    if (!equipe1) {
      equipe1 = new Equipe({
        Name: 'Team Alpha',
        logo: 'https://example.com/team-alpha.png',
        description: 'Équipe professionnelle de Counter-Strike',
        jeu_principal: jeu._id
      });
      await equipe1.save();
      console.log('Équipe 1 créée :', equipe1.Name);
    } else {
      console.log('Équipe 1 déjà existante');
    }

    let equipe2 = await Equipe.findOne({ Name: 'Team Beta' });
    if (!equipe2) {
      equipe2 = new Equipe({
        Name: 'Team Beta',
        logo: 'https://example.com/team-beta.png',
        description: 'Équipe compétitive CS2',
        jeu_principal: jeu._id
      });
      await equipe2.save();
      console.log('Équipe 2 créée :', equipe2.Name);
    } else {
      console.log('Équipe 2 déjà existante');
    }

    // ======================
    // 5bis. MEMBRES D'ÉQUIPES
    // ======================
    console.log('\nTest Membres d\'équipes...');

    //Membre 1 - Capitaine de Team Alpha
    let membre1 = await MembreTeam.findOne({ user: user1._id, equipe: equipe1._id });
    if (!membre1) {
      membre1 = new MembreTeam({
        role: 'capitaine',
        user: user1._id,
        equipe: equipe1._id,
        numero_maillot: 1,
        statut: 'actif'
      });
      await membre1.save();
      await membre1.populate(['user', 'equipe']);
      console.log('Membre 1 créé :', membre1.user.prenom, membre1.user.nom, '→', membre1.equipe.Name);
      console.log('   Rôle:', membre1.role, '| Numéro:', membre1.numero_maillot, '| Statut:', membre1.statut);
    } else {
      console.log('Membre 1 déjà existant');
    }

    // Membre 2 - Capitaine de Team Beta
    let membre2 = await MembreTeam.findOne({ user: user2._id, equipe: equipe2._id });
    if (!membre2) {
      membre2 = new MembreTeam({
        role: 'capitaine',
        user: user2._id,
        equipe: equipe2._id,
        numero_maillot: 10,
        statut: 'actif'
      });
      await membre2.save();
      await membre2.populate(['user', 'equipe']);
      console.log('Membre 2 créé :', membre2.user.prenom, membre2.user.nom, '→', membre2.equipe.Name);
      console.log('   Rôle:', membre2.role, '| Numéro:', membre2.numero_maillot, '| Statut:', membre2.statut);
    } else {
      console.log('Membre 2 déjà existant');
    }

    // ======================
    // 6. TOURNOI
    // ======================
    console.log('\nTest Tournoi...');
    let tournoi = await Tournoi.findOne({ Name: 'Tournoi CS2 2026' });
    if (!tournoi) {
      tournoi = new Tournoi({
        Name: 'Tournoi CS2 2026',
        description: 'Tournoi officiel Counter-Strike 2 avec cash prize de 10 000€',
        date_debut: new Date('2026-03-01'),
        date_fin: new Date('2026-03-03'),
        jeu: jeu._id,
        salle: salle._id,
        statut: 'à venir',
        prix_inscription: 50,
        nombre_equipes_max: 16
      });
      await tournoi.save();
      console.log('Tournoi créé :', tournoi.Name);
    } else {
      console.log('Tournoi déjà existant');
    }


    // ======================
    // 7. BILLET
    // ======================
    console.log('\nTest Billet...');
    let billet = await Billet.findOne({ 
      type: 'VIP', 
      user: user1._id, 
      salle: salle._id 
    });
    if (!billet) {
      billet = new Billet({
        type: 'VIP',
        prix: 150,
        quantite: 1,
        user: user1._id,
        salle: salle._id,
        tournoi: tournoi._id,
        statut: 'vendu',
        date_evenement: new Date('2026-03-01')
      });
      await billet.save();
      console.log('Billet créé - Type:', billet.type, '| Prix:', billet.prix, '€');
    } else {
      console.log('Billet déjà existant');
    }

    // ======================
    // 8. MATCH
    // ======================
    console.log('\nTest Match...');
    let match = await Match.findOne({ 
      tournoi: tournoi._id,
      participant1: equipe1._id,
      participant2: equipe2._id
    });
    if (!match) {
      match = new Match({
        date_debut: new Date('2026-03-01T14:00:00'),
        status: 'en_attente',
        tournoi: tournoi._id,
        participant1: equipe1._id,
        participant2: equipe2._id
      });
      await match.save();
      await match.populate(['tournoi', 'participant1', 'participant2']);
      console.log('Match créé :', match.participant1.Name, 'vs', match.participant2.Name);
      console.log('   Statut:', match.status, '| Date:', match.date_debut.toLocaleString());
    } else {
      console.log('Match déjà existant');
    }

    // ======================
    // 9. PARTIES
    // ======================
    console.log('\nTest Parties...');
    
    // Partie 1
    let partie1 = await Partie.findOne({ 
      match: match._id,
      map: 'Dust II'
    });
    if (!partie1) {
      partie1 = new Partie({
        score: '16-14',
        map: 'Dust II',
        duree: 45,
        date_debut: new Date('2026-03-01T14:00:00'),
        date_fin: new Date('2026-03-01T14:45:00'),
        match: match._id
      });
      await partie1.save();
      await partie1.populate('match');
      console.log('Partie 1 créée - Map:', partie1.map, '| Score:', partie1.score, '| Durée:', partie1.duree, 'min');
    } else {
      console.log('Partie 1 déjà existante');
    }

    // Partie 2
    let partie2 = await Partie.findOne({ 
      match: match._id,
      map: 'Mirage'
    });
    if (!partie2) {
      partie2 = new Partie({
        score: '16-12',
        map: 'Mirage',
        duree: 42,
        date_debut: new Date('2026-03-01T15:00:00'),
        date_fin: new Date('2026-03-01T15:42:00'),
        match: match._id
      });
      await partie2.save();
      await partie2.populate('match');
      console.log('Partie 2 créée - Map:', partie2.map, '| Score:', partie2.score, '| Durée:', partie2.duree, 'min');
    } else {
      console.log('Partie 2 déjà existante');
    }

    // Partie 3 (décisive)
    let partie3 = await Partie.findOne({ 
      match: match._id,
      map: 'Inferno'
    });
    if (!partie3) {
      partie3 = new Partie({
        score: '19-17',
        map: 'Inferno',
        duree: 52,
        date_debut: new Date('2026-03-01T16:00:00'),
        date_fin: new Date('2026-03-01T16:52:00'),
        match: match._id
      });
      await partie3.save();
      await partie3.populate('match');
      console.log('Partie 3 créée - Map:', partie3.map, '| Score:', partie3.score, '| Durée:', partie3.duree, 'min');
    } else {
      console.log('Partie 3 déjà existante');
    }

    // ======================
    // 10. INSCRIPTIONS
    // ======================
    console.log('\nTest Inscriptions...');
    
    // Inscription équipe 1
    let inscription1 = await Inscription.findOne({ 
      tournoi: tournoi._id,
      equipe: equipe1._id
    });
    if (!inscription1) {
      inscription1 = new Inscription({
        date_limite: new Date('2026-02-20'),
        statut: 'acceptee',
        classement: 1,
        tournoi: tournoi._id,
        equipe: equipe1._id,
        prix_paye: 50,
        date_inscription: new Date('2026-01-15'),
        commentaire: 'Équipe favorite pour le titre'
      });
      await inscription1.save();
      await inscription1.populate(['tournoi', 'equipe']);
      console.log('Inscription 1 créée :', inscription1.equipe.Name, '→', inscription1.tournoi.Name);
      console.log('   Statut:', inscription1.statut, '| Classement:', inscription1.classement);
    } else {
      console.log('Inscription 1 déjà existante');
    }

    // Inscription équipe 2
    let inscription2 = await Inscription.findOne({ 
      tournoi: tournoi._id,
      equipe: equipe2._id
    });
    if (!inscription2) {
      inscription2 = new Inscription({
        date_limite: new Date('2026-02-20'),
        statut: 'acceptee',
        classement: 2,
        tournoi: tournoi._id,
        equipe: equipe2._id,
        prix_paye: 50,
        date_inscription: new Date('2026-01-16'),
        commentaire: 'Équipe challenger avec de bons résultats'
      });
      await inscription2.save();
      await inscription2.populate(['tournoi', 'equipe']);
      console.log('Inscription 2 créée :', inscription2.equipe.Name, '→', inscription2.tournoi.Name);
      console.log('   Statut:', inscription2.statut, '| Classement:', inscription2.classement);
    } else {
      console.log('Inscription 2 déjà existante');
    }

    // ======================
    // 11. STREAMS
    // ======================
    console.log('\nTest Streams...');

    // Stream 1 pour partie 1
    let stream1 = await Stream.findOne({ 
      partie: partie1._id,
      plateforme: 'Twitch'
    });
    if (!stream1) {
      stream1 = new Stream({
        nom: 'Stream Principal - Team Alpha vs Team Beta',
        plateforme: 'Twitch',
        url: 'https://twitch.tv/esport_main',
        partie: partie1._id,
        statut: 'termine'
      });
      await stream1.save();
      await stream1.populate('partie');
      console.log('Stream 1 créé :', stream1.nom);
      console.log('   Plateforme:', stream1.plateforme, '| Statut:', stream1.statut);
    } else {
      console.log('Stream 1 déjà existant');
    }

    // Stream 2 pour partie 2
    let stream2 = await Stream.findOne({ 
      partie: partie2._id,
      plateforme: 'YouTube'
    });
    if (!stream2) {
      stream2 = new Stream({
        nom: 'Stream Secondaire - Caméra Joueurs',
        plateforme: 'YouTube',
        url: 'https://youtube.com/watch?v=abc123',
        partie: partie2._id,
        statut: 'termine'
      });
      await stream2.save();
      await stream2.populate('partie');
      console.log('Stream 2 créé :', stream2.nom);
      console.log('   Plateforme:', stream2.plateforme, '| Statut:', stream2.statut);
    } else {
      console.log('Stream 2 déjà existant');
    }

    // Stream 3 pour partie 3 (en direct)
    let stream3 = await Stream.findOne({ 
      partie: partie3._id,
      plateforme: 'Twitch'
    });
    if (!stream3) {
      stream3 = new Stream({
        nom: 'FINALE - Team Alpha vs Team Beta - Map Décisive',
        plateforme: 'Twitch',
        url: 'https://twitch.tv/esport_finals',
        partie: partie3._id,
        statut: 'en_direct'
      });
      await stream3.save();
      await stream3.populate('partie');
      console.log('Stream 3 créé :', stream3.nom);
      console.log('   Plateforme:', stream3.plateforme, '| Statut:', stream3.statut, 'LIVE');
    } else {
      console.log('Stream 3 déjà existant');
    }


  } catch (err) {
    console.error('\nErreur lors des tests :', err.message);
    console.error(err);
  }
}

module.exports = { testInsert };