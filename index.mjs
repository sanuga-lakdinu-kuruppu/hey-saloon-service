import express from "express";
import routes from "./src/common/router/router.mjs";
import serverless from "serverless-http";
import createConnection from "./src/common/dbConfig/databaseConnection.mjs";
import cors from "cors";

const app = express();
createConnection();

app.use(express.json());
app.use(cors());
app.use(routes);

// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => {
//   console.log(`hey-saloon-service is up and running on port ${PORT}`);
// });

export const handler = serverless(app);
