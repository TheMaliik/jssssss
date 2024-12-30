const http = require("http");
const express = require("express");
const mongo = require("mongoose");
const bodyParser = require("body-parser");
const mongoconnect = require("./config/dbconnection.json");
const Niveau = require("./model/niveau");
const Batiment = require("./model/batiment");


const path = require("path");
const {
  getallNiveau,
  construction,
  calculBatiemnt,
  updateConstruction
} = require("./controller/batimentcontroller");
const { add } = require("./controller/chatcontroller");
const {
  addpartiesocket,
  affichesocket,
} = require("./controller/joueurcontroller");
mongo
  .connect(mongoconnect.url, {

  })
  .then(() => console.log("mongo connected"))
  .catch((err) => console.log(err));

const classroomrouter = require("./routes/classroom");
const joueurrouter = require("./routes/joueur");
const batimentrouter = require("./routes/batiment");
var app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/classrom", classroomrouter);
app.use("/joueur", joueurrouter);
app.use("/batiment", batimentrouter);

const server = http.createServer(app);



const io = require("socket.io")(server);
io.on("connection", async (socket) => {
  console.log("user is connected");
  socket.emit("msg", "user is connected");


  
  
// New function
// Événement pour envoyer les niveaux non bâtis
  socket.on('getNonBuiltLevels', async () => {
    try {
      const nonBuiltLevels = await Niveau.find({ etat_construction: false });
      socket.emit('nonBuiltLevels', nonBuiltLevels);
    } catch (error) {
      console.error(error);
      socket.emit('error', 'Erreur lors de la récupération des niveaux.');
    }
  });




// Construction


socket.on('constructLevel', async ({ id }) => {
  try {
    const { niveau, batiment } = await updateConstruction(id);

    // Renvoyer la liste mise à jour des niveaux non bâtis
    const nonBuiltLevels = await Niveau.find({ etat_construction: false });
    socket.emit('nonBuiltLevels', nonBuiltLevels);

    // Confirmer la mise à jour
    socket.emit('levelConstructed', {
      message: 'Niveau marqué comme construit avec succès.',
      niveau,
      batiment,
    });
  } catch (err) {
    console.error(err.message);
    socket.emit('error', err.message || "Erreur lors de la mise à jour de la construction.");
  }
});



// Sommmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmme

// Écouter l'événement "calculerSomme" envoyé par le client
socket.on('calculerSomme', async () => {
  try {
    // Filtrer les bâtiments selon les critères : niveaux > 5 et adresse = Tunis
    const batiments = await Batiment.find({ nbr_niveau: { $gt: 5 }, adress: 'Tunis' });

    // Calculer la somme des niveaux
    const somme = batiments.reduce((total, batiment) => total + batiment.nbr_niveau, 0);

    // Envoyer la somme au client
    socket.emit('sommeResultat', somme);
  } catch (error) {
    console.error('Erreur lors du calcul :', error);
    socket.emit('erreur', 'Une erreur s\'est produite.');
  }
});




// Calculer nbre 
// Écouter l'événement "calculerNombre" envoyé par le client
socket.on('calculerNombre', async () => {
  try {
    // Filtrer les bâtiments selon les critères : niveaux > 5 et adresse = Tunis
    const batiments = await Batiment.find({ nbr_niveau: { $gt: 5 }, adress: 'Tunis' });

    // Obtenir le nombre de bâtiments
    const nombreBatiments = batiments.length;

    // Envoyer le nombre de bâtiments au client
    socket.emit('nombreResultat', nombreBatiments);
  } catch (error) {
    console.error('Erreur lors du calcul :', error);
    socket.emit('erreur', 'Une erreur s\'est produite.');
  }
});









  socket.on("aff", async (data) => {
    const r = await affichesocket(data);
    console.log("jjjjjj", JSON.stringify(r));
    io.emit("aff", r);
  });

  socket.on("calcul", async (data) => {
    const c = await calculBatiemnt();
    console.log("jjjjjj", "la somme des niveaux est :" + JSON.stringify(c));
    io.emit("msg", "la somme des niveaux est :" + JSON.stringify(c));
  });

  socket.on("typing", (data) => {
    io.emit("typing", data + "is typing");
  });

  socket.on("msg", (data) => {
    add(data.object);
    io.emit("msg", data.name + ":" + data.object);
  });

  socket.on("disconnect", () => {
    console.log("user disconnect");
    io.emit("msg", "user disconnect");
  });
});
server.listen(3000, console.log("server run"));
module.exports = app;
