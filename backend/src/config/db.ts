// import mongoose from "mongoose";

// async function connectDB(mongoUri: string) {
//   try {
//     mongoose.connection.on("error", (error) => {
//       console.error("MongoDB connection error:", error);
//     });
//     await mongoose.connect(mongoUri);
//     console.log("Connected to MongoDB");
//   } catch (err) {
//     console.error("MongoDB connection error:", err);
//     throw err;
//   }
// }

// export default connectDB;
import mongoose from "mongoose";

async function connectDB(mongoUri: string) {
  try {
    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error);
    });
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

export default connectDB;
