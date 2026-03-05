import helmet from "helmet";
import cors from "cors";

export function securityMiddlewares(app) {
  app.use(helmet());
  app.use(cors({
    origin: true,
    credentials: true,
  }));
}