import * as chai from 'chai';
import {Store, IStore} from '../../src/store/store';
import {HeroData, HeroRecord} from '../mock/hero.data';
import {Resource} from '../../src/resource/resource';

const expect = chai.expect;
const heroResource = new Resource("heroes", HeroRecord);

let store: IStore;

beforeEach(() => {
  store = new Store();
});

describe("Store", () => {
  it("should set and get a heroResource", () => {
    store.set(heroResource);
    expect(store.get(heroResource.identity)).to.deep.equal(heroResource);
  });

  it("should get all resource", () => {
    store.set(heroResource);
    expect(Object.keys(store.getAll())).to.have.lengthOf(1);
  });
});
