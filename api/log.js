// api/log.js
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://bouguerra0abbes:graduate*Flutter@urbages-cluster.mongodb.net/?retryWrites=true&w=majority";
const dbName = "urbages_db";

let client;
let db;

const connectToDatabase = async () => {
  if (client && db) return { client, db }; // Si déjà connecté, on réutilise la connexion
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  db = client.db(dbName);
  return { client, db };
};

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    const log = req.body;
    if (!log || !log.action || !log.email) {
      return res.status(400).json({ message: "Champs requis manquants" });
    }

    const { db } = await connectToDatabase(); // Connexion à la DB
    const collection = db.collection("logs");

    await collection.insertOne(log);

    res.status(200).json({ message: "Log inséré avec succès" });
  } catch (error) {
    console.error("Erreur API log:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
