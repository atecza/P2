-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/bewOyV
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE "States" (
    "Country" VARCHAR   NOT NULL,
    CONSTRAINT "pk_States" PRIMARY KEY (
        "Country"
     )
);

CREATE TABLE "EnvData" (
    "Country" VARCHAR   NOT NULL,
    "Region" VARCHAR   NOT NULL,
    "HDI" FLOAT   NOT NULL,
    "Footprint_Crop" FLOAT   NOT NULL,
    "Footprint_Graze" FLOAT   NOT NULL,
    "Footprint_Forest" FLOAT   NOT NULL,
    "Footprint_Carbon" FLOAT   NOT NULL,
    "Footprint_Fish" FLOAT   NOT NULL,
    "Footprint_Total" FLOAT   NOT NULL,
    "Land_Crop" FLOAT   NOT NULL,
    "Land_Grazing" FLOAT   NOT NULL,
    "Land_Forest" FLOAT   NOT NULL,
    "Water_Fishing" FLOAT   NOT NULL,
    "Land_Urban" FLOAT   NOT NULL,
    "Threat_Species" FLOAT   NOT NULL,
    "Emissions_CO2" BIGINT   NOT NULL,
    "Biocapacity_Total" FLOAT   NOT NULL,
    "BioCap_RD" INT   NOT NULL,
    "Earths_Req" INT   NOT NULL,
    "Countries_Req" INT   NOT NULL,
    "Data_Quality" INT   NOT NULL
);

CREATE TABLE "CountryData" (
    "Country" VARCHAR   NOT NULL,
    "Surface_Area" BIGINT   NOT NULL,
    "Population" BIGINT   NOT NULL,
    "PopDensity" FLOAT   NOT NULL,
    "PopGrowth" FLOAT   NOT NULL,
    "PopUrban" FLOAT   NOT NULL,
    "GDP" BIGINT   NOT NULL,
    "GDPpercap" FLOAT   NOT NULL,
    "GDPGrowth" INT   NOT NULL,
    "EconAg" FLOAT   NOT NULL,
    "EconInd" FLOAT   NOT NULL,
    "EconService" FLOAT   NOT NULL,
    "Unemployment" FLOAT   NOT NULL,
    "Export" BIGINT   NOT NULL,
    "IMPORT" BIGINT   NOT NULL,
    "Gov_Education" FLOAT   NOT NULL,
    "Women_Parliment" FLOAT   NOT NULL,
    "Energy_Prod" INT   NOT NULL
);

ALTER TABLE "EnvData" ADD CONSTRAINT "fk_EnvData_Country" FOREIGN KEY("Country")
REFERENCES "States" ("Country");

ALTER TABLE "CountryData" ADD CONSTRAINT "fk_CountryData_Country" FOREIGN KEY("Country")
REFERENCES "States" ("Country");

