import { model, models, Schema, Document, Types } from "mongoose";

// Interface for individual seat
export interface ISeat {
  id: string;
  row: string;
  number: number;
  status: "available" | "booked" | "locked";
  priceTier: string;
}

// Interface for seating map
export interface ISeatingMap {
  stage: {
    description: string;
  };
  rows: Record<string, ISeat[]>;
}

// Interface for Event
export interface IEvent {
  title: string;
  description: string;
  date: Date;
  venue: string;
  totalSeats: number;
  availableSeats: number;
  seatingMap?: ISeatingMap;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEventDocument extends IEvent, Document {}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    seatingMap: {
      type: {
        stage: {
          description: { type: String, required: true },
        },
        rows: { type: Schema.Types.Mixed, required: true },
      },
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Event = models?.Event || model<IEvent>("Event", eventSchema);

export default Event;
