import {
  inquirerMenu,
  leerInput,
  listOfCities,
  pausa,
} from "./helpers/inquirer.js";
import { Searches } from "./models/searches.js";

import dotenv from "dotenv";

dotenv.config();

const main = async () => {
  const searches = new Searches();

  let opt;

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        //leer input de la ciudad
        const lugar = await leerInput("buscar ciudad: ");

        //buscar ciudad
        const cities = await searches.searchCity(lugar);

        //seleccionar id de la ciudad
        const cityId = await listOfCities(cities);
        //encontrar ciudad
        const selectedCity = cities.find((city) => city.place_id === cityId);

        searches.addRecord(selectedCity.display_name);

        //obtener clima de la ciudad
        const weatherOfCity = await searches.getWheater(
          selectedCity.lat,
          selectedCity.lon
        );

        //informacion de la ciudad
        console.log("\n");
        console.log("Informacion de la ciudad:".green);
        console.log("ciudad: " + selectedCity.display_name);
        console.log("lat :" + selectedCity.lat);
        console.log("lon :" + selectedCity.lon);
        console.log("descripcion del clima: " + weatherOfCity.desc);
        console.log("temperatura: " + weatherOfCity.temp);
        console.log("temperatura minima: " + weatherOfCity.min);
        console.log("temperatura maxima: " + weatherOfCity.max);

        await pausa();
        break;

      case 2:
        const record = searches.capitalizedRecord();
        record.forEach((city, i) => {
          const idx = `${i + 1}.- `.green;
          console.log(idx + city);
        });

        await pausa();
        break;
      case 0:
        await pausa();
        break;

      default:
        break;
    }
  } while (opt !== 0);
};

main();
