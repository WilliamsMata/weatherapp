import fs, { existsSync, readFileSync } from "fs";
import axios, { isCancel, AxiosError } from "axios";

class Search {
  history = [];
  dbPath = "./db/database.json";

  constructor() {
    //TODO read db if it exist
    this.readDB();
  }

  get historyCapitalized() {
    return this.history.map((place) => {
      return place
        .split(" ")
        .map((p) => p[0].toUpperCase() + p.substring(1))
        .join(" ");
    });
  }

  get paramsMapbox() {
    return {
      limit: 5,
      language: "en",
      access_token: process.env.MAPBOX_KEY,
    };
  }

  get paramsOpenWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      units: "metric",
    };
  }

  // MapBox API
  async city(place = "") {
    try {
      // http request
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
        params: this.paramsMapbox,
      });

      const resp = await instance.get();

      // return an array of objects that contains places that have been searched
      return resp.data.features.map((place) => ({
        id: place.id,
        name: place.place_name,
        lng: place.center[0],
        lat: place.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  // Open Weather API
  async placeWeather(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: "https://api.openweathermap.org/data/2.5/weather",
        params: {
          ...this.paramsOpenWeather,
          lat,
          lon,
        },
      });

      const resp = await instance.get();

      const { main, weather } = resp.data;

      return {
        temp: main.temp,
        feels_like: main.feels_like,
        min: main.temp_min,
        max: main.temp_max,
        desc: weather[0].description,
      };
    } catch (error) {
      console.log(error);
    }
  }

  // add places to history and save db
  addHistory(place = "") {
    // prevent duplicate
    if (this.history.includes(place.toLocaleLowerCase())) {
      return;
    }
    this.history = this.history.splice(0, 5);

    // add place to history
    this.history.unshift(place.toLocaleLowerCase());

    // save in DB
    this.saveDB();
  }

  saveDB() {
    const payload = {
      history: this.history,
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  readDB() {
    //
    if (!existsSync(this.dbPath)) return;

    const info = readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);

    this.history = data.history;
  }
}

export default Search;
