import mongoose, { Schema, Types, Document } from "mongoose";
import { Mesa } from "./mesaSchema";

enum ReservaStatus {
    RESERVADO = "Reservado",
    CANCELADO = "Cancelado",
    OCUPADO = "Ocupado",
    FINALIZADO = "Finalizado"
}

export interface IReserva extends Document {
    nomeCliente: string,
    telCliente: string,
    mesa: Types.ObjectId,
    quantPessoa: number,
    dataReser: Date,
    horaInicio: Date,
    horaFim: Date,
    duracao: number,
    obs?: string,
    status: ReservaStatus
}

export const reservaSchema = new Schema<IReserva>({
    nomeCliente: { type: String, required: true, trim: true },
    telCliente: { type: String, required: true, trim: true },
    mesa: { type: Schema.Types.ObjectId, ref: "Mesa", required: true },
    quantPessoa: { type: Number, required: true, min: 1 },
    horaInicio: { type: Date, required: true },
    horaFim: { type: Date },
    duracao: { type: Number, default: 90 },
    obs: { type: String, trim: true },
    status: { type: String, enum: Object.values(ReservaStatus), default: ReservaStatus.RESERVADO },
},
    { timestamps: true },
);
reservaSchema.pre("save", async function () {
  const agora = new Date();

  const umaHoraDepois = new Date(
    agora.getTime() + 60 * 60 * 1000
  );

  if (this.horaInicio < umaHoraDepois) {
    throw new Error(
      "A reserva deve ser feita com pelo menos 1 hora de antecedência."
    );
  }

  const duracao = this.duracao || 90;

  this.horaFim = new Date(
    this.horaInicio.getTime() + duracao * 60 * 1000
  );

  const mesa = await Mesa.findById(this.mesa);

  if (!mesa) {
    throw new Error("Mesa não encontrada.");
  }

  if (this.quantPessoa > mesa.capacidade) {
    throw new Error(
      "A mesa não comporta essa quantidade de pessoas."
    );
  }

  const conflito = await Reserva.findOne({
    _id: { $ne: this._id },

    mesa: this.mesa,

    status: {
      $nin: [
        ReservaStatus.CANCELADO,
        ReservaStatus.FINALIZADO,
      ],
    },

    horaInicio: {
      $lt: this.horaFim,
    },

    horaFim: {
      $gt: this.horaInicio,
    },
  });

  if (conflito) {
    throw new Error(
      "Já existe uma reserva para essa mesa nesse horário."
    );
  }
});



export const Reserva = mongoose.model<IReserva>("Reserva", reservaSchema);