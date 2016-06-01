import * as chai from "chai";
import {Store, IStore} from "../../src/core/store/store";
import {IResource} from "../../src/core/resource/resource";
import {HeroAdapter} from "../hero.adapter";
import {HeroParser} from "../hero.parser";
import {HeroFormatter} from "../hero.formatter";
import * as HeroesData from "../hero.data";

const expect = chai.expect;
const formatter = new HeroFormatter();
const parser = new HeroParser();
const adapter = new HeroAdapter(formatter, parser);

let store: IStore;

beforeEach(() => {
  store = new Store();
});

describe("Store", () => {
  it("should save a resource", () => {
    var carResource: IResource = store.setResource(HeroesData.schema, adapter);
    expect(carResource).not.to.be.undefined;
  });

  it("should get a resource", () => {
    expect(store.getResource(HeroesData.schema.title)).to.be.undefined;
    var carResource: IResource = store.setResource(HeroesData.schema, adapter);
    expect(store.getResource(HeroesData.schema.title)).to.equal(carResource);
  });
});
