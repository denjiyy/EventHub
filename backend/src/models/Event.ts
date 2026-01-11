import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  category: mongoose.Types.ObjectId;
  date: Date;
  location: string;
  price: number;
  capacity: number;
  ticketsAvailable: number;
  image: string;
  organizer: mongoose.Types.ObjectId;
  bookings: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema<IEvent> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
    },
    description: {
      type: String,
      required: [true, 'Please provide an event description'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide a category'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide an event date'],
    },
    location: {
      type: String,
      required: [true, 'Please provide a location'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    capacity: {
      type: Number,
      required: [true, 'Please provide a capacity'],
      min: 1,
    },
    ticketsAvailable: {
      type: Number,
      required: [true, 'Please provide available tickets'],
      min: 0,
    },
    image: {
      type: String,
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide an organizer'],
    },
    bookings: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEvent>('Event', EventSchema);
