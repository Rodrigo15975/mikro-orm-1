import { Migration } from '@mikro-orm/migrations';

export class Migration20250401070051 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "BotAnalyze" ("id" uuid not null, "encuesta" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "BotAnalyze_pkey" primary key ("id"));`);
    this.addSql(`create index "BotAnalyze_id_index" on "BotAnalyze" ("id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "BotAnalyze" cascade;`);
  }

}
