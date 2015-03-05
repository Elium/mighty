# MJS

---

## Store

Global store object.

The store is an in memory data store, used to keep your data "alive" with consistency and uniqueness.

It allow you to define resources on the fly and to retrieve them.

Methods :

- defineResource
- getResource

---

## Resource

Base class for a model / resource.

The store keep in memory resources declarations as well as resources instances. A query language is used to manipulate the resource as follow.

Methods :

- create
- find
- findOne
- update
- destroy

---

## State

A state allow to use stateful programming.
It has a pre-hook and post-hook event as well as a list of substates to activate between the two hooks.

Example : a resource can have a **create** state. This state would provide a **preCreate** and a **postCreate** hook.

---

## Event Emitter / Listener

Agnostic event emitter / listener module.

---

## Protocol

Defines how the resource methods will be interpreted by the adapter.

A global store instance has a default protocol defined. But protocol can be overriden on resource level. 


---

## Adapter

Defines a functionnal way to retrieve data, ie. via HTTP, Parse, Firebase, etc.

### Adapter Formater

Allow to define customs ways to request data : ie. you can format your URI as you want.

### Adapter Parser

Defines how fetched data should be parsed.

---

## Schema

A schema defines how a model looks like. It will be used to declare typed variables, custom fonctions and validation rules.

---

## History

A resource instance has a history object. That way, a transactional way of handling the saves can be used (ie. commit, rollback).

---

## Command

A command is an atomic class that allow to store a command to run via its context.
Mainly used in histories.

---

## Promises

MJS embraces promises : everything should be asynchronous and none blocking.
The store should be able to register a promise object to allow different framework implementations.