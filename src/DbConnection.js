import mongoose from "mongoose";

export default function () {
  const username = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_DATABASE;

  const url =
    Config("database.uri") ||
    `mongodb+srv://${username}:${password}@cluster0.qu1dn.mongodb.net/${database}?retryWrites=true&w=majority`;

  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  var connection = mongoose.connection;

  connection.once("open", () => {
    console.log(`Connected to MongoDB -> ${Config("app.name")}`);
  });

  connection.on("error", console.error.bind(console, "CONNECTION ERROR"));

  return connection;
}
