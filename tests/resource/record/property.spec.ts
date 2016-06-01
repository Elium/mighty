import * as _ from "lodash";
import * as chai from "chai";
import * as HeroesData from "../../hero.data";
import {IProperty, Property} from "../../../src/core/resource/record/property";

const expect = chai.expect;

const schemaProperties = HeroesData.schema.properties;
const properties: Array<IProperty> = [];
_.forEach(schemaProperties, (schema, propertyName) => {
  properties.push(new Property(propertyName, schema));
});

describe("Property", () => {
  it("should match the schema", () => {
    _.forEach(properties, (property: IProperty) => {
      expect(schemaProperties).to.have.property(property.name);
      expect(property).to.have.property("type").that.eq(schemaProperties[property.name].type);
      expect(property).to.have.property("default").that.is.not.undefined;
      expect(property).to.have.property("value").that.is.not.undefined;
    });
  });
});
