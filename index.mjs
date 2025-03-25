import express from "express";
import routes from "./src/router/router.mjs";
import createConnection from "./src/dbConfig/databaseConnection.mjs";
import cors from "cors";

const app = express();
createConnection();

app.use(express.json());
app.use(cors());
app.use(routes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`hey-saloon-service is up and running on port ${PORT}`);
});
