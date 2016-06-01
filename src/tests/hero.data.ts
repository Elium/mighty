import {IJsonSchema} from "../core/resource/schema";
import {IMap} from "../common/utils/map";

export const schema: IJsonSchema = {
  id: "/hero",
  description: "Heroes schema",
  properties: {
    id: {
      type: "number",
      minimum: 1
    },
    name: {type: "string"},
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

export const db: Array<IMap<any>> = [
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

export const deadpool: IMap<any> = {
  name: "Deadpool",
  powers: ["swag", "strength"],
  colors: ["red"]
};
