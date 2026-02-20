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

    // Helper upsert to avoid duplicate key errors during test inserts
    async function upsert(model, query, doc) {
      const res = await model.findOneAndUpdate(
        query,
        { $setOnInsert: doc },
        { upsert: true, new: true, setDefaultsOnInsert: true, rawResult: true }
      );
      return { doc: res.value, created: !!(res.lastErrorObject && res.lastErrorObject.upserted) };
    }

    // Declare variables used across upserts
    let user1, user2, bar, bar2, salle, salle2, jeu, jeu2, equipe1, equipe2, equipe3;
    let membre1, membre2, tournoi, tournoi2, billet, billet2, match, match2;
    let partie1, partie2, partie3, inscription1, inscription2, stream1, stream2, stream3;

    // ======================
    // 1. UTILISATEURS
    // ======================
    console.log('Test Users...');
    {
      const res = await upsert(User, { email: 'test@example.com' }, {
        email: 'test@example.com',
        password: 'hashedpassword123',
        prenom: 'Jean',
        nom: 'Dupont',
        date_de_naissance: new Date('1990-05-15'),
        role: 'user'
      });
      user1 = res.doc;
      console.log(res.created ? 'Utilisateur 1 créé :' : 'Utilisateur 1 déjà existant :', user1.prenom, user1.nom);
    }

    {
      const res = await upsert(User, { email: 'player2@example.com' }, {
        email: 'player2@example.com',
        password: 'hashedpassword456',
        prenom: 'Marie',
        nom: 'Martin',
        date_de_naissance: new Date('1992-08-20'),
        role: 'user'
      });
      user2 = res.doc;
      console.log(res.created ? 'Utilisateur 2 créé :' : 'Utilisateur 2 déjà existant :', user2.prenom, user2.nom);
    }

    // ======================
    // 2. BAR
    // ======================
    console.log('\nTest Bar...');
    {
      const res = await upsert(Bar, { email: 'bar@example.com' }, {
        nom: 'Le Gaming Spot',
        adresse: '123 Rue de la Victoire, 75009 Paris',
        email: 'bar@example.com',
        telephone: '0123456789',
        horaires: 'Lun-Dim: 14h-2h',
        description: 'Bar gaming avec salles équipées',
        proprietaire: user1._id
      });
      bar = res.doc;
      console.log(res.created ? 'Bar créé :' : 'Bar déjà existant :', bar.nom);
    }

    // Bar 2
    {
      const res = await upsert(Bar, { email: 'bar2@example.com' }, {
        nom: 'LAN Café',
        adresse: '45 Rue des Jeux, 69003 Lyon',
        email: 'bar2@example.com',
        telephone: '0987654321',
        horaires: 'Mar-Dim: 12h-1h',
        description: 'Café dédié aux tournois locaux',
        proprietaire: user2._id
      });
      bar2 = res.doc;
      console.log(res.created ? 'Bar 2 créé :' : 'Bar 2 déjà existant :', bar2.nom);
    }

    // ======================
    // 3. SALLE
    // ======================
    console.log('\nTest Salle...');
    {
      const res = await upsert(Salle, { Name: 'Salle Pro 1', bar: bar._id }, {
        Name: 'Salle Pro 1',
        capacite_spectateur: 100,
        equipement: 'PC Gaming RTX 4090, Écrans 240Hz, Chaises DXRacer',
        disponible: true,
        nombre_joueur: 10,
        bar: bar._id,
        description: 'Salle professionnelle équipée pour les tournois'
      });
      salle = res.doc;
      console.log(res.created ? 'Salle créée :' : 'Salle déjà existante :', salle.Name);
    }

    // Salle 2
    {
      const res = await upsert(Salle, { Name: 'Salle Local 2', bar: bar2._id }, {
        Name: 'Salle Local 2',
        capacite_spectateur: 40,
        equipement: 'PC Gaming RTX 3080, Écrans 144Hz',
        disponible: true,
        nombre_joueur: 5,
        bar: bar2._id,
        description: 'Salle cosy pour petites compétitions'
      });
      salle2 = res.doc;
      console.log(res.created ? 'Salle 2 créée :' : 'Salle 2 déjà existante :', salle2.Name);
    }

    // ======================
    // 4. JEU
    // ======================
    console.log('\nTest Jeu...');
      {
        const res = await upsert(Jeu, { Name: 'Counter-Strike 2' }, {
          Name: 'Counter-Strike 2',
          Mode: '5v5 Competitive',
          Map: 'Dust II, Mirage, Inferno',
          plateforme: 'PC',
          min_joueur: 2,
          max_joueur: 10,
          image: 'https://th.bing.com/th/id/OIP.rWzDpI0XfaOdEU88H2AOmQHaEK?o=7&cb=defcache2&rm=3&defcache=1&rs=1&pid=ImgDetMain&o=7&rm=3'
        });
        jeu = res.doc;
        console.log(res.created ? 'Jeu créé :' : 'Jeu déjà existant :', jeu.Name);
      }

      // Jeu 2
      {
        const res = await upsert(Jeu, { Name: 'Valorant' }, {
          Name: 'Valorant',
          Mode: '5v5',
          Map: 'Ascent, Bind, Haven',
          plateforme: 'PC',
          min_joueur: 2,
          max_joueur: 10,
          image: 'https://tse1.mm.bing.net/th/id/OIP.QYvwdFIinVUthaFNj4njkwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3'
        });
        jeu2 = res.doc;
        console.log(res.created ? 'Jeu 2 créé :' : 'Jeu 2 déjà existant :', jeu2.Name);
      }

    // Jeu 2 (upserted above)

    // ======================
    // 5. ÉQUIPES
    // ======================
    console.log('\nTest Équipes...');
      {
        const res = await upsert(Equipe, { Name: 'Team Alpha' }, {
          Name: 'Team Alpha',
          logo: 'https://old.runitback.gg/wp-content/uploads/2022/11/Vitality-Valorant.webp',
          description: 'Équipe professionnelle de Counter-Strike',
          jeu_principal: jeu._id
        });
        equipe1 = res.doc;
        console.log(res.created ? 'Équipe 1 créée :' : 'Équipe 1 déjà existante :', equipe1.Name);
      }

      {
        const res = await upsert(Equipe, { Name: 'Team Beta' }, {
          Name: 'Team Beta',
          logo: 'https://esportbet.com/wp-content/smush-webp/2025/06/Gentle-Mates-1024x585.jpeg.webp',
          description: 'Équipe compétitive CS2',
          jeu_principal: jeu._id
        });
        equipe2 = res.doc;
        console.log(res.created ? 'Équipe 2 créée :' : 'Équipe 2 déjà existante :', equipe2.Name);
      }

    // Équipe 3
      {
        const res = await upsert(Equipe, { Name: 'Team Gamma' }, {
          Name: 'Team Gamma',
          logo: 'https://mir-s3-cdn-cf.behance.net/projects/404/d5e7b1138018399.Y3JvcCwxMDg4LDg1MSwwLDExNQ.png',
          description: 'Nouvelle équipe montante',
          jeu_principal: jeu2 ? jeu2._id : jeu._id
        });
        equipe3 = res.doc;
        console.log(res.created ? 'Équipe 3 créée :' : 'Équipe 3 déjà existante :', equipe3.Name);
      }

    // ======================
    // 5bis. MEMBRES D'ÉQUIPES
    // ======================
    console.log('\nTest Membres d\'équipes...');

    //Membre 1 - Capitaine de Team Alpha
    membre1 = await MembreTeam.findOne({ user: user1._id, equipe: equipe1._id });
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
    membre2 = await MembreTeam.findOne({ user: user2._id, equipe: equipe2._id });
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
    tournoi = await Tournoi.findOne({ Name: 'Tournoi CS2 2026' });
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
    // Tournoi 2
    tournoi2 = await Tournoi.findOne({ Name: 'Tournoi Valorant 2026' });
    if (!tournoi2) {
      tournoi2 = new Tournoi({
        Name: 'Tournoi Valorant 2026',
        description: 'Tournoi Valorant régional',
        date_debut: new Date('2026-04-10'),
        date_fin: new Date('2026-04-12'),
        jeu: jeu2 ? jeu2._id : jeu._id,
        salle: salle2 ? salle2._id : salle._id,
        statut: 'à venir',
        prix_inscription: 30,
        nombre_equipes_max: 8
      });
      await tournoi2.save();
      console.log('Tournoi 2 créé :', tournoi2.Name);
    } else {
      console.log('Tournoi 2 déjà existant');
    }

    // Tournoi 3 - Annulé
    let tournoi3 = await Tournoi.findOne({ Name: 'Tournoi Annulé 2026' });
    if (!tournoi3) {
      tournoi3 = new Tournoi({
        Name: 'Tournoi Annulé 2026',
        description: 'Événement annulé pour raisons logistiques',
        date_debut: new Date('2026-02-01'),
        date_fin: new Date('2026-02-02'),
        jeu: jeu._id,
        salle: salle._id,
        statut: 'annulé',
        prix_inscription: 20,
        nombre_equipes_max: 8
      });
      await tournoi3.save();
      console.log('Tournoi 3 (annulé) créé :', tournoi3.Name);
    } else {
      console.log('Tournoi 3 déjà existant');
    }

    // Tournoi 4 - Terminé (avec matchs et parties déjà joués)
    let tournoi4 = await Tournoi.findOne({ Name: 'Tournoi Terminé 2025' });
    if (!tournoi4) {
      tournoi4 = new Tournoi({
        Name: 'Tournoi Terminé 2025',
        description: 'Edition passée avec résultats finalisés',
        date_debut: new Date('2025-11-10'),
        date_fin: new Date('2025-11-12'),
        jeu: jeu._id,
        salle: salle._id,
        statut: 'terminé',
        prix_inscription: 25,
        nombre_equipes_max: 8
      });
      await tournoi4.save();
      console.log('Tournoi 4 (terminé) créé :', tournoi4.Name);
    } else {
      console.log('Tournoi 4 déjà existant');
    }


    // ======================
    // 7. BILLET
    // ======================
    console.log('\nTest Billet...');
    billet = await Billet.findOne({ 
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

    // Billet 2
    billet2 = await Billet.findOne({ 
      type: 'Standard', 
      user: user2._id, 
      salle: salle._id 
    });
    if (!billet2) {
      billet2 = new Billet({
        type: 'Standard',
        prix: 40,
        quantite: 2,
        user: user2._id,
        salle: salle._id,
        tournoi: tournoi._id,
        statut: 'disponible',
        date_evenement: new Date('2026-03-01')
      });
      await billet2.save();
      console.log('Billet 2 créé - Type:', billet2.type, '| Prix:', billet2.prix, '€');
    } else {
      console.log('Billet 2 déjà existant');
    }

    // ======================
    // 8. MATCH
    // ======================
    console.log('\nTest Match...');
    match = await Match.findOne({ 
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

    // Match 2 (inversé)
    match2 = await Match.findOne({ 
      tournoi: tournoi._id,
      participant1: equipe2._id,
      participant2: equipe3._id
    });
    if (!match2) {
      match2 = new Match({
        date_debut: new Date('2026-03-02T16:00:00'),
        status: 'en_attente',
        tournoi: tournoi._id,
        participant1: equipe2._id,
        participant2: equipe3._id
      });
      await match2.save();
      await match2.populate(['tournoi', 'participant1', 'participant2']);
      console.log('Match 2 créé :', match2.participant1.Name, 'vs', match2.participant2.Name);
      console.log('   Statut:', match2.status, '| Date:', match2.date_debut.toLocaleString());
    } else {
      console.log('Match 2 déjà existant');
    }

    // ======================
    // 8bis. MATCHES pour autres tournois
    // ======================
    // Matches pour tournoi2 (Valorant)
    let matchV1 = await Match.findOne({ tournoi: tournoi2._id, participant1: equipe1._id, participant2: equipe3._id });
    if (!matchV1) {
      matchV1 = new Match({
        date_debut: new Date('2026-04-10T10:00:00'),
        status: 'en_attente',
        tournoi: tournoi2._id,
        participant1: equipe1._id,
        participant2: equipe3._id
      });
      await matchV1.save();
      console.log('Match Valorant créé :', equipe1.Name, 'vs', equipe3.Name);
    }

    // Matches pour tournoi4 (terminé) - résultats enregistrés
    let matchT1 = await Match.findOne({ tournoi: tournoi4._id, participant1: equipe1._id, participant2: equipe2._id });
    if (!matchT1) {
      matchT1 = new Match({
        date_debut: new Date('2025-11-10T14:00:00'),
        status: 'termine',
        tournoi: tournoi4._id,
        participant1: equipe1._id,
        participant2: equipe2._id
      });
      await matchT1.save();
      console.log('Match (terminé) créé :', equipe1.Name, 'vs', equipe2.Name);

      // Ajouter parties pour matchT1
      const pA = new Partie({
        score: '16-8',
        map: 'Dust II',
        duree: 35,
        date_debut: new Date('2025-11-10T14:00:00'),
        date_fin: new Date('2025-11-10T14:35:00'),
        match: matchT1._id
      });
      await pA.save();

      const pB = new Partie({
        score: '12-16',
        map: 'Inferno',
        duree: 40,
        date_debut: new Date('2025-11-10T15:00:00'),
        date_fin: new Date('2025-11-10T15:40:00'),
        match: matchT1._id
      });
      await pB.save();

      console.log('Parties pour match terminé ajoutées');
    }

    // Aucun match pour tournoi3 (annulé)

    // ======================
    // 9. PARTIES
    // ======================
    console.log('\nTest Parties...');
    
    // Partie 1
    partie1 = await Partie.findOne({ 
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
    partie2 = await Partie.findOne({ 
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
    partie3 = await Partie.findOne({ 
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
    inscription1 = await Inscription.findOne({ 
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
    inscription2 = await Inscription.findOne({ 
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

    // Inscription équipe 3 sur tournoi2 (Valorant)
    let inscription3 = await Inscription.findOne({ tournoi: tournoi2._id, equipe: equipe3._id });
    if (!inscription3) {
      inscription3 = new Inscription({
        date_limite: new Date('2026-03-30'),
        statut: 'acceptee',
        classement: 3,
        tournoi: tournoi2._id,
        equipe: equipe3._id,
        prix_paye: 30,
        date_inscription: new Date('2026-02-01'),
        commentaire: 'Inscription pour Valorant'
      });
      await inscription3.save();
      await inscription3.populate(['tournoi', 'equipe']);
      console.log('Inscription 3 créée :', inscription3.equipe.Name, '→', inscription3.tournoi.Name);
    } else {
      console.log('Inscription 3 déjà existante');
    }

    // Inscriptions pour tournoi4 (terminé)
    let inscrT1 = await Inscription.findOne({ tournoi: tournoi4._id, equipe: equipe1._id });
    if (!inscrT1) {
      inscrT1 = new Inscription({
        date_limite: new Date('2025-10-01'),
        statut: 'acceptee',
        classement: 1,
        tournoi: tournoi4._id,
        equipe: equipe1._id,
        prix_paye: 25,
        date_inscription: new Date('2025-09-10'),
        commentaire: 'Champion 2025'
      });
      await inscrT1.save();
      console.log('Inscription tournoi4 créée pour', equipe1.Name);
    }

    let inscrT2 = await Inscription.findOne({ tournoi: tournoi4._id, equipe: equipe2._id });
    if (!inscrT2) {
      inscrT2 = new Inscription({
        date_limite: new Date('2025-10-01'),
        statut: 'acceptee',
        classement: 2,
        tournoi: tournoi4._id,
        equipe: equipe2._id,
        prix_paye: 25,
        date_inscription: new Date('2025-09-12'),
        commentaire: 'Finaliste'
      });
      await inscrT2.save();
      console.log('Inscription tournoi4 créée pour', equipe2.Name);
    }

    // ======================
    // 11. STREAMS
    // ======================
    console.log('\nTest Streams...');

    // Stream 1 pour partie 1
    stream1 = await Stream.findOne({ 
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
    stream2 = await Stream.findOne({ 
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
    stream3 = await Stream.findOne({ 
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