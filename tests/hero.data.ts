import {IJsonSchema} from "../src/core/resource/schema";

export interface IHero {
  id?: number
  name: string
  colors: Array<string>
  powers: Array<string>
}

export const schema: IJsonSchema = {
  id: "/hero",
  description: "Heroes schema",
  properties: {
    id: {
      type: "number",
      minimum: 1
    },
    name: {
      type: "string",
      "default": "hero"
    },
    powers: {
      type: "array",
      items: {type: "string"},
      minItems: 1,
      uniqueItems: true
    },
    colors: {
      type: "array",
      items: {type: "string"},
      minItems: 1,
      uniqueItems: true
    }
  }
};

export const db: Array<IHero> = [
  {
    id: 1,
    name: "superman",
    powers: ["flight", "strength", "x-rays"],
    colors: ["red", "blue", "yellow"]
  },
  {
    id: 2,
    name: "batman",
    powers: ["technology"],
    colors: ["black", "grey"]
  },
  {
    id: 3,
    name: "ironman",
    powers: ["super armor"],
    colors: ["red", "yellow", "white"]
  }
];

export const deadpool: IHero = {
  name: "Deadpool",
  powers: ["swag", "strength"],
  colors: ["red"]
};
