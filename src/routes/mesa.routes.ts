import { Router } from "express";

import {
  criarMesa,
  listarMesas,
  buscarMesaPorId,
  atualizarMesa,
  deletarMesa,
} from "../controllers/mesa.controller";

const routerMesa = Router();

routerMesa.post("/mesas", criarMesa);
routerMesa.get("/mesas", listarMesas);
routerMesa.get("/mesas/:id", buscarMesaPorId);
routerMesa.put("/mesas/:id", atualizarMesa);
routerMesa.delete("/mesas/:id", deletarMesa);

export default routerMesa;