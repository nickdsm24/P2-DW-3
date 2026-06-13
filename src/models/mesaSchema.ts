import mongoose, {Schema, Document} from "mongoose";

enum locMesa {
    SALAO = "Salão",
    VARANDA = "Varanda",
    AINTERNA = "Área Interna",
}

export interface IMesa extends Document{
    numMesa: number,
    capacidade: number,
    loc: locMesa
}

const mesaSchema = new Schema<IMesa>({
    numMesa: {type: Number, required: true, unique: true},
    capacidade: {type: Number, required: true, min: 1},
    loc: {type: String, enum: Object.values(locMesa)}
},
{timestamps: true});

export const Mesa = mongoose.model<IMesa>("Mesa", mesaSchema);