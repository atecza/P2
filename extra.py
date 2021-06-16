Footprint = session.query(EnvData.Country, EnvData.Footprint_Crop, EnvData.Footprint_Graze, EnvData.Footprint_Forest,EnvData.Footprint_Carbon, EnvData.Footprint_Total).all()

EnvData
    Country = []
    Crop = []
    Graze = []
    Forest = []
    Carbon = []
    Total = []
    
    for country, crop, graze, forest, carbon, total in Footprint:
        Country.append(country)
        Crop.append(crop)
        Graze.append(graze)
        Forest.append(forest)
        Carbon.append(carbon)
        Total.append(total)
        
    Footprint_dic = {'Crop':Crop, 'Graze':Graze, 'Forest':Forest,'Carbon':Carbon,'Total':Total}
        
    EnvFootprint_dic = {f'{Footprint}':Footprint_dic}
    Country_dic = {f'{Country}':Country}
    
    EnvData.append(Country_dic)
    EnvData.append(EnvFootprint_dic)