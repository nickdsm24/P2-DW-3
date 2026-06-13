import { Request, Response } from "express";
import { Reserva, IReserva } from "../models/reservaSchema";

function calcularStatusReserva(
  horaInicio: Date,
  horaFim: Date,
  statusAtual: string
) {
  if (statusAtual === "Cancelado") {
    return "Cancelado";
  }

  const agora = new Date();

  if (agora < horaInicio) {
    return "Reservado";
  }

  if (agora >= horaInicio && agora <= horaFim) {
    return "Ocupado";
  }

  return "Finalizado";
}

async function atualizarStatusAutomatico(reserva: any) {
  const novoStatus = calcularStatusReserva(
    reserva.horaInicio,
    reserva.horaFim,
    reserva.status
  );

  if (reserva.status !== novoStatus) {
    reserva.status = novoStatus;
    await reserva.save();
  }

  return reserva;
}

export async function criarReserva(req: Request, res: Response) {
  try {
    const reserva = await Reserva.create(req.body);

    console.log(`Reserva criada para cliente: ${reserva.nomeCliente}`);

    return res.status(201).json({
      message: "Reserva criada com sucesso.",
      reserva,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

export async function listarReservas(req: Request, res: Response) {
  try {
    const { cliente, mesa, status, data } = req.query;

    const filtro: any = {};

    if (cliente) {
      filtro.nomeCliente = {
        $regex: cliente,
        $options: "i",
      };
    }

    if (mesa) {
      filtro.mesa = mesa;
    }

    if (status) {
      filtro.status = status;
    }

    if (data) {
      const dataInicio = new Date(`${data}T00:00:00`);
      const dataFim = new Date(`${data}T23:59:59`);

      filtro.horaInicio = {
        $gte: dataInicio,
        $lte: dataFim,
      };
    }

    const reservas = await Reserva.find(filtro)
      .populate("mesa")
      .sort({ horaInicio: 1 });

    const reservasAtualizadas = await Promise.all(
      reservas.map((reserva: IReserva) => atualizarStatusAutomatico(reserva))
    );

    return res.status(200).json({
      message: "Reservas listadas com sucesso.",
      reservas: reservasAtualizadas,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function buscarReservaPorId(req: Request, res: Response) {
  try {
    const reserva = await Reserva.findById(req.params.id).populate("mesa");

    if (!reserva) {
      return res.status(404).json({
        message: "Reserva não encontrada.",
      });
    }

    const reservaAtualizada = await atualizarStatusAutomatico(reserva);

    return res.status(200).json({
      message: "Reserva encontrada com sucesso.",
      reserva: reservaAtualizada,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function atualizarReserva(req: Request, res: Response) {
  try {
    const reserva = await Reserva.findById(req.params.id);

    if (!reserva) {
      return res.status(404).json({
        message: "Reserva não encontrada.",
      });
    }

    reserva.nomeCliente = req.body.nomeCliente ?? reserva.nomeCliente;
    reserva.telCliente = req.body.telCliente ?? reserva.telCliente;
    reserva.mesa = req.body.mesa ?? reserva.mesa;
    reserva.quantPessoa = req.body.quantPessoa ?? reserva.quantPessoa;
    reserva.horaInicio = req.body.horaInicio ?? reserva.horaInicio;
    reserva.duracao = req.body.duracao ?? reserva.duracao;
    reserva.obs = req.body.obs ?? reserva.obs;

    await reserva.save();

    console.log(`Reserva atualizada: ${reserva._id}`);

    return res.status(200).json({
      message: "Reserva atualizada com sucesso.",
      reserva,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

export async function cancelarReserva(req: Request, res: Response) {
  try {
    const reserva = await Reserva.findById(req.params.id);

    if (!reserva) {
      return res.status(404).json({
        message: "Reserva não encontrada.",
      });
    }

    reserva.status = "Cancelado" as any;

    await reserva.save();

    console.log(`Reserva cancelada: ${reserva._id}`);

    return res.status(200).json({
      message: "Reserva cancelada com sucesso.",
      reserva,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

export async function deletarReserva(req: Request, res: Response) {
  try {
    const reserva = await Reserva.findByIdAndDelete(req.params.id);

    if (!reserva) {
      return res.status(404).json({
        message: "Reserva não encontrada.",
      });
    }

    console.log(`Reserva removida: ${reserva._id}`);

    return res.status(200).json({
      message: "Reserva removida com sucesso.",
      reserva,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}