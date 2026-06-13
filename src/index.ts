import express from "express";
import mongoose from "mongoose";

import mesaRoutes from "./routes/mesa.routes";
import reservaRoutes from "./routes/reserva.routes";

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use(mesaRoutes);
app.use(reservaRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/reserva")
  .then(() => {
    console.log("Conectado ao MongoDB");

    app.listen(3000, () => {
      console.log("Servidor rodando em http://localhost:3000");
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB:", error);
  });