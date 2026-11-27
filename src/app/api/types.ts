export interface Greeting {
  id: number;
  language: string;
  languageName: string;
  text: string;
  note: string;
}

export type GreetingsList = Greeting[];
