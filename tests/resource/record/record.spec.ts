import * as _ from 'lodash';
import * as chai from 'chai';
import {IRecord, Record} from '../../../src/core/resource/record/record';
import {RankData} from '../../mock/rank.data';
import {HeroData, IHeroRecord} from '../../mock/hero.data';
import {Store} from '../../../src/core/store/store';
import {MockAdapter} from '../../mock/mock.adapter';

// Bootstrap
const store = new Store();
const heroData = new HeroData();
const rankData = new RankData();
const adapter = new MockAdapter(heroData.db, rankData.db);
store.setup([
  {schema: heroData.schema, adapter: adapter},
  {schema: rankData.schema, adapter: adapter},
]);
const heroResource = store.getResource <IHeroRecord>(heroData.schema.identity);

const dummyHero = heroResource.createRecord({});
const deadpoolHero = heroResource.createRecord(heroData.deadpool);
const supermanHero = heroResource.createRecord(heroData.db[0]);
const expect = chai.expect;

beforeEach(() => {
  adapter.heroes = [...heroData.db];
  adapter.ranks = [...rankData.db];
});

describe("Record", () => {
  it('should match heroSchema properties', () => {
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
    expect(deadpoolHero).to.have.property("name").that.equals(heroData.deadpool["name"]);
    expect(deadpoolHero).to.have.property("powers").that.equals(heroData.deadpool["powers"]);
    expect(deadpoolHero).to.have.property("colors").that.equals(heroData.deadpool["colors"]);
  });

  it('should handle default value', () => {
    expect(dummyHero.name).to.equal(heroData.schema.properties["name"].defaultsTo);
  });

  it('should return only the properties values', () => {
    expect(_.omit(deadpoolHero.toJSON(), ["id"])).to.deep.equal(_.omit(heroData.deadpool, ["id"]));
  });
});
