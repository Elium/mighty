import * as chai from 'chai';
import {Hero} from '../../mock/hero.data';
import {Resource} from '../../../src/core/resource/resource';
import {IStore, Store} from '../../../src/core/store/store';

const expect = chai.expect;
const heroResource = new Resource("heroes", Hero);

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
