import * as dotenv from "dotenv";
dotenv.config();
import {
  inquirerMenu,
  readInput,
  pause,
  listPlaces,
} from "./helpers/inquirer.js";
import Search from "./models/search.js";

const main = async () => {
  const search = new Search();

  let opt;

  do {
    console.clear();

    opt = await inquirerMenu();

    switch (opt) {
      //Search city
      case 1:
        // Print message
        const searchPlace = await readInput("Place: ");

        // Search places
        const places = await search.city(searchPlace);

        // Select place
        const id = await listPlaces(places);
        if (id === "0") continue;

        const selectedPlace = places.find((place) => place.id === id);

        // save in history's DB
        search.addHistory(selectedPlace.name);

        // Weather
        const weather = await search.placeWeather(
          selectedPlace.lat,
          selectedPlace.lng
        );

        // Print result
        console.clear();
        console.log("\nPlace information\n".green);
        console.log("Place:", selectedPlace.name.green);
        console.log("Temp:", weather.temp);
        console.log("Feels like:", weather.feels_like);
        console.log("Min:", weather.min);
        console.log("Max:", weather.max);
        console.log("Description:", weather.desc.green);
        console.log("Lon:", selectedPlace.lng);
        console.log("Lat:", selectedPlace.lat);
        break;

      case 2:
        //Search history
        search.historyCapitalized.forEach((place, i) => {
          const idx = `${i + 1}.`.green;
          console.log(`${idx} ${place}`);
        });
        break;
    }

    if (opt !== 0) await pause();
  } while (opt !== 0);
};

main();
