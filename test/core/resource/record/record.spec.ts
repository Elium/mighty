import * as _ from 'lodash'
import * as chai from 'chai'
import {HeroData, Hero} from '../../../mock/hero.data'
import {MockAdapter} from '../../../mock/mock.adapter'
import {Resource} from '../../../../src/core/resource/resource'

const expect = chai.expect
const heroData = new HeroData()
const adapter = new MockAdapter(heroData.db)
const heroResource = new Resource("heroes", Hero)
const deadpoolHero = heroResource.createRecord(heroData.deadpool)

beforeEach(() => {
  adapter.heroes = [...heroData.db]
})

describe("Record", () => {
  it('should parse an init object', () => {
    expect(deadpoolHero).to.have.property("name").that.equals(heroData.deadpool["name"])
    expect(deadpoolHero).to.have.property("powers").that.equals(heroData.deadpool["powers"])
    expect(deadpoolHero).to.have.property("colors").that.equals(heroData.deadpool["colors"])
  })
  
  it('should export to json', () => {
    expect(_.omit(deadpoolHero.toJSON(), ["id"])).to.deep.equal(_.omit(heroData.deadpool.toJSON(), ["id"]))
  })
})
