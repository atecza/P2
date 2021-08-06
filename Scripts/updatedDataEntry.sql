CREATE TABLE "states" (
    "Country" VARCHAR   NOT NULL,
    CONSTRAINT "pk_states" PRIMARY KEY (
        "country"
     )
);

CREATE TABLE "envdata" (
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
    "Emissions_CO2" FLOAT   NOT NULL,
    "Biocapacity_Total" FLOAT   NOT NULL,
    "BioCap_RD" FLOAT   NOT NULL,
    "Earths_Req" FLOAT   NOT NULL,
    "Countries_Req" FLOAT   NOT NULL,
    "Data_Quality" FLOAT   NOT NULL
);

CREATE TABLE "countrydata" (
    "Country" VARCHAR   NOT NULL,
    "Surface_Area" FLOAT   NOT NULL,
    "Population" FLOAT   NOT NULL,
    "PopDensity" FLOAT   NOT NULL,
    "PopGrowth" FLOAT   NOT NULL,
    "PopUrban" FLOAT   NOT NULL,
    "GDP" FLOAT   NOT NULL,
    "GDPpercap" FLOAT   NOT NULL,
    "GDPGrowth" FLOAT   NOT NULL,
    "EconAg" FLOAT   NOT NULL,
    "EconInd" FLOAT   NOT NULL,
    "EconService" FLOAT   NOT NULL,
    "Unemployment" FLOAT   NOT NULL,
    "Export" FLOAT   NOT NULL,
    "Import" FLOAT   NOT NULL,
    "Gov_Education" FLOAT   NOT NULL,
    "Women_Parliment" FLOAT   NOT NULL,
    "Energy_Prod" INT   NOT NULL
);



CREATE TABLE "emissionsdata" (
    "Country" VARCHAR   NOT NULL,
    "Year" INT   NOT NULL,
    "Emissions" FLOAT   NOT NULL
);

ALTER TABLE "envdata" ADD CONSTRAINT "fk_envdata_Country" FOREIGN KEY("Country")
REFERENCES "states" ("Country");

ALTER TABLE "countrydata" ADD CONSTRAINT "fk_countrydata_Country" FOREIGN KEY("Country")
REFERENCES "states" ("Country");

ALTER TABLE "emissionsdata" ADD CONSTRAINT "fk_emissionsdata_Country" FOREIGN KEY("Country")
REFERENCES "states" ("Country");


--Run this after you have imported data
ALTER TABLE envdata ADD COLUMN ID SERIAL PRIMARY KEY;
ALTER TABLE countrydata ADD COLUMN ID SERIAL PRIMARY KEY;
ALTER TABLE emissionsdata ADD COLUMN ID SERIAL PRIMARY KEY;

SELECT * from envdata;
SELECT * from countrydata;
SELECT * from states;
SELECT * from emissionsdata;

DELETE FROM envdata;
DELETE FROM countrydata;
DELETE FROM emissionsdata;
DELETE FROM states;
