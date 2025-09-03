import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TelegrafModule } from "nestjs-telegraf";
import { BOT_NAME } from "./app.constants";
import { BotModule } from "./bot/bot.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OtpModule } from "./otp/otp.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { SectionsModule } from "./sections/sections.module";
import { SectionAudiosModule } from "./section-audios/section-audios.module";
import { FileModule } from "./file/file.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { SectionSubGroupsModule } from './section-sub-groups/section-sub-groups.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    TelegrafModule.forRootAsync({
      botName: BOT_NAME,
      useFactory: () => ({
        token: process.env.BOT_TOKEN!,
        middlewares: [],
        include: [BotModule],
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploads", "audios"),
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
      dropSchema: false,
    }),
    OtpModule,
    BotModule,
    UsersModule,
    AuthModule,
    SectionsModule,
    SectionAudiosModule,
    FileModule,
    SectionSubGroupsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
