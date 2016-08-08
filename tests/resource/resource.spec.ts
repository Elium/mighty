import * as _ from 'lodash';
import * as chai from 'chai';
import {IRecord} from '../../src/core/resource/record/record';
import {Request} from '../../src/core/adapter/request';
import {MockAdapter} from '../mock/mock.adapter';
import {RankData} from '../mock/rank.data';
import {HeroData, IHero, IHeroRecord} from '../mock/hero.data';
import {Store} from '../../src/core/store/store';

const expect = chai.expect;

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

beforeEach(() => {
  adapter.heroes = [...heroData.db];
});

describe("Resource", () => {
  // TODO See what we can do with proper static object declaration (another PR).
  // it("should override the default Record constructor", () => {
  //   const deadpool = heroResource.createRecord(heroData.deadpool);
  //   expect(deadpool).to.be.instanceOf(HeroRecord);
  // });

  it("should create a record locally", () => {
    const deadpool = heroResource.createRecord(heroData.deadpool);
    checkRecordProperties(heroData.deadpool, deadpool);
  });

  it("should populate a locally created record", () => {
    const rank = rankData.db[0];
    const hero = _.cloneDeep(heroData.deadpool);
    hero.rank = _.cloneDeep(rank);
    hero.rankId = rank.id;
    const deadpool = heroResource.createRecord(hero);
    expect(deadpool.rank.id).to.deep.equal(rank.id);
    expect(deadpool.rankId).to.deep.equal(rank.id);
  });

  it("should create a record remotely", (done) => {
    heroResource.create(new Request({data: heroData.deadpool}))
      .then((deadpool) => {
        checkRecordProperties(heroData.deadpool, deadpool);
        done();
      });
  });

  it("should populate a remotelly created record", (done) => {
    heroResource.create(new Request({data: heroData.deadpool, populate: ["rank"]}))
      .then((deadpool) => {
        expect(deadpool.rank).not.to.be.undefined;
        expect(deadpool.rank.id).to.equal(heroData.deadpool.rankId);
        expect(deadpool.rankId).to.equal(heroData.deadpool.rankId);
        done();
      });
  });

  it("should find a single result remotely", (done) => {
    heroResource
      .findOne(new Request({criteria: hero => _.findIndex(hero.colors, "red")}))
      .then((hero) => {
        expect(hero).to.not.be.undefined;
        expect(hero).to.have.property("colors").that.contains("red");
        done();
      });
  });

  it("should populate a remotely found single result", (done) => {
    const criteria = hero => _.findIndex(hero.colors, "red");
    heroResource
      .findOne(new Request({criteria: criteria, populate: ["rank"]}))
      .then((hero) => {
        const matchingHero = <IHero> _.find(heroData.db, criteria);
        expect(hero.rank).not.to.be.undefined;
        expect(hero.rank.id).to.equal(matchingHero.rankId);
        expect(hero.rankId).to.equal(matchingHero.rankId);
        done();
      });
  });

  it("should find some results remotely", (done) => {
    heroResource
      .find(new Request({criteria: hero => _.findIndex(hero.colors, "red")}))
      .then((heroes) => {
        expect(heroes).to.not.be.undefined;
        expect(heroes.length).to.be.above(0);
        done();
      });
  });

  it("should populate some remotely found results", (done) => {
    const criteria = hero => _.findIndex(hero.colors, "red");
    heroResource
      .find(new Request({criteria: criteria, populate: ["rank"]}))
      .then((heroes) => {
        const matchingHeroes = <Array<IHero>> _.filter(heroData.db, criteria);
        matchingHeroes.forEach((matchingHero) => {
          const hero = <IHeroRecord> _.find(heroes, {name: matchingHero.name});
          expect(hero.rank).not.to.be.undefined;
          expect(hero.rank.id).to.equal(matchingHero.rankId);
          expect(hero.rankId).to.equal(matchingHero.rankId);
        });
        done();
      });
  });

  it("should save an entry remotely", (done) => {
    const origin: IHero = _.find(adapter.heroes, {name: "superman"});
    const superman: IHero = <IHero> _.extend({}, origin);
    superman.colors = [...superman.colors, "pink"];
    heroResource
      .save(new Request({data: superman, criteria: {id: superman.id}}))
      .then((zuperman) => {
        expect(zuperman).to.have.property("id").that.equals(superman.id);
        expect(zuperman).to.have.property("colors").that.have.lengthOf(origin.colors.length + 1);
        done();
      });
  });

  it("should populate a remotely saved entry", (done) => {
    const origin: IHero = _.find(adapter.heroes, {name: "superman"});
    const superman: IHero = <IHero> _.extend({}, origin);
    superman.colors = [...superman.colors, "pink"];
    heroResource
      .save(new Request({data: superman, criteria: {id: superman.id}, populate: ["rank"]}))
      .then((zuperman) => {
        expect(zuperman.rank).not.to.be.undefined;
        expect(zuperman.rank.id).to.equal(origin.rankId);
        expect(zuperman.rankId).to.equal(origin.rankId);
        done();
      });
  });

  it("should destroy an entry remotely", (done) => {
    const numHeroes: number = adapter.heroes.length;
    const superman: IHero = _.find(adapter.heroes, {name: "superman"});
    heroResource
      .destroy(new Request({criteria: {id: superman.id}, populate: ["rank"]}))
      .then(() => {
        expect(adapter.heroes.length).to.be.below(numHeroes);
        done();
      });
  });

  it("should populate a remotely destroyed entry", (done) => {
    const superman: IHero = _.find(adapter.heroes, {name: "superman"});
    heroResource
      .destroy(new Request({criteria: {id: superman.id}, populate: ["rank"]}))
      .then((hero) => {
        expect(hero.rank).not.to.be.undefined;
        expect(hero.rank.id).to.equal(superman.rankId);
        expect(hero.rankId).to.equal(superman.rankId);
        done();
      });
  });
});

function checkRecordProperties(origin: IHero, record: IRecord) {
  _(record.properties)
    .filter((prop, key) => key !== "id")
    .forEach((property) => {
      expect(property.value).to.deep.equal(origin[property.name]);
    });
}
