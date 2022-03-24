import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { Client as TypesenseClient } from '../../src/Typesense'
import ApiCall from '../../src/Typesense/ApiCall'
import { ObjectUnprocessable } from '../../src/Typesense/Errors'
import axios from 'axios'
import MockAxiosAdapter from 'axios-mock-adapter'
import timekeeper from 'timekeeper'

let expect = chai.expect
chai.use(chaiAsPromised)

let sharedNodeSelectionBehavior = (method) => {
  it('does not retry when HTTPStatus >= 300 and HTTPStatus < 500', async function () {
    this.mockAxios
      .onAny(this.apiCall.uriFor('/', this.typesense.configuration.nodes[0]))
      .reply(409, JSON.stringify({ message: 'Already exists' }), { 'content-type': 'application/json' })
    this.mockAxios
      .onAny(this.apiCall.uriFor('/', this.typesense.configuration.nodes[1]))
      .reply(422, JSON.stringify({ message: 'Unprocessable' }), { 'content-type': 'application/json' })
    this.mockAxios
      .onAny(this.apiCall.uriFor('/', this.typesense.configuration.nodes[2]))
      .reply(500, JSON.stringify({ message: 'Error message' }), { 'content-type': 'application/json' })

    await expect(this.apiCall[method]('/')).to.eventually.be.rejectedWith(
      'Request failed with HTTP code 409 | Server said: Already exists'
    )
    await expect(this.apiCall[method]('/')).to.eventually.be.rejectedWith(ObjectUnprocessable)
    let requestHistory = this.mockAxios.history[method]
    expect(requestHistory.length).to.equal(2)
    expect(requestHistory[0].url).to.equal('http://node0:8108/')
    expect(requestHistory[1].url).to.equal('http://node1:7108/')
  })

  it('raises an error when no nodes are healthy', async function () {
    this.mockAxios
      .onAny(this.apiCall.uriFor('/', this.typesense.configuration.nodes[0]))
      .reply(500, JSON.stringify({ message: 'Error message' }), { 'content-type': 'application/json' })
    this.mockAxios
      .onAny(this.apiCall.uriFor('/', this.typesense.configuration.nodes[1]))
      .reply(500, JSON.stringify({ message: 'Error message' }), { 'content-type': 'application/json' })
    this.mockAxios
      .onAny(this.apiCall.uriFor('/', this.typesense.configuration.nodes[2]))
      .reply(500, JSON.stringify({ message: 'Error message' }), { 'content-type': 'application/json' })

    await expect(this.apiCall[method]('/')).to.eventually.be.rejectedWith(
      'Request failed with HTTP code 500 | Server said: Error message'
    )
    let requestHistory = this.mockAxios.history[method]
    expect(requestHistory.length).to.equal(4)
    expect(requestHistory[0].url).to.equal('http://node0:8108/')
    expect(requestHistory[1].url).to.equal('http://node1:7108/')
    expect(requestHistory[2].url).to.equal('http://node2:9108/')
    expect(requestHistory[3].url).to.equal('http://node0:8108/')
  })

  it('selects the next available node when there is a connection timeout', async function () {
    this.mockAxios.onAny(this.apiCall.uriFor('/', this.typesense.configuration.nodes[0])).timeout()
    this.mockAxios.onAny(this.apiCall.uriFor('/', this.typesense.configuration.nodes[1])).timeout()
    this.mockAxios
      .onAny(this.apiCall.uriFor('/', this.typesense.configuration.nodes[2]))
      .reply(200, JSON.stringify({ message: 'Success' }), { 'content-type': 'application/json' })

    await expect(this.apiCall[method]('/')).to.eventually.deep.equal({ message: 'Success' })
    let requestHistory = this.mockAxios.history[method]
    expect(requestHistory.length).to.equal(3)
    expect(requestHistory[0].url).to.equal('http://node0:8108/')
    expect(requestHistory[1].url).to.equal('http://node1:7108/')
    expect(requestHistory[2].url).to.equal('http://node2:9108/')
  })

  it('removes unhealthy nodes out of rotation, until threshold', async function () {
    this.mockAxios.onAny(this.apiCall.uriFor('/', this.typesense.configuration.nodes[0])).timeout()
    this.mockAxios.onAny(this.apiCall.uriFor('/', this.typesense.configuration.nodes[1])).timeout()
    this.mockAxios
      .onAny(this.apiCall.uriFor('/', this.typesense.configuration.nodes[2]))
      .reply(200, JSON.stringify({ message: 'Success' }), { 'content-type': 'application/json' })

    let currentTime = Date.now()
    timekeeper.freeze(currentTime)
    await this.apiCall[method]('/') // Node 0 and Node 1 are marked as unhealthy after this, request should have been made to Node 2
    await this.apiCall[method]('/') // Request should have been made to Node 2
    await this.apiCall[method]('/') // Request should have been made to Node 2

    timekeeper.freeze(currentTime + 5 * 1000)
    await this.apiCall[method]('/') // Request should have been made to Node 2

    timekeeper.freeze(currentTime + 65 * 1000)
    await this.apiCall[method]('/') // Request should have been made to Node 2, since Node 0 and Node 1 are still unhealthy, though they were added back into rotation after the threshold

    // Remove first mock, to let request to node 0 succeed
    this.mockAxios.handlers[method].shift()
    this.mockAxios
      .onAny(this.apiCall.uriFor('/', this.typesense.configuration.nodes[0]))
      .reply(200, JSON.stringify({ message: 'Success' }), { 'content-type': 'application/json' })

    timekeeper.freeze(currentTime + 125 * 1000)
    await this.apiCall[method]('/') // Request should have been made to Node 0, since it is now healthy and the unhealthy threshold was exceeded

    let requestHistory = this.mockAxios.history[method]
    expect(requestHistory.length).to.equal(10)

    expect(requestHistory[0].url).to.equal('http://node0:8108/')
    expect(requestHistory[1].url).to.equal('http://node1:7108/')
    expect(requestHistory[2].url).to.equal('http://node2:9108/')

    expect(requestHistory[3].url).to.equal('http://node2:9108/')

    expect(requestHistory[4].url).to.equal('http://node2:9108/')

    expect(requestHistory[5].url).to.equal('http://node2:9108/')

    expect(requestHistory[6].url).to.equal('http://node0:8108/')
    expect(requestHistory[7].url).to.equal('http://node1:7108/')
    expect(requestHistory[8].url).to.equal('http://node2:9108/')

    expect(requestHistory[9].url).to.equal('http://node0:8108/')

    timekeeper.reset()
  })

  describe('when a nearestNode is specified', function () {
    beforeEach(function () {
      this.typesense = new TypesenseClient({
        nearestNode: {
          host: 'nearestNode',
          port: '6108',
          protocol: 'http'
        },
        nodes: [
          {
            host: 'node0',
            port: '8108',
            protocol: 'http'
          },
          {
            host: 'node1',
            port: '7108',
            protocol: 'http'
          },
          {
            host: 'node2',
            port: '9108',
            protocol: 'http'
          }
        ],
        apiKey: 'abcd',
        logLevel: 'error',
        retryIntervalSeconds: 0.001 // To keep tests fast
      })
      this.mockAxios = new MockAxiosAdapter(axios)
      this.apiCall = new ApiCall(this.typesense.configuration)
    })

    it('uses the nearestNode if it is present and healthy, otherwise fallsback to regular nodes', async function () {
      this.mockAxios.onAny(this.apiCall.uriFor('/', this.typesense.configuration.nearestNode)).timeout()
      this.mockAxios.onAny(this.apiCall.uriFor('/', this.typesense.configuration.nodes[0])).timeout()
      this.mockAxios.onAny(this.apiCall.uriFor('/', this.typesense.configuration.nodes[1])).timeout()
      this.mockAxios
        .onAny(this.apiCall.uriFor('/', this.typesense.configuration.nodes[2]))
        .reply(200, JSON.stringify({ message: 'Success' }), { 'content-type': 'application/json' })

      let currentTime = Date.now()
      timekeeper.freeze(currentTime)
      await this.apiCall[method]('/') // Node nearestNode, Node 0 and Node 1 are marked as unhealthy after this, request should have been made to Node 2
      await this.apiCall[method]('/') // Request should have been made to Node 2
      await this.apiCall[method]('/') // Request should have been made to Node 2

      timekeeper.freeze(currentTime + 5 * 1000)
      await this.apiCall[method]('/') // Request should have been made to Node 2

      timekeeper.freeze(currentTime + 65 * 1000)
      await this.apiCall[method]('/') // Request should have been attempted to nearestNode, Node 0 and Node 1, but finally made to Node 2 (since disributedSearchNode, Node 0 and Node 1 are still unhealthy, though they were added back into rotation after the threshold)

      // Remove first mock, to let request to nearestNode succeed
      this.mockAxios.handlers[method].shift()
      this.mockAxios
        .onAny(this.apiCall.uriFor('/', this.typesense.configuration.nearestNode))
        .reply(200, JSON.stringify({ message: 'Success' }), { 'content-type': 'application/json' })

      timekeeper.freeze(currentTime + 125 * 1000)
      await this.apiCall[method]('/') // Request should have been made to nearestNode, since it is now healthy and the unhealthy threshold was exceeded
      await this.apiCall[method]('/') // Request should have been made to nearestNode, since no roundrobin if it is present and healthy
      await this.apiCall[method]('/') // Request should have been made to nearestNode, since no roundrobin if it is present and healthy

      let requestHistory = this.mockAxios.history[method]
      expect(requestHistory.length).to.equal(14)

      expect(requestHistory[0].url).to.equal('http://nearestNode:6108/')
      expect(requestHistory[1].url).to.equal('http://node0:8108/')
      expect(requestHistory[2].url).to.equal('http://node1:7108/')
      expect(requestHistory[3].url).to.equal('http://node2:9108/')

      expect(requestHistory[4].url).to.equal('http://node2:9108/')

      expect(requestHistory[5].url).to.equal('http://node2:9108/')

      expect(requestHistory[6].url).to.equal('http://node2:9108/')

      expect(requestHistory[7].url).to.equal('http://nearestNode:6108/')
      expect(requestHistory[8].url).to.equal('http://node0:8108/')
      expect(requestHistory[9].url).to.equal('http://node1:7108/')
      expect(requestHistory[10].url).to.equal('http://node2:9108/')

      expect(requestHistory[11].url).to.equal('http://nearestNode:6108/')

      expect(requestHistory[12].url).to.equal('http://nearestNode:6108/')

      expect(requestHistory[13].url).to.equal('http://nearestNode:6108/')

      timekeeper.reset()
    })

    it('raises an error when no nodes are healthy', async function () {
      this.mockAxios
        .onAny(this.apiCall.uriFor('/', this.typesense.configuration.nearestNode))
        .reply(500, JSON.stringify({ message: 'Error message' }), { 'content-type': 'application/json' })
      this.mockAxios
        .onAny(this.apiCall.uriFor('/', this.typesense.configuration.nodes[0]))
        .reply(500, JSON.stringify({ message: 'Error message' }), { 'content-type': 'application/json' })
      this.mockAxios
        .onAny(this.apiCall.uriFor('/', this.typesense.configuration.nodes[1]))
        .reply(500, JSON.stringify({ message: 'Error message' }), { 'content-type': 'application/json' })
      this.mockAxios
        .onAny(this.apiCall.uriFor('/', this.typesense.configuration.nodes[2]))
        .reply(500, JSON.stringify({ message: 'Error message' }), { 'content-type': 'application/json' })

      await expect(this.apiCall[method]('/')).to.eventually.be.rejectedWith(
        'Request failed with HTTP code 500 | Server said: Error message'
      )
      let requestHistory = this.mockAxios.history[method]
      expect(requestHistory.length).to.equal(5)
      expect(requestHistory[0].url).to.equal('http://nearestNode:6108/')
      expect(requestHistory[1].url).to.equal('http://node0:8108/')
      expect(requestHistory[2].url).to.equal('http://node1:7108/')
      expect(requestHistory[3].url).to.equal('http://node2:9108/')
      expect(requestHistory[4].url).to.equal('http://node0:8108/')
    })
  })
}

describe('ApiCall', function () {
  describe('Method Calls', function () {
    beforeEach(function () {
      this.typesense = new TypesenseClient({
        nodes: [
          {
            host: 'node0',
            port: '8108',
            protocol: 'http'
          },
          {
            host: 'node1',
            port: '7108',
            protocol: 'http'
          },
          {
            host: 'node2',
            port: '9108',
            protocol: 'http'
          }
        ],
        apiKey: 'abcd',
        logLevel: 'error',
        retryIntervalSeconds: 0.001 // To keep tests fast
      })
      this.mockAxios = new MockAxiosAdapter(axios)
      this.apiCall = new ApiCall(this.typesense.configuration)
    })

    describe('.post', function () {
      sharedNodeSelectionBehavior('post')
    })

    describe('.put', function () {
      sharedNodeSelectionBehavior('post')
    })

    describe('.get', function () {
      sharedNodeSelectionBehavior('post')
    })

    describe('.delete', function () {
      sharedNodeSelectionBehavior('post')
    })
  })

  describe('URL Construction', function () {
    it('constructs the URL based on the node params', function (done) {
      const client = new TypesenseClient({
        nodes: [
          {
            url: 'https://node0/path'
          }
        ],
        apiKey: 'abcd'
      })

      const apiCall = new ApiCall(client.configuration)

      expect(apiCall.uriFor('/collections', client.configuration.nodes[0])).to.equal('https://node0/path/collections')

      done()
    })
  })

  describe('Custom Headers', function () {
    it('passes on additional user-provided headers in the request', async function () {
      const client = new TypesenseClient({
        nodes: [
          {
            url: 'https://node0/path'
          }
        ],
        apiKey: 'abcd',
        additionalHeaders: {
          'x-header-name': 'value'
        }
      })

      this.mockAxios = new MockAxiosAdapter(axios)
      const apiCall = new ApiCall(client.configuration)

      this.mockAxios
        .onGet('https://node0/path/collections', null, {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'X-TYPESENSE-API-KEY': client.configuration.apiKey,
          'x-header-name': 'value'
        })
        .reply(200, JSON.stringify({}), { 'content-type': 'application/json' })

      // Will error out if request doesn't match the stub
      return apiCall.get('/collections', {})
    })
  })
})
