import * as _ from 'lodash';
import * as chai from 'chai';
import {IProperty, Property} from '../../../src/core/resource/record/property';
import {HeroData} from '../../mock/hero.data';

const expect = chai.expect;
const heroData = new HeroData();

const schemaProperties = heroData.schema.properties;
const properties: Array<IProperty> = [];
_.forEach(schemaProperties, (schema, propertyName) => {
  properties.push(new Property(propertyName, schema));
});

describe("Property", () => {
  it("should match the heroSchema", () => {
    _.forEach(properties, (property: IProperty) => {
      expect(schemaProperties).to.have.property(property.name);
      expect(property).to.have.property("type").that.eq(schemaProperties[property.name].type);
      expect(property).to.have.property("defaultValue").that.eq(schemaProperties[property.name].defaultsTo);
      expect(property).to.have.property("value").that.is.not.undefined;
    });
  });
});
