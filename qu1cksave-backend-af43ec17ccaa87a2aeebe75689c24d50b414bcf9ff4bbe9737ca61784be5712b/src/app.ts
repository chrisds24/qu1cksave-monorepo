import cors from "cors";
import express, { Express, Request as ExRequest, Response as ExResponse, Router, ErrorRequestHandler } from "express";
import swaggerUi from "swagger-ui-express";

import { RegisterRoutes } from "../build/routes";

const app: Express = express();
app.use(cors());
// app.use(express.json());
// https://stackoverflow.com/questions/60947294/error-413-payload-too-large-when-upload-image
// https://gist.github.com/Maqsim/857a14a4909607be13d6810540d1b04f
// https://stackoverflow.com/questions/19917401/error-request-entity-too-large (Used this one)
app.use(express.json({limit: '2mb'}));
// app.use(express.json({limit: '300kb'}));
app.use(express.urlencoded({ extended: false }));

app.use("/api/v0/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(swaggerUi.generateHTML(await import("../build/swagger.json")));
});

const router = Router();
RegisterRoutes(router);
app.use("/api/v0", router);

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
};
app.use(errorHandler);

export default app;
