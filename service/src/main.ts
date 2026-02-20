import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOriginsRaw = process.env.CORS_ORIGINS?.trim();
  const corsOrigins = corsOriginsRaw
    ? corsOriginsRaw
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : ["http://localhost:3000"];

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
