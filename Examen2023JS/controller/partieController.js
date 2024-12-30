const Joueur = require("../models/joueur");
const Partie = require("../models/partie");
const mongoose = require('mongoose');


async function add(req, res) {
  try {
    console.log(req.body);
    const user = new Joueur({
      pseudo: req.body.pseudo,
      sante: 100,
      score: 0,
    });
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
}



async function showjoueur(req, res) {
  try {
    const user = await Joueur.find();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
}



async function showByid(req, res) {
  try {
    const user = await Joueur.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
}

async function deletejoueur(req, res) {
  try {
    await Joueur.findByIdAndDelete(req.params.id);
    res.status(200).send("deleted");
  } catch (err) {
    console.log(err);
  }
}


async function attaque(req, res) {
  try {
    const attaquant = await Joueur.findById(req.params.id1);
    const victime = await Joueur.findById(req.params.id2);
    const j1 = (attaquant.score += 10);
    const j2 = (victime.sante -= 20);
    const joueur1 = await Joueur.findByIdAndUpdate(
      req.params.id1,
      { score: j1 },
      {
        new: true,
      }
    );
    const joueur2 = await Joueur.findByIdAndUpdate(
      req.params.id2,
      { sante: j2 },
      {
        new: true,
      }
    );

    res.send(joueur1 + "    " + joueur2);
  } catch (err) {
    console.log(err);
  }
}




async function newPartie(req, res) {
  try {
    console.log(req.body);
    const newpartie = new Partie({
      nom: req.body.nom,
      joueur_1: req.params.id1,
      joueur_2: req.params.id2,
      etat: "en cours",
    });
    await newpartie.save();
    res.status(200).json(newpartie);
  } catch (err) {
    console.log(err);
  }
}







async function newPartiesocket(data) {
  try {
    console.log("Données reçues : ", data); // Log pour voir les données reçues
    
    // Vérification des IDs
    if (!mongoose.Types.ObjectId.isValid(data.id1) || !mongoose.Types.ObjectId.isValid(data.id2)) {
      throw new Error('Un ou les deux identifiants sont invalides');
    }

    // Recherche des joueurs
    const joueur1 = await Joueur.findById(data.id1);
    const joueur2 = await Joueur.findById(data.id2);

    if (!joueur1 || !joueur2) {
      throw new Error('Un ou les deux joueurs n\'existent pas');
    }

    console.log("Joueur1 :", joueur1); // Log pour vérifier les données du joueur1
    console.log("Joueur2 :", joueur2); // Log pour vérifier les données du joueur2

    // Création d'une nouvelle partie
    const nouvellePartie = new Partie({
      nom: data.nompartie || "Nouvelle Partie",
      joueur_1: data.id1,
      joueur_2: data.id2,
      etat: "en cours", // Exemple d'état initial
    });

    await nouvellePartie.save(); // Sauvegarde dans la base de données
    console.log("Nouvelle partie créée :", nouvellePartie);

    // Émission via Socket.io
    socket.emit('aff', {
      partie: {
        nom: nouvellePartie.nom,
        joueur_1: joueur1,
        joueur_2: joueur2,
        etat: nouvellePartie.etat,
      },
    });

    console.log("Données envoyées via Socket.io.");
    
  } catch (err) {
    console.error("Erreur lors de la création de la partie :", err.message);
  }
}






async function affichersocket(data) {
  try {
    if (!mongoose.Types.ObjectId.isValid(data.id1) || !mongoose.Types.ObjectId.isValid(data.id2)) {
      throw new Error('Un ou les deux identifiants sont invalides');
    }

    const joueur1 = await Joueur.findById(data.id1);
    const joueur2 = await Joueur.findById(data.id2);

    if (!joueur1 || !joueur2) {
      throw new Error('Un ou les deux joueurs n\'existent pas');
    }

    return { j1: joueur1, j2: joueur2 };
  } catch (err) {
    console.error('Erreur lors de la récupération des joueurs:', err.message);
    return { error: 'Erreur lors de la récupération des joueurs', message: err.message };
  }
}





async function newPartiePseudo(req, res) {
  try {
   
  
    const joueur1 = await Joueur.findById(req.params.id1);
    const joueur2 = await Joueur.findById(req.params.id2);
  
    
    if (!joueur1 || !joueur2) {
      return res.status(404).json({ error: "Un ou les deux joueurs n'ont pas été trouvés" });
    }
  
    const newpartie = new Partie({
      nom: req.body.nom,
      joueur_1: joueur1.pseudo, // Utilisation du pseudo du joueur 1
      joueur_2: joueur2.pseudo, // Utilisation du pseudo du joueur 2
      etat: "en cours",
    });

    await newpartie.save();
    res.status(200).json(newpartie);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Erreur lors de la création de la partie' });
  }
}



async function showpartie(req, res) {
  try {
    const partie = await Partie.find();
    res.status(200).json(partie);
  } catch (err) {
    console.log(err);
  }
}


module.exports = {
  add,
  showjoueur,
  showByid,
  deletejoueur,
  attaque,
  newPartie,
  newPartiesocket,
  affichersocket,
  newPartiePseudo,
  showpartie
};
