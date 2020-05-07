CREATE TABLE "users" (
  "id" SERIAL,
  "auth0_id" text PRIMARY KEY,
  "name" varchar,
  "createdAt" timestamp,
  "updatedAt" timestamp
);

CREATE TABLE "trays" (
  "id" SERIAL PRIMARY KEY,
  "user_id" text,
  "createdAt" timestamp,
  "updatedAt" timestamp
);

CREATE TABLE "cells" (
  "id" SERIAL PRIMARY KEY,
  "tray_id" int,
  "posX" int,
  "posY" int,
  "name" varchar,
  "description" varchar,
  "germinated" boolean,
  "createdAt" timestamp,
  "updatedAt" timestamp
);

ALTER TABLE "trays" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("auth0_id");

ALTER TABLE "cells" ADD FOREIGN KEY ("tray_id") REFERENCES "trays" ("id");
