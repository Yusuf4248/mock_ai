import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import { WinstonModule } from "nest-winston";
import { NestExpressApplication } from "@nestjs/platform-express";
import { winstonConfig } from "./common/logger/winston.logger";
import { AllExceptionFilter } from "./common/errors/error.handling";

async function start() {
  try {
    const PORT = process.env.PORT || 3030;
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: WinstonModule.createLogger(winstonConfig),
    });
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    app.useGlobalFilters(new AllExceptionFilter());
    app.setGlobalPrefix("api");
    app.enableCors({
      origin: true,
      credentials: true,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    });

    const config = new DocumentBuilder()
      .setTitle("Mock AI")
      .setDescription("MockAI-REST-API")
      .setVersion("1.0")
      .addTag("NestJS", "Validation, SWAGGER, BOT, TOKENS, SENDMAIL")
      .addTag("Nest js", "GUARD, AUTH")
      .addBearerAuth(
        {
          type: "http",
          scheme: "Bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token",
        },
        "JWT-auth"
      )
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [],
    });
    SwaggerModule.setup("api/docs", app, document, {
      customCss: `
    .swagger-ui .topbar { display: none !important; }
  `,
      customSiteTitle: "Mock AP API Docs",
      swaggerOptions: {
        docExpansion: "list",
        operationsSorter: "alpha",
      },
    });
    await app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.log(error);
  }
}
start();
