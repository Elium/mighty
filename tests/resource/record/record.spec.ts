import * as chai from "chai";
import {deadpool, schema} from "../../hero.data";
import {resource} from "../../hero.resource";

const dummyHero = resource.createRecord({});
const deadpoolHero = resource.createRecord(deadpool);
const expect = chai.expect;

describe("Record", () => {
  it('should match schema properties', () => {
    expect(dummyHero).to.have.deep.property("properties.id");
    expect(dummyHero).to.have.deep.property("properties.name");
    expect(dummyHero).to.have.deep.property("properties.powers");
    expect(dummyHero).to.have.deep.property("properties.colors");
  });

  it('should generate getters and setters', () => {
    expect(dummyHero).to.have.property("id");
    expect(dummyHero).to.have.property("name");
    expect(dummyHero).to.have.property("powers");
    expect(dummyHero).to.have.property("colors");
  });

  it('should be initialised', () => {
    expect(deadpoolHero).to.have.property("name").that.equals(deadpool["name"]);
    expect(deadpoolHero).to.have.property("powers").that.equals(deadpool["powers"]);
    expect(deadpoolHero).to.have.property("colors").that.equals(deadpool["colors"]);
  });

  it('should handle default value', () => {
    expect(dummyHero.name).to.equal(schema.properties["name"].default);
  });
});
