import 'dotenv/config';
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://mongo_user:u2DPwlF7qDXj8MSv@clusteruniversidad.xbvv7c0.mongodb.net/?retryWrites=true&w=majority&appName=ClusterUniversidad";

try {
  await mongoose.connect(uri);
  console.log("✅ Conectado a MongoDB Atlas");
} catch (err) {
  console.error("❌ Error de conexión:", err.message);
}

const capturaSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const Captura = mongoose.model("Captura", capturaSchema);

// 📥 Guardar o actualizar datos por userAgent
app.post("/api/capturas", async (req, res) => {
  try {
    const { userAgent, ubicacion, ...rest } = req.body;
    if (!userAgent || !ubicacion) {
      return res.status(400).json({ error: "Faltan campos requeridos: userAgent o ubicacion" });
    }

    // Excluye 'ubicacion' de $setOnInsert para evitar conflicto
    const newCaptura = await Captura.create({
      userAgent,
      ubicacion,
      ...rest
    });

    res.json({ success: true, id: updated._id, updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📤 Listar datos
app.get("/api/capturas", async (req, res) => {
  const datos = await Captura.find().sort({ createdAt: -1 });
  res.json(datos);
});

// 🚀 Puerto dinámico para Render
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Servidor en http://localhost:${PORT}`));