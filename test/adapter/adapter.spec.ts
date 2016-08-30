import * as _ from 'lodash';
import * as chai from 'chai';
import {Request} from '../../src/adapter/request';
import {IResponse} from '../../src/adapter/response';
import {MockAdapter} from '../mock/mock.adapter';
import {HeroData, HeroRecord, IHero} from '../mock/hero.data';
import {Resource} from '../../src/resource/resource';
import {IRecord} from '../../src/resource/record';

const expect = chai.expect;
const heroData = new HeroData();
const adapter = new MockAdapter(heroData.db);
const heroResource = new Resource("heroes", HeroRecord, adapter);

beforeEach(() => {
  adapter.heroes = [...heroData.db];
});

describe("Adapter", () => {
  it("should create data entry", (done) => {
    const numHeroes = adapter.heroes.length;
    const request = new Request({data: heroData.deadpool});
    adapter.create(heroResource, request)
      .then((response: IResponse) => {
        const hero = <IHero & IRecord> response.data["subKey"];
        expect(_.omit(hero, ["id"])).to.deep.equal(_.omit(request.data, ["id"]));
        expect(adapter.heroes.length).to.equal(numHeroes + 1);
        done();
      });
  });
  
  it("should find a single result", (done) => {
    const criteria = (hero) => _.indexOf(hero.colors, "red") > -1;
    const request = new Request({criteria: criteria});
    adapter.findOne(heroResource, request)
      .then((response: IResponse) => {
        const hero = <IHero & IRecord> response.data["subKey"];
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
        const heroes = <Array<IHero & IRecord>> response.data["subKey"];
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
        const newHero = response.data["subKey"];
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
        const deletedHero = response.data["subKey"];
        expect(deletedHero).to.not.be.undefined;
        expect(deletedHero).to.have.property("name").that.equal(hero.name);
        expect(adapter.heroes.length + 1).to.equal(numHeroes);
        done();
      });
  });
});
