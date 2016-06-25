import * as _ from "lodash";
import * as chai from "chai";
import * as HeroesData from "../hero.data";
import {IRecord} from "../../src/core/resource/record/record";
import {IHeroAdapter} from "../hero.adapter";
import {ICollection} from "../../src/core/collection/collection";
import {IMap} from "../../src/common/utils/map";
import {HeroRecord} from "../hero.record";
import {resource as heroResource} from "../hero.resource";
import {Request} from "../../src/core/adapter/request";

const expect = chai.expect;
const adapter: IHeroAdapter = <IHeroAdapter> heroResource.adapter;

beforeEach(() => {
  adapter.heroes = [...HeroesData.db];
});

describe("Resource", () => {
  it("should override the default Record constructor", () => {
    const deadpool: IRecord = heroResource.createRecord(HeroesData.deadpool);
    expect(deadpool).to.be.instanceOf(HeroRecord);
  });

  it("should create a record locally", () => {
    const deadpool: IRecord = heroResource.createRecord(HeroesData.deadpool);
    checkRecord(HeroesData.deadpool, deadpool);
  });

  it("should create a record remotely", (done) => {
    heroResource.create(new Request({data: {child: HeroesData.deadpool}}))
      .then((deadpool: IRecord) => {
        checkRecord(HeroesData.deadpool, deadpool);
        done();
      });
  });

  it("should find a single result remotely", (done) => {
    heroResource
      .findOne(new Request({criteria: hero => _.findIndex(hero.colors, "red")}))
      .then((hero: IRecord) => {
        expect(hero).to.not.be.undefined;
        expect(hero).to.have.property("colors").that.contains("red");
        done();
      });
  });

  it("should find some results remotely", (done) => {
    heroResource
      .find(new Request({criteria: hero => _.findIndex(hero.colors, "red")}))
      .then((heroes: ICollection<IRecord>) => {
        expect(heroes).to.not.be.undefined;
        expect(heroes.length).to.be.above(0);
        done();
      });
  });

  it("should save an entry remotely", (done) => {
    const origin: any = _.find(adapter.heroes, {name: "superman"});
    const superman: any = _.extend({}, origin);
    superman.colors = [...superman.colors, "pink"];
    heroResource
      .save(new Request({ data: {child: superman}, criteria: {id: superman.id}}))
      .then((zuperman: IRecord) => {
        expect(zuperman).to.not.deep.equal(superman);
        expect(zuperman).to.have.property("id").that.equals(superman.id);
        expect(zuperman).to.have.property("colors").that.have.lengthOf(origin.colors.length + 1);
        done();
      });
  });

  it("should destroy an entry remotely", (done) => {
    const numHeroes: number = adapter.heroes.length;
    const superman: any = _.find(adapter.heroes, {name: "superman"});
    heroResource
      .destroy(new Request({criteria: {id: superman.id}}))
      .then(() => {
        expect(adapter.heroes.length).to.be.below(numHeroes);
        done();
      });
  });
});

function checkRecord(origin: IMap<any>, record: IRecord) {
  _.forEach(record.properties, (property) => {
    expect(property.value).to.deep.equal(origin[property.name]);
  });
}
