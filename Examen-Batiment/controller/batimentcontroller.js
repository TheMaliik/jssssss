const Batiment = require("../model/batiment");
const Niveau = require("../model/niveau");

async function addbatiment(req, res, next) {
  try {
    const batiment = new Batiment({
      nom: req.body.nom,
      description: req.body.description,
      adress: req.body.adress,
      nbr_niveau: 0,
    });

    await batiment.save();

    // Récupérer tous les bâtiments
    const allBatiments = await Batiment.find();

    // Retourner tous les bâtiments
    res.status(200).json(allBatiments);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de l'ajout du bâtiment");
  }
}


async function getallbatiemnt(req, res, next) {
  try {
    const data = await Batiment.find();
    //return data;
    res.json(data);
  } catch (err) {
    console.log(err);
  }
}


async function getbyidbatiment(req, res, next) {
  try {
    const data = await Batiment.findById(req.params.id);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
}



async function deletebyidBatiment(req, res, next) {
  try {
    const data = await Batiment.findByIdAndDelete(req.params.id);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
}



async function addNiveau(req, res, next) {
  try {
    const { id_batiment, nom, nbr_chambre } = req.body;

    
    const batiment = await Batiment.findById(id_batiment);
    if (!batiment) {
      return res.status(404).json({ message: "Bâtiment non trouvé" });
    }

   
    const niveau = new Niveau({
      nom,
      nbr_chambre,
      etat_construction: false, // Initialisé à false
      id_batiment,
    });

    // Sauvegarder le niveau
    await niveau.save();

    // Mettre à jour le nombre de niveaux dans le bâtiment
    batiment.nbr_niveau += 1;
    await batiment.save();

    res.status(201).json({
      message: "Niveau ajouté avec succès",
      niveau,
      batiment
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l'ajout du niveau" });
  }
}










async function getallNiveau(req, res, next) {
  try {
    const data = await Niveau.find();
    //return data;
    res.json(data);
  } catch (err) {
    console.log(err);
  }
}





async function deletebyidniveau(req, res, next) {
  try {
    const data = await Niveau.findByIdAndDelete(req.params.id);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
}





async function AddBatiAndNiveaux (req, res)  {
  try {
    const { nom, description, adresse, niveaux } = req.body;

    // Étape 1 : Ajouter le bâtiment
    const batiment = new Batiment({
      nom,
      description,
      adresse,
      nbr_niveau: niveaux.length, // Nombre de niveaux
    });
    const savedBatiment = await batiment.save();

    // Étape 2 : Ajouter les niveaux associés
    const niveauxToSave = niveaux.map((niveau) => ({
      ...niveau,
      id_batiment: savedBatiment._id.toString(), // Lien avec le bâtiment
    }));

    await Niveau.insertMany(niveauxToSave);

    res.status(201).json({
      message: 'Bâtiment et niveaux ajoutés avec succès',
      batiment: savedBatiment,
      niveaux: niveauxToSave,
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout :', error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
}











async function construction(req, res, next) {
  try {
    

    // Récupérer le niveau par son ID
    const niveau = await Niveau.findById(req.params.id);
    if (!niveau) {
      return res.status(404).json({ message: "Niveau non trouvé" });
    }

    // Vérifier si l'état de construction est déjà à true
    if (niveau.etat_construction) {
      return res.status(400).json({ message: "Le niveau est déjà en construction" });
    }

    // Mettre à jour l'état de construction
    niveau.etat_construction = true;
    await niveau.save();

    // Récupérer le bâtiment associé
    const batiment = await Batiment.findById(niveau.id_batiment);
    if (!batiment) {
      return res.status(404).json({ message: "Bâtiment non trouvé" });
    }

    // Incrémenter le nombre de niveaux dans le bâtiment
    batiment.nbr_niveau += 1;
    await batiment.save();

    res.status(200).json({
      message: "Construction mise à jour avec succès",
      niveau,
      batiment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la construction" });
  }
}





const updateConstruction = async (id) => {
  // Récupérer le niveau par son ID
  const niveau = await Niveau.findById(id);
  if (!niveau) {
    throw new Error("Niveau non trouvé");
  }

  // Vérifier si l'état de construction est déjà à true
  if (niveau.etat_construction) {
    throw new Error("Le niveau est déjà en construction");
  }

  // Mettre à jour l'état de construction
  niveau.etat_construction = true;
  await niveau.save();

  // Récupérer le bâtiment associé
  const batiment = await Batiment.findById(niveau.id_batiment);
  if (!batiment) {
    throw new Error("Bâtiment non trouvé");
  }

  // Incrémenter le nombre de niveaux dans le bâtiment
  batiment.nbr_niveau += 1;
  await batiment.save();

  return { niveau, batiment };
};



module.exports = {
  addbatiment,
  getallbatiemnt,
  getbyidbatiment,
  deletebyidBatiment,
  construction,
  getallNiveau,
  deletebyidniveau,
  addNiveau,
  updateConstruction,
  AddBatiAndNiveaux
};
