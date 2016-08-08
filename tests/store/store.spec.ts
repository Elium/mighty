import * as chai from 'chai';
import {Store, IStore} from '../../src/core/store/store';
import {MockAdapter} from '../mock/mock.adapter';
import {RankData} from '../mock/rank.data';
import {HeroData} from '../mock/hero.data';

const expect = chai.expect;
const heroData = new HeroData();
const rankData = new RankData();
const adapter = new MockAdapter(heroData.db, rankData.db);

let store: IStore;

beforeEach(() => {
  store = new Store();
});

describe("Store", () => {
  it("should create a heroResource", () => {
    const carResource = store.createResource(heroData.schema, adapter);
    expect(carResource).not.to.be.undefined;
  });

  it("should set and get a heroResource", () => {
    const carResource = store.createResource(heroData.schema, adapter);
    store.setResource(carResource);
    expect(store.getResource(heroData.schema.identity)).to.deep.equal(carResource);
  });

  it("should get all resource", () => {
    store.setResource(store.createResource(heroData.schema, adapter));
    store.setResource(store.createResource(rankData.schema, adapter));
    expect(Object.keys(store.getAllResource())).to.have.lengthOf(2);
  });

  it("should setup a list of resources", () => {
    store.setup([
      {schema: heroData.schema, adapter: adapter},
      {schema: rankData.schema, adapter: adapter}
    ]);
    expect(Object.keys(store.getAllResource())).to.have.lengthOf(2);
  });
});
