import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import psycopg2

from flask import Flask, jsonify, render_template, redirect
import datetime as dt

#make sure you have your own config on your computer in the SQL folder
#from config import config_dict

#################################################
# Database Setup
#################################################
#pg_user = pg_user
#pg_pwd = pg_pwd
#pg_port = pg_port
#database = database

#remember to make this db in pgAdmin before
# run Final_Query.sql in pgAdmin to create the tables

#database = 'Project2'
#database = 'd5l7n5pdmr2nb8'
#url = f"postgresql://{pg_user}:{pg_pwd}@localhost:{pg_port}/{database}"
url = url_heroku

engine = create_engine(f'{url}')

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
EnvironmentData = Base.classes.envdata
CountryData = Base.classes.countrydata
EmissionsData = Base.classes.emissionsdata

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
    
    EData = session.query(EnvironmentData).all()
    myData = []

    for x in EData:
    
        fullEdata = {}
    
        fullEdata = {
            "Country": x.Country,
            "HDI":x.HDI,
            "Footprint_Crop":x.Footprint_Crop,
            "Footprint_Graze":x.Footprint_Graze,
            "Footprint_Forest":x.Footprint_Forest,
            "Footprint_Carbon":x.Footprint_Carbon,
            "Footprint_Fish":x.Footprint_Fish,
            "Footprint_Total":x.Footprint_Total,
            "Land_Urban":x.Land_Urban,
            "Emission_CO2":x.Emissions_CO2,
            "BioCap":x.Biocapacity_Total,
            "BioCap_RD":x.BioCap_RD,
            "Data_Quality":x.Data_Quality
        }
        
        myData.append(fullEdata)
    
    CData = session.query(CountryData).all()

    i = 0
    for x in CData:   
        
        fullCData = {}
    
        fullCData = {
            "Area": x.Surface_Area,
            "Population":x.Population,
            "PopDensity":x.PopDensity,
            "PopGrowth":x.PopGrowth,
            "PopUrban":x.PopUrban,
            "EconAg":x.EconAg,
            "EconInd":x.EconInd,
            "EconServ":x.EconService,
            "GovEducation":x.Gov_Education,
            "Women_Parliment":x.Women_Parliment
        }
        
        myData[i].update(fullCData)
        i = i+1
    
    #get the emissions data in the correct json format
    EmData = session.query(EmissionsData).all()
    
    countrylist = []
    yearlist=[]
    emlist=[]

    for x in EmData:
        countrylist.append(x.Country)
        yearlist.append(x.Year)
        emlist.append(x.Emissions)
    
    for x in range(len(myData)):
        newyear=[]
        newem=[]
        for i in range(len(countrylist)):
            if countrylist[i]==myData[x]['Country']:
                newyear.append(yearlist[i])
                newem.append(emlist[i])
        myData[x].update({
            "Year":newyear,
            "Emissions":newem
        })
    
    
    """Return the JSON representation of your dictionary"""
    return (jsonify(myData))
    
    session.close()




if __name__ == '__main__':
    app.run(debug=True)