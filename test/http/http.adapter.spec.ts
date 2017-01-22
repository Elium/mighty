import * as chai from 'chai'
import * as _ from 'lodash'
import {HeroData, IHero, HeroResource} from '../mock/hero.data'
import {HttpAdapter} from '../../src/http/http.adapter'
import {MockLayer} from '../mock/mock.layer'

const expect = chai.expect
const resource = new HeroResource()
const heroData = new HeroData()
const heroLayer = new MockLayer(_.cloneDeep(heroData.db))
const adapter = new HttpAdapter('', heroLayer)

beforeEach(() => {
  heroLayer.rows = _.cloneDeep(heroData.db)
})

describe("Http Adapter", () => {
  it('should be hookable', () => {
    expect(adapter.addHook).not.to.be.undefined
    expect(adapter.removeHook).not.to.be.undefined
    expect(adapter.applyHook).not.to.be.undefined
  })
  
  it("should create a record", (done) => {
    adapter.create(resource, {data: heroData.deadpool})
      .subscribe((response) => {
        const hero = response.data
        Object.keys(_.omit(heroData.deadpool, ["id"])).forEach((key) => {
          expect(hero).to.have.property(key).that.deep.equal(heroData.deadpool[key])
        })
        done()
      })
  })
  
  it("should find a record", (done) => {
    const source = heroData.db[0]
    adapter.findOne(resource, {criteria: {id: source.id}})
      .subscribe((response) => {
        const hero = <IHero> response.data
        Object.keys(source).forEach((key) => {
          expect(hero).to.have.property(key).that.deep.equal(source[key])
        })
        done()
      })
  })
  
  it("should find a list of records", (done) => {
    const criteria = (hero) => hero.colors.indexOf("red") > -1
    adapter.find(resource, {criteria: criteria})
      .subscribe((response) => {
        const heroes = <Array<IHero>> response.data
        expect(Array.isArray(heroes)).to.be.true
        expect(heroes.length).to.be.above(0)
        done()
      })
  })
  
  it("should save a record", (done) => {
    const copy = _.cloneDeep(heroData.db[0])
    copy.name = "Cyclop"
    adapter.save(resource, {data: copy})
      .subscribe((response) => {
        const hero = <IHero> response.data
        expect(hero.name).to.equal(copy.name)
        done()
      })
  })
  
  it("should delete a record", (done) => {
    const source = heroData.db[0]
    const sourcesLength = heroLayer.rows.length
    adapter.destroy(resource, {criteria: {id: source.id}})
      .subscribe((response) => {
        const hero = <IHero> response.data
        expect(hero.id).to.equal(source.id)
        expect(heroLayer.rows.length).to.equal(sourcesLength - 1)
        done()
      })
  })
})
