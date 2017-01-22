import * as _ from 'lodash';
import * as chai from 'chai';
import {HeroData, Hero, IHero} from '../../mock/hero.data';
import {MockAdapter} from '../../mock/mock.adapter';
import {Resource} from '../../../src/core/resource/resource';

const expect = chai.expect;
const heroData = new HeroData();
const adapter = new MockAdapter(heroData.db);
const heroResource = new Resource("heroes", Hero);

beforeEach(() => {
  adapter.heroes = [...heroData.db];
});

describe("Resource", () => {

  it('should be hookable', () => {
    expect(heroResource.addHook).not.to.be.undefined;
    expect(heroResource.removeHook).not.to.be.undefined;
    expect(heroResource.applyHook).not.to.be.undefined;
  });

  it("should create a record locally", () => {
    const deadpool = heroResource.createRecord(heroData.deadpool);
    checkRecordProperties(heroData.deadpool, deadpool);
  });

  it("should return an empty result", (done) => {
    heroResource
      .findOne(adapter, {criteria: {unkownKey: 1}})
      .subscribe((hero) => {
        expect(hero).to.be.null;
        done();
      });
  });

  it("should create a record remotely", (done) => {
    heroResource.create(adapter, {data: heroData.deadpool})
      .subscribe((deadpool) => {
        checkRecordProperties(heroData.deadpool, deadpool);
        done();
      });
  });

  it("should find a single result remotely", (done) => {
    heroResource
      .findOne(adapter, {criteria: hero => _.findIndex(hero.colors, "red")})
      .subscribe((hero) => {
        expect(hero).to.not.be.undefined;
        expect(hero).to.have.property("colors").that.contains("red");
        done();
      });
  });

  it("should find some results remotely", (done) => {
    heroResource
      .find(adapter, {criteria: hero => _.findIndex(hero.colors, "red")})
      .subscribe((heroes) => {
        expect(heroes).to.not.be.undefined;
        expect(heroes.length).to.be.above(0);
        done();
      });
  });

  it("should save an entry remotely", (done) => {
    const origin: IHero = _.find(adapter.heroes, {name: "superman"});
    const superman: IHero = <IHero> _.extend({}, origin);
    superman.colors = [...superman.colors, "pink"];
    heroResource
      .save(adapter, {data: superman, criteria: {id: superman.id}})
      .subscribe((zuperman) => {
        expect(zuperman).to.have.property("id").that.equals(superman.id);
        expect(zuperman).to.have.property("colors").that.have.lengthOf(origin.colors.length + 1);
        done();
      });
  });

  it("should destroy an entry remotely", (done) => {
    const numHeroes: number = adapter.heroes.length;
    const superman: IHero = _.find(adapter.heroes, {name: "superman"});
    heroResource
      .destroy(adapter, {criteria: {id: superman.id}})
      .subscribe(() => {
        expect(adapter.heroes.length).to.be.below(numHeroes);
        done();
      });
  });
});

function checkRecordProperties(origin: IHero, record: IHero) {
  expect(record.name).to.deep.equal(origin.name);
  expect(record.colors).to.deep.equal(origin.colors);
  expect(record.powers).to.deep.equal(origin.powers);
  expect(record.rankId).to.deep.equal(origin.rankId);
}
