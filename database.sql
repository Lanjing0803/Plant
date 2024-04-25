
SET client_encoding = 'UTF8';

CREATE TABLE "users" (
  "id" serial,
  "name" varchar not null,
  "email" varchar unique not null,
  "password" varchar not null,
  "salt" varchar,
  PRIMARY KEY ("id")
);

CREATE TABLE "plants" (
  "id" serial,
  "name" varchar not null,
  "description" varchar,
  "plant_img_url" varchar ,
  PRIMARY KEY ("id")
);

CREATE TABLE "users_plants" (
  "id" serial,
  "user_id" Int,
  "plant_id" Int,
  "status" varchar,
  "name" varchar,
  PRIMARY KEY ("id"),
  CONSTRAINT "FK_user_plant.user_id"
    FOREIGN KEY ("user_id")
      REFERENCES "users"("id"),
  CONSTRAINT "FK_user_plant.plant_id"
    FOREIGN KEY ("plant_id")
      REFERENCES "plants"("id")
);

CREATE INDEX "CCK" ON  "users_plants" ("user_id", "plant_id");

CREATE TABLE "waterings" (
  "id" serial,
  "user_plant_id" int not null,
  "watering_date" timestamp,
  PRIMARY KEY ("id"),
  CONSTRAINT "FK_watering.user_plant_id"
    FOREIGN KEY ("user_plant_id")
      REFERENCES "users_plants"("id")
);

