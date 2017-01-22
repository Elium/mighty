import * as _ from 'lodash'
import * as chai from 'chai'
import {HeroData, Hero} from '../mock/hero.data'
import {HttpLayer} from '../../src/http/layers/http.layer'
import {RestAdapter} from '../../src/http/rest.adapter'
import {server} from '../mock/server'
import {Resource} from '../../src/core/resource/resource'
import {IHttpRequest, HttpRequest} from '../../src/http/http.request'
import {IHttpResponse} from '../../src/http/http.response'

import 'rxjs/add/operator/do'
import 'rxjs/add/operator/catch'

const expect = chai.expect

let url
let adapter
const heroData = new HeroData()
const layer = new HttpLayer()
const resource = new Resource("heroes", Hero)
const deadpoolCreateRequest: IHttpRequest = new HttpRequest({data: heroData.deadpool})

let deadpoolResponse: IHttpResponse

describe("Http layer", () => {
  
  before((done) => {
    server.start((error) => {
      if (error) {
        throw error
      }
      url = server.info.uri
      adapter = new RestAdapter(url, layer)
      done()
    })
  })
  
  after((done) => {
    server.stop({timeout: 0}, () => {
      done()
    })
  })
  
  beforeEach((done) => {
    adapter.create(resource, deadpoolCreateRequest)
      .subscribe((response: IHttpResponse) => {
        deadpoolResponse = response
        done()
      })
  })
  
  it(`should create a record`, () => {
    checkHero(heroData.deadpool, deadpoolResponse.data)
  })
  
  it(`should return a response with the original request inside`, (done) => {
    const getUrl = `${url}/${resource.identity}/${deadpoolResponse.data["id"]}`
    layer.findOne({url: getUrl, method: "GET"})
      .subscribe((response) => {
        expect(response.request).not.to.be.undefined
        done()
      })
  })
  
  it(`should find a record when id is within the criteria`, (done) => {
    adapter.findOne(resource, {criteria: {id: deadpoolResponse.data["id"]}})
      .subscribe((response: IHttpResponse) => {
        checkHero(heroData.deadpool, response.data)
        done()
      })
  })
  
  it(`should find a record when id is within the data`, (done) => {
    adapter.findOne(resource, {data: deadpoolResponse.data})
      .subscribe((response: IHttpResponse) => {
        checkHero(heroData.deadpool, response.data)
        done()
      })
  })
  
  it(`should get all records`, (done) => {
    adapter.find(resource, {})
      .subscribe((response: IHttpResponse) => {
        expect(_.isArray(response.data)).to.be.true
        done()
      })
  })
  
  it(`should save a record when id is within the criteria`, (done) => {
    const request = {
      criteria: {id: deadpoolResponse.data["id"]},
      data: _.omit(_.extend(deadpoolResponse.data, {name: "lifepool"}), ["id"])
    }
    adapter.save(resource, request)
      .subscribe((response: IHttpResponse) => {
        const hero = response.data
        expect(hero).not.to.be.undefined
        expect(hero).to.have.property("name").that.equals("lifepool")
        done()
      })
  })
  
  it(`should save a record when id is within the data`, (done) => {
    const request = {data: _.extend(deadpoolResponse.data, {name: "lifepool"})}
    adapter.save(resource, request)
      .subscribe((response: IHttpResponse) => {
        const hero = response.data
        expect(hero).not.to.be.undefined
        expect(hero).to.have.property("name").that.equals("lifepool")
        done()
      })
  })
  
  it(`should delete a record when id is within the criteria`, (done) => {
    adapter.destroy(resource, {criteria: {id: deadpoolResponse.data["id"]}})
      .flatMap((response: IHttpResponse) => adapter.findOne(resource, new HttpRequest({criteria: {id: response.data["id"]}})))
      .subscribe((response: IHttpResponse) => {
        expect(response.data).to.be.undefined
        done()
      })
  })
  
  it(`should delete a record when id is within the data`, (done) => {
    adapter.destroy(resource, {data: deadpoolResponse.data})
      .flatMap((response: IHttpResponse) => adapter.findOne(resource, new HttpRequest({data: response.data})))
      .subscribe((response: IHttpResponse) => {
        expect(response.data).to.be.undefined
        done()
      })
  })
})

function checkHero(originalHero, newHero) {
  expect(newHero).not.to.be.undefined
  expect(newHero).to.have.property("id").that.is.not.undefined
  expect(newHero).to.have.property("name").that.deep.equal(originalHero.name)
  expect(newHero).to.have.property("colors").that.deep.equal(originalHero.colors)
  expect(newHero).to.have.property("powers").that.deep.equal(originalHero.powers)
}
