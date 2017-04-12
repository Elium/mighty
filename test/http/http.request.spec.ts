import * as chai from 'chai'
import {HttpRequest} from '../../src/http/http.request'

const expect = chai.expect

const requestLike = {
  url: "/hello",
  data: {a: 1},
  criteria: {b: 2},
  method: "PLOP",
  isArray: false,
  headers: {"toto": "tutu"},
  params: {a: "1"}
}

describe("Http Request", () => {
  it(`should merge a HttpRequest like object`, () => {
    const request = new HttpRequest(requestLike);
    ["url", "data", "criteria", "method", "isArray", "headers", "params"].forEach((prop) => {
      expect(request[prop]).to.deep.equal(requestLike[prop])
    })
  })
  
  it(`should only merge defined property`, () => {
    const request = new HttpRequest({url: "/hello", params: null})
    expect(request.url).to.equal("/hello")
    expect(request.method).to.deep.equal(request.method)
    expect(request.data).to.equal(request.data)
    expect(request.params).to.deep.equal(request.params)
  })
})
