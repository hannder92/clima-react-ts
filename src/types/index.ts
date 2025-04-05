export type SearchType = {
  city: string;
  country: string;
};

export type Country = {
  name: string;
  code: string;
};

export type Weather = {
  name: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
};
