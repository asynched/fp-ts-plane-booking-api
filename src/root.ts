import app from '@/app'
import mongoose from 'mongoose'

export const bootstrap = async () => {
  await mongoose.connect('mongodb://localhost:27017/booking')
  app.listen(3333, () => {
    console.log('Server is running on port 3333')
  })
}
