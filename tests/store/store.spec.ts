import * as chai from "chai";
import * as HeroesData from "../hero.data";
import {HeroAdapter} from "../hero.adapter";
import {Store, IStore} from "../../src/core/store/store";
import {IResource} from "../../src/core/resource/resource";

const expect = chai.expect;
const adapter = new HeroAdapter();

let store: IStore;

beforeEach(() => {
  store = new Store();
});

describe("Store", () => {
  it("should save a resource", () => {
    const carResource = store.setResource(HeroesData.schema, adapter);
    expect(carResource).not.to.be.undefined;
  });

  it("should get a resource", () => {
    expect(store.getResource(HeroesData.schema.title)).to.be.undefined;
    const carResource = store.setResource(HeroesData.schema, adapter);
    expect(store.getResource(HeroesData.schema.title)).to.equal(carResource);
  });
});
