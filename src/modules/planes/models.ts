import { Schema, model } from 'mongoose'

const seatSchema = new Schema({
  number: Number,
  available: Boolean,
})

const planeSchema = new Schema({
  name: String,
  seats: [seatSchema],
})

const Plane = model('Plane', planeSchema)

export default Plane
