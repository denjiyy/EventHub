import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  numberOfTickets: number;
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'pending';
  bookingDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema<IBooking> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user'],
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Please provide an event'],
    },
    numberOfTickets: {
      type: Number,
      required: [true, 'Please provide number of tickets'],
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: [true, 'Please provide total price'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'pending'],
      default: 'confirmed',
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBooking>('Booking', BookingSchema);
