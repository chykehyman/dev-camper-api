import mongoose from 'mongoose';

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  console.log(
    `MongoDB successfully connected: ${conn.connection.host}`.cyan.underline
      .bold
  );
};

export default connectDB;
