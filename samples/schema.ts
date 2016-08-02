import {IJsonSchema} from '../src/core/resource/schema';

export const heroSchema: IJsonSchema = {
  id: "heroes",
  properties: {
    id: {
      type: 'number',
      minimum: 1
    },
    name: {
      type: 'string',
      maxLength: 60,
      'default': 'Default'
    },
    rankId: {
      type: 'number',
      minimum: 1
    }
  }
};
