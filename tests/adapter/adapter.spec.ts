import * as _ from 'lodash';
import * as chai from 'chai';
import {Request} from '../../src/core/adapter/request';
import {IResponse} from '../../src/core/adapter/response';
import {MockAdapter} from '../mock/mock.adapter';
import {IHeroRecord, HeroData} from '../mock/hero.data';
import {Store} from '../../src/core/store/store';
import {RankData} from '../mock/rank.data';

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
const heroResource = store.getResource(heroData.schema.identity);

beforeEach(() => {
  adapter.heroes = [...heroData.db];
});

describe("Adapter", () => {
  it("should create data entry", (done) => {
    const numHeroes = adapter.heroes.length;
    const request = new Request({data: heroData.deadpool});
    adapter.create(heroResource, request)
      .then((response: IResponse) => {
        const hero = <IHeroRecord> response.data;
        expect(_.omit(hero, ["id"])).to.deep.equal(_.omit(request.data, ["id"]));
        expect(adapter.heroes.length).to.equal(numHeroes + 1);
        done();
      });
  });

  it("should populate a created data entry", (done) => {
    const request = new Request({data: heroData.deadpool, populate: ["rank"]});
    adapter.create(heroResource, request)
      .then((response: IResponse) => {
        const hero = <IHeroRecord> response.data;
        expect(hero.rank.id).to.deep.equal(heroData.deadpool.rankId);
        done();
      });
  });

  it("should find a single result", (done) => {
    const criteria = (hero) => _.indexOf(hero.colors, "red") > -1;
    const request = new Request({criteria: criteria});
    adapter.findOne(heroResource, request)
      .then((response: IResponse) => {
        const hero = <IHeroRecord> response.data;
        expect(hero).to.be.an("object");
        expect(hero).to.have.property("colors").that.contains("red");
        done();
      });
  });

  it("should populate a found result", (done) => {
    const criteria = (hero) => _.indexOf(hero.colors, "red") > -1;
    const request = new Request({criteria: criteria, populate: ["rank"]});
    adapter.findOne(heroResource, request)
      .then((response: IResponse) => {
        const hero = <IHeroRecord> response.data;
        expect(hero.rank.id).to.deep.equal(_.find(heroData.db, criteria).rankId);
        done();
      });
  });

  it("should find some results", (done) => {
    const criteria = (hero) => _.indexOf(hero.colors, "red") > -1;
    const request = new Request({criteria: criteria});
    adapter.find(heroResource, request)
      .then((response: IResponse) => {
        const heroes = <Array<IHeroRecord>> response.data;
        expect(heroes).to.be.an("array").with.length.above(0);
        expect(heroes[0]).to.have.property("colors").that.contains("red");
        done();
      });
  });

  it("should populate some found results", (done) => {
    const criteria = (hero) => _.indexOf(hero.colors, "red") > -1;
    const request = new Request({criteria: criteria, populate: ["rank"]});
    adapter.find(heroResource, request)
      .then((response: IResponse) => {
        const heroes = <Array<IHeroRecord>> response.data;
        _.forEach(heroes, (hero) => {
          expect(hero.rank.id).not.to.be.undefined;
          expect(hero.rankId).to.equal(hero.rank.id);
        });
        done();
      });
  });

  it("should save an entry", (done) => {
    const hero = _.cloneDeep(adapter.heroes[0]);
    const criteria = {"name": hero.name};
    hero.name = "clark kent";
    const request = new Request({
      data: hero,
      criteria: criteria
    });
    adapter.save(heroResource, request)
      .then((response: IResponse) => {
        const newHero = response.data;
        expect(newHero).to.not.be.undefined;
        expect(newHero).to.have.property("name").that.equal("clark kent");
        done();
      });
  });

  it("should populate a saved entry", (done) => {
    const hero = _.cloneDeep(adapter.heroes[0]);
    const criteria = {"name": hero.name};
    hero.name = "clark kent";
    const request = new Request({
      data: hero,
      criteria: criteria,
      populate: ["rank"]
    });
    adapter.save(heroResource, request)
      .then((response: IResponse) => {
        const newHero = <IHeroRecord> response.data;
        expect(newHero.rank.id).to.deep.equal(_.find(heroData.db, criteria).rankId);
        done();
      });
  });

  it("should destroy an entry", (done) => {
    const numHeroes = adapter.heroes.length;
    const hero = _.cloneDeep(adapter.heroes[0]);
    const criteria = {"name": hero.name};
    const request = new Request({criteria: criteria});
    adapter.destroy(heroResource, request)
      .then((response: IResponse) => {
        const deletedHero = response.data;
        expect(deletedHero).to.not.be.undefined;
        expect(deletedHero).to.have.property("name").that.equal(hero.name);
        expect(adapter.heroes.length + 1).to.equal(numHeroes);
        done();
      });
  });

  it("should populate a destroyed entry", (done) => {
    const hero = _.cloneDeep(adapter.heroes[0]);
    const criteria = {"name": hero.name};
    const request = new Request({criteria: criteria, populate: ["rank"]});
    adapter.destroy(heroResource, request)
      .then((response: IResponse) => {
        const deletedHero = <IHeroRecord> response.data;
        expect(deletedHero.rank.id).to.deep.equal(_.find(heroData.db, criteria).rankId);
        done();
      });
  });
});
