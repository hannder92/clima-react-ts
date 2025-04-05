export const formatTemperature = (temp: number) => {
  const kelvin = 273.15;
  return Math.floor(temp - kelvin);
};
