import * as _ from "lodash";
import * as chai from "chai";
import {resource as heroResource} from "../hero.resource";
import * as HeroesData from "../hero.data";
import {IRecord} from "../../core/resource/record/record";
import {IHeroAdapter} from "../hero.adapter";
import {ICollection} from "../../core/collection/collection";
import {IMap} from "../../common/utils/map";

const expect = chai.expect;
const adapter: IHeroAdapter = <IHeroAdapter> heroResource.adapter;

beforeEach(() => {
  adapter.heroes = [...HeroesData.db];
});

describe("Resource", () => {
  it("should create a record locally", () => {
    const deadpool: IRecord = heroResource.createRecord(HeroesData.deadpool);
    checkRecord(HeroesData.deadpool, deadpool);
  });

  it("should create a record remotely", (done) => {
    heroResource.create({data: HeroesData.deadpool})
      .then((deadpool: IRecord) => {
        checkRecord(HeroesData.deadpool, deadpool);
        done();
      });
  });

  it("should find some results remotely", (done) => {
    heroResource
      .find((hero) => {
        return _.findIndex(hero.colors, "red");
      })
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
      .save({
        data: superman,
        criteria: {id: superman.id}
      })
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
      .destroy({criteria: {id: superman.id}})
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
