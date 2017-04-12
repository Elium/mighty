import * as chai from 'chai'
import {Observable} from 'rxjs/Observable'
import 'rxjs/observable/of'
import {Hook, Hookable} from '../../../src/core/utils/hook'

const expect = chai.expect
let hookable: Hookable

describe('Hook', () => {
  
  describe('add', () => {
    it('should add a hook', () => {
      hookable = new Hookable()
      hookable.addHook(new Hook('test', null))
      expect(hookable.hooks.length).to.equal(1)
    })
    
    it('should not add a hook if there is an existing hook with the same name', () => {
      hookable = new Hookable()
      hookable.addHook(new Hook('test', null))
      hookable.addHook(new Hook('test', null))
      expect(hookable.hooks.length).to.equal(1)
    })
  })
  
  describe('remove', () => {
    it('should remove a hook', () => {
      hookable = new Hookable()
      const hook = new Hook('test', null)
      hookable.addHook(hook)
      expect(hookable.hooks.length).to.equal(1)
      hookable.removeHook(hook)
      expect(hookable.hooks.length).to.equal(0)
    })
  })
  
  describe('apply', () => {
    it('should apply a hook', (done) => {
      hookable = new Hookable()
      hookable.addHook(new Hook('test', (input: number) => Observable.of(input + 1)))
      hookable.applyHook('test', 1)
        .subscribe(output => {
          expect(output).to.equal(2)
          done()
        })
    })
    
    it('should return the input if no hook exists', (done) => {
      hookable = new Hookable()
      hookable.applyHook('test', 1)
        .subscribe(output => {
          expect(output).to.equal(1)
          done()
        })
    })
    
    it('should return the input if the hook map function is not defined', (done) => {
      hookable = new Hookable()
      hookable.addHook(new Hook('test', null))
      hookable.applyHook('test', 1)
        .subscribe(output => {
          expect(output).to.equal(1)
          done()
        })
    })
  })
})
