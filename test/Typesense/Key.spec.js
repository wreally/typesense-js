import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { Client as TypesenseClient } from '../../src/Typesense'
import ApiCall from '../../src/Typesense/ApiCall'
import axios from 'axios'
import MockAxiosAdapter from 'axios-mock-adapter'

let expect = chai.expect
chai.use(chaiAsPromised)

describe('Key', function () {
  let typesense
  let key
  let apiCall
  let mockAxios
  beforeEach(function () {
    typesense = new TypesenseClient({
      nodes: [
        {
          host: 'node0',
          port: '8108',
          protocol: 'http'
        }
      ],
      apiKey: 'abcd'
    })
    key = typesense.keys('123')
    apiCall = new ApiCall(typesense.configuration)
    mockAxios = new MockAxiosAdapter(axios)
  })

  describe('.retrieve', function () {
    it('retrieves the key', function (done) {
      mockAxios
        .onGet(apiCall.uriFor('/keys/123', typesense.configuration.nodes[0]), null, {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
        })
        .reply(200, '{}', { 'content-type': 'application/json' })

      // console.log(mockAxios.handlers)

      let returnData = key.retrieve()

      expect(returnData).to.eventually.deep.equal({}).notify(done)
    })
  })

  describe('.delete', function () {
    it('deletes a key', function (done) {
      mockAxios
        .onDelete(apiCall.uriFor('/keys/123', typesense.configuration.nodes[0]), null, {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
        })
        .reply(200, {})

      let returnData = key.delete()

      expect(returnData).to.eventually.deep.equal({}).notify(done)
    })
  })
})
