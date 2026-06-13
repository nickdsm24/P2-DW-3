import { Router } from "express";

import {
  criarReserva,
  listarReservas,
  buscarReservaPorId,
  atualizarReserva,
  cancelarReserva,
  deletarReserva,
} from "../controllers/reserva.controller";

const routerReserva = Router();

routerReserva.post("/reservas", criarReserva);
routerReserva.get("/reservas", listarReservas);
routerReserva.get("/reservas/:id", buscarReservaPorId);
routerReserva.put("/reservas/:id", atualizarReserva);
routerReserva.patch("/reservas/:id/cancelar", cancelarReserva);
routerReserva.delete("/reservas/:id", deletarReserva);

export default routerReserva;