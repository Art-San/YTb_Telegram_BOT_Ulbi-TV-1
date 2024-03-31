import mongoose from 'mongoose'
import dotenv from 'dotenv'

export default async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI)
    console.log('MONGODB подключено')
  } catch (error) {
    console.log('Error при подключение MongoDB: ', error.message)
  }
}

// import mongoose from 'mongoose'
// import dotenv from 'dotenv'

// dotenv.config()

// // const uri = 'mongodb://127.0.0.1:27017/local'
// const uri = process.env.MONGO_DB_URI
// mongoose
//   .connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => console.log('MongoDB Connected...'))
//   .catch((err) => console.log(err))
