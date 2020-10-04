import React, {useState, useEffect} from 'react';
import './App.css';
import { FormControl, Select, MenuItem, Card, CardContent} from '@material-ui/core';
import {Jumbotron} from 'reactstrap';
import InfoBox from './components/InfoBox';
import LineGraph from './components/LineGraph';
import Table from './components/Table';
import {sortData, prettyPrintStat} from './util';
import numeral from "numeral";
import Map from './components/Map';
import "leaflet/dist/leaflet.css";

function App() {

  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, []);

    const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <Jumbotron>
        <div className="container">
          <div className="row row-header">
            <div className="col-12 col-sm-6 text-align-center">
            <h1>COVID-19 Tracker.</h1>
            </div>
            <div className="col-12 col-sm offset-lg-4">
            <FormControl className="app_dropdown">
                <Select
                  variant="outlined"
                  value={country}
                  onChange={onCountryChange}
                >
                  <MenuItem value="worldwide">Worldwide</MenuItem>
                    {countries.map((country) => (
                      <MenuItem value={country.value}>{country.name}</MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
          </div>
        </div>
      </Jumbotron>  
    <div className="m-3">
      <div className=" app_left row align-item-start">
            <div className="col-12 col-sm-3 mr-auto">
              <InfoBox onClick={(e) => setCasesType("cases")} 
                title="New Cases" 
                active={casesType === "cases"}
                cases={prettyPrintStat(countryInfo.todayCases)} 
                total={numeral(countryInfo.cases).format("0.0a")}/>
              <InfoBox
                onClick={(e) => setCasesType("recovered")}
                title="Recovered"
                active={casesType === "recovered"}
                cases={prettyPrintStat(countryInfo.todayRecovered)}
                total={numeral(countryInfo.recovered).format("0.0a")}
              />
               <InfoBox
                onClick={(e) => setCasesType("deaths")}
                title="Deaths"
                active={casesType === "deaths"}
                cases={prettyPrintStat(countryInfo.todayDeaths)}
                total={numeral(countryInfo.deaths).format("0.0a")}
              />
            </div>  
            <div className="col-12 col-sm-9 ml-auto">
            <Map
              countries={mapCountries}
              casesType={casesType}
              center={mapCenter}
              zoom={mapZoom}
            />
          </div>
      </div>
      <div className="row">
        <div className="col-12 col-sm mr-auto">
            <Card className="text-center">
              <CardContent>
                <h4>Worldwide Cases</h4>
                <LineGraph className="app_graph" casesType={casesType}/>
              </CardContent>
            </Card>
            </div>
            <div className="col-12 col-sm ml-auto">
            <Card className="text-center">
              <CardContent>
                <Table countries={tableData}/>
              </CardContent>
            </Card>
            </div>
          </div>
      </div>
    </div>
    

  );
}

export default App;
