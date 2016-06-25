import * as _ from "lodash";
import * as chai from "chai";
import * as HeroesData from "../hero.data";
import {Request} from "../../src/core/adapter/request";
import {IResponse} from "../../src/core/adapter/response";
import {IHeroAdapter} from "../hero.adapter";
import {resource as heroResource} from "../hero.resource";

const expect = chai.expect;
const adapter: IHeroAdapter = <IHeroAdapter> heroResource.adapter;

beforeEach(() => {
  adapter.heroes = [...HeroesData.db];
});

describe("Adapter", () => {
  it("should create data entry", () => {
    const numHeroes = adapter.heroes.length;
    const request = new Request({data: HeroesData.deadpool});
    return adapter.create(heroResource, request)
      .then((response: IResponse) => {
        const hero = response.data;
        expect(hero).to.deep.equal(request.data);
        expect(adapter.heroes.length).to.equal(numHeroes + 1);
      });
  });

  it("should find a single result", (done) => {
    const criteria = (hero) => _.indexOf(hero.colors, "red") > -1;
    const request = new Request({criteria: criteria});
    adapter.findOne(heroResource, request)
      .then((response: IResponse) => {
        const hero = response.data;
        expect(hero).to.be.an("object");
        expect(hero).to.have.property("colors").that.contains("red");
        done();
      });
  });

  it("should find some results", (done) => {
    const criteria = (hero) => _.indexOf(hero.colors, "red") > -1;
    const request = new Request({criteria: criteria});
    adapter.find(heroResource, request)
      .then((response: IResponse) => {
        const heroes = response.data;
        expect(heroes).to.be.an("array").with.length.above(0);
        expect(heroes[0]).to.have.property("colors").that.contains("red");
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
});
