export type Game = {
  id: string;
  name: string;
  supplies: string[];
  ages: string[];
  instructions: string[] | string;
  players?: string;
  activity?: string;
  noise?: string;
};
