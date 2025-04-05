import axios from "axios";
import { set, z } from "zod";
// import { object, string, number, InferOutput ,parse} from "valibot";
import { SearchType } from "../types";
import { useMemo, useState } from "react";

// function isWeatherResponse(weather: unknown): weather is Weather {
//   return (
//     Boolean(weather) &&
//     typeof weather === "object" &&
//     typeof (weather as Weather).name === "string" &&
//     typeof (weather as Weather).main === "object" &&
//     typeof (weather as Weather).main.temp === "number" &&
//     typeof (weather as Weather).main.temp_min === "number" &&
//     typeof (weather as Weather).main.temp_max === "number"
//   );
// }

//Zod
const Weather = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    temp_min: z.number(),
    temp_max: z.number(),
  }),
});

export type Weather = z.infer<typeof Weather>;

// Valibot
// const WeatherSchema = object({
//   name: string(),
//   main: object({
//     temp: number(),
//     temp_min: number(),
//     temp_max: number(),
//   }),
// });

// type Weather = InferOutput<typeof WeatherSchema>;

const initialState = {
  name: "",
  main: {
    temp: 0,
    temp_min: 0,
    temp_max: 0,
  },
};

export default function userWeather<Weather>() {
  const [weather, setWeather] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const fetchWeather = async (search: SearchType) => {
    const appID = import.meta.env.VITE_API_KEY;
    try {
      setLoading(true);
      setWeather(initialState);
      const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appID}`;
      const { data } = await axios.get(geoURL);

      if (!data[0]) {
        setNotFound(true);
        return;
      }
      const lat = data[0].lat;
      const lon = data[0].lon;
      const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appID}`;

      //Castear ek type
      //   const { data: weatherData } = await axios<Weather>(weatherURL);
      //   console.log(weatherData.name);
      //   console.log(weatherData.main.temp);

      //Type Guard
      //   const { data: weatherData } = await axios(weatherURL);
      //   const result = isWeatherResponse(weatherData);
      //   if (result) {
      //     console.log(weatherData.name);
      //   }

      //Zod
      const { data: weatherData } = await axios(weatherURL);
      const result = Weather.safeParse(weatherData);
      console.log(result);

      if (result.success) {
        setWeather(result.data);
      }

      //Valibot
      //   const { data: weatherData } = await axios(weatherURL);
      //   const result = parse(WeatherSchema, weatherData);
      //   if (result) {
      //     console.log(result.name);
      //     console.log(result.main.temp);
      //   }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const hasWeatherData = useMemo(() => weather.name, [weather]);

  return {
    weather,
    loading,
    notFound,
    fetchWeather,
    hasWeatherData,
  };
}
