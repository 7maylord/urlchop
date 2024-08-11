import express, { Request, Response, NextFunction } from 'express';
import fs from "fs";
import rateLimiter from "./utils/rateLimiter";
//import cors from "cors";
//import { corsOptions } from "./config/corsOptions";
import urlRoutes from "./routes/urlRoutes";
import authRoutes from "./routes/authRoutes";
import swaggerUi from 'swagger-ui-express';
import YAML from "yaml";

const app = express();

const file = fs.readFileSync("./src/openapi.yaml", "utf-8");
const swaggerDocument = YAML.parse(file);

// Trust proxy headers
//app.set('trust proxy', 1);

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cors(corsOptions));
app.use(rateLimiter);

//routes
app.use("/api", urlRoutes);
app.use("/api/auth", authRoutes);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Test route to check server status
app.get("/", (req, res) => {
  res.send("Server is running");
});

//catch all route
app.all("*", (req, res) => {
  res.status(404);
  res.json({
    message: "Not found",
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

export default app;
