// api/log.js
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://bouguerra0abbes:graduate*Flutter@urbages-cluster.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const dbName = "urbages_logs";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    const log = req.body;
    if (!log || !log.action || !log.email) {
      return res.status(400).json({ message: "Champs requis manquants" });
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("logs");

    await collection.insertOne(log);

    res.status(200).json({ message: "Log inséré avec succès" });
  } catch (error) {
    console.error("Erreur API log:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
