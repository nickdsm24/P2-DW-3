import { Request, Response } from "express";
import { Mesa } from "../models/mesaSchema";

export async function criarMesa(req: Request, res: Response) {
  try {
    const mesa = await Mesa.create(req.body);

    console.log(`Mesa criada: ${mesa.numMesa}`);

    return res.status(201).json({
      message: "Mesa criada com sucesso.",
      mesa,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

export async function listarMesas(req: Request, res: Response) {
  try {
    const mesas = await Mesa.find().sort({ numMesa: 1 });

    return res.status(200).json({
      message: "Mesas listadas com sucesso.",
      mesas,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function buscarMesaPorId(req: Request, res: Response) {
  try {
    const mesa = await Mesa.findById(req.params.id);

    if (!mesa) {
      return res.status(404).json({
        message: "Mesa não encontrada.",
      });
    }

    return res.status(200).json({
      message: "Mesa encontrada com sucesso.",
      mesa,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function atualizarMesa(req: Request, res: Response) {
  try {
    const mesa = await Mesa.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!mesa) {
      return res.status(404).json({
        message: "Mesa não encontrada.",
      });
    }

    console.log(`Mesa atualizada: ${mesa.numMesa}`);

    return res.status(200).json({
      message: "Mesa atualizada com sucesso.",
      mesa,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

export async function deletarMesa(req: Request, res: Response) {
  try {
    const mesa = await Mesa.findByIdAndDelete(req.params.id);

    if (!mesa) {
      return res.status(404).json({
        message: "Mesa não encontrada.",
      });
    }

    console.log(`Mesa removida: ${mesa.numMesa}`);

    return res.status(200).json({
      message: "Mesa removida com sucesso.",
      mesa,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}