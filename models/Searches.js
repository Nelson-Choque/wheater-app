import "fs";
import axios from "axios";
import { listOfCities } from "../helpers/inquirer.js";
import { readFileSync, writeFileSync } from "fs";

export class Searches {
  pathFile = "./db/database.json";

  record = [];

  constructor() {
    this.readDB();
  }

  async searchCity(city) {
    try {
      const intance = axios.create({
        baseURL: `https://nominatim.openstreetmap.org/search`,
        params: {
          q: city,
          format: "jsonv2",
        },
      });
      const { data } = await intance.get();
      return data;
    } catch (error) {
      return [];
    }
  }

  async getWheater(lat, lon) {
    try {
      const intance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: {
          lat: lat,
          lon: lon,
          appid: process.env.WEAThER_KEY,
          units: "metric",
          lang: "es",
        },
      });
      const { data } = await intance.get();
      console.log(data);
      return {
        desc: data.weather[0].description,
        min: data.main.temp_min,
        max: data.main.temp_max,
        temp: data.main.temp,
      };
    } catch (error) {
      return [];
    }
  }

  async addRecord(place = "") {
    this.record.unshift(place);
    this.saveDB();
  }

  async saveDB() {
    const payload = {
      record: this.record,
    };

    writeFileSync(this.pathFile, JSON.stringify(payload), {
      encoding: "utf-8",
    });
  }
  async readDB() {
    const data = readFileSync(this.pathFile, { encoding: "utf-8" });

    const { record } = JSON.parse(data);

    this.record = record;
  }
  capitalizedRecord() {
    return this.record.map((city) => {
      const firstLetter = city[0].toUpperCase();

      const subStringCity = city.substring(1);

      return firstLetter + subStringCity;
    });
  }
}
