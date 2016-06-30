import * as _ from "lodash";
import * as chai from "chai";
import {deadpool, schema, db} from "../../hero.data";
import {resource, adapter} from "../../hero.resource";
import {IRecord} from "../../../src/core/resource/record/record";

const dummyHero = resource.createRecord({});
const deadpoolHero = resource.createRecord(deadpool);
const supermanHero = resource.createRecord(db[0]);
const expect = chai.expect;

beforeEach(() => {
  adapter.heroes = [...db];
});

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

  it('should return only the properties values', () => {
    expect(_.omit(deadpoolHero.toJSON(), ["id"])).to.deep.equal(_.omit(deadpool, ["id"]));
  });

  it("should save an entry remotely", (done) => {
    supermanHero.name = "zuperman";
    supermanHero.save()
      .subscribe((record: IRecord) => {
        expect(record).to.have.property("name").that.equals(supermanHero.name);
        done();
      });
  });

  it("should destroy an entry remotely", (done) => {
    supermanHero.destroy()
      .subscribe(() => {
        expect(_.findIndex(db, {"name": supermanHero.name})).to.equal(-1);
        done();
      });
  });
});
