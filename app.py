import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import psycopg2

from flask import Flask, jsonify, render_template, redirect
import datetime as dt

#make sure you have your own config on your computer in the SQL folder
from config import key

#################################################
# Database Setup
#################################################
pg_user = 'postgres'
pg_pwd = key
pg_port = "5432"

#remember to make this db in pgAdmin before
# run Final_Query.sql in pgAdmin to create the tables

database = 'Project2'
url = f"postgresql://{pg_user}:{pg_pwd}@localhost:{pg_port}/{database}"

engine = create_engine(f'{url}')

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
EnvironmentData = Base.classes.envdata
CountryData = Base.classes.countrydata

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route("/")
def Index():
    return render_template("index.html")

@app.route("/api/v1.0/EnvData")
def EnvData():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    
    #make all the empty lists
    Countries = []
    HDI = []
    FC = []
    FG = []
    FF = []
    FCar = []
    FFish = []
    FT = []
    LU = []
    ECO2 = []
    BCap = []
    BCapDR = []
    DQ = []
    SurArea = []
    Pop = []
    PopD = []
    PopGr = []
    PopUrb = []
    GDP = []
    GDPGrowth = []
    EconAg = []
    EconInd = []
    EconServ = []
    GovEd = []
    WP = []
    
    EData = session.query(EnvironmentData).all()
    
    for x in EData:
        Countries.append(x.Country)
        HDI.append(x.HDI)
        FC.append(x.Footprint_Crop)
        FG.append(x.Footprint_Graze)
        FF.append(x.Footprint_Forest)
        FCar.append(x.Footprint_Carbon)
        FFish.append(x.Footprint_Fish)
        FT.append(x.Footprint_Total)
        LU.append(x.Land_Urban)
        ECO2.append(x.Emissions_CO2)
        BCap.append(x.Biocapacity_Total)
        BCapDR.append(x.BioCap_RD)
        DQ.append(x.Data_Quality)
    
    CData = EData = session.query(CountryData).all()
    
    for x in CData:
        SurArea.append(x.Surface_Area)
        Pop.append(x.Population)
        PopD.append(x.PopDensity)
        PopGr.append(x.PopGrowth)
        PopUrb.append(x.PopUrban)
        EconAg.append(x.EconAg)
        EconInd.append(x.EconInd)
        EconServ.append(x.EconService)
        GovEd.append(x.Gov_Education)
        WP.append(x.Women_Parliment)
    
    #put everything into a dictionary
    full_data = {
        "Country":Countries,
        "HDI":HDI,
        "Footprint_Crop":FC,
        "Footprint_Graze":FG,
        "Footprint_Forest":FF,
        "Footprint_Carbon":FCar,
        "Footprint_Fish":FF,
        "Footprint_Total":FT,
        "Land_Urban":LU,
        "Emissions_CO2":ECO2,
        "BioCapTotal":BCap,
        "BioCap_DR":BCapDR,
        "Data_Quality":DQ,
        "Area":SurArea,
        "Population":Pop,
        "PopDensity":PopD,
        "PopGrowth":PopGr,
        "PopUrban":PopUrb,
        "EconAg":EconAg,
        "EconInd":EconInd,
        "EconServ":EconServ,
        "GovEducation":GovEd,
        "Women_Parliment":WP
    
    }

    #Create my main dictionary
    
    myData = {"Data":full_data}
    
    """Return the JSON representation of your dictionary"""
    return (jsonify(myData))
    
    session.close()




if __name__ == '__main__':
    app.run(debug=True)