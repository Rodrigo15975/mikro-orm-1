import { Migration } from '@mikro-orm/migrations';

export class Migration20250401071728_init extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "bot_analyze" ("uuid" uuid not null default gen_random_uuid(), "encuesta" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "bot_analyze_pkey" primary key ("uuid"));`);
    this.addSql(`create index "bot_analyze_uuid_index" on "bot_analyze" ("uuid");`);

    this.addSql(`drop table if exists "BotAnalyze" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "BotAnalyze" ("id" uuid not null, "encuesta" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "BotAnalyze_pkey" primary key ("id"));`);
    this.addSql(`create index "BotAnalyze_id_index" on "BotAnalyze" ("id");`);

    this.addSql(`drop table if exists "bot_analyze" cascade;`);
  }

}
