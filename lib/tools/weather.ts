import { tool, ToolRuntime } from "@langchain/core/tools";
import axios from "axios";
import z from "zod";

export const weatherTool = tool(
  async ({ city }: { city: string }, config: ToolRuntime): Promise<string> => {
    const writer = config.writer;

    writer?.({
      type: "progress",
      id: "weather",
      message: `Fetching weather for ${city}...`,
    });

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      throw new Error(
        "OpenWeatherMap API key not found. Please set OPENWEATHER_API_KEY environment variable."
      );
    }

    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    writer?.({
      type: "progress",
      id: "weather",
      message: "Weather fetched successfully",
    });

    return `Weather in ${city}: ${description}, Temperature: ${temperature}°C, Humidity: ${humidity}%, Wind Speed: ${windSpeed} m/s`;
  },
  {
    name: "get_weather",
    description: "Get the current weather for a given city.",
    schema: z.object({
      city: z.string().describe("The city to get the weather for"),
    }),
  }
);
