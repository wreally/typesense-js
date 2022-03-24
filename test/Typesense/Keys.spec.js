import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { Client as TypesenseClient } from '../../src/Typesense'
import ApiCall from '../../src/Typesense/ApiCall'
import axios from 'axios'
import MockAxiosAdapter from 'axios-mock-adapter'

let expect = chai.expect
chai.use(chaiAsPromised)

describe('Keys', function () {
  let typesense
  let keys
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
    keys = typesense.keys()
    apiCall = new ApiCall(typesense.configuration)
    mockAxios = new MockAxiosAdapter(axios)
  })

  describe('.create', function () {
    it('creates a key', function (done) {
      mockAxios
        .onPost(
          apiCall.uriFor('/keys', typesense.configuration.nodes[0]),
          {
            description: 'Search-only key.',
            actions: ['documents:search'],
            collections: ['*']
          },
          {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
          }
        )
        .reply(201, '{}', { 'content-type': 'application/json' })

      let returnData = keys.create({
        description: 'Search-only key.',
        actions: ['documents:search'],
        collections: ['*']
      })

      expect(returnData).to.eventually.deep.equal({}).notify(done)
    })
  })

  describe('.retrieve', function () {
    it('retrieves all keys', function (done) {
      mockAxios
        .onGet(apiCall.uriFor('/keys', typesense.configuration.nodes[0]), undefined, {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
        })
        .reply(200, '[]', { 'content-type': 'application/json' })

      let returnData = keys.retrieve()

      expect(returnData).to.eventually.deep.equal([]).notify(done)
    })
  })

  describe('.generateScopedSearchKey', function () {
    it('returns a scoped search key', function (done) {
      // The following keys were generated and verified to work with an actual Typesense server
      // We're only verifying that the algorithm works as expected client-side
      const searchKey = 'RN23GFr1s6jQ9kgSNg2O7fYcAUXU7127'
      const scopedSearchKey =
        'SC9sT0hncHFwTHNFc3U3d3psRDZBUGNXQUViQUdDNmRHSmJFQnNnczJ4VT1STjIzeyJmaWx0ZXJfYnkiOiJjb21wYW55X2lkOjEyNCJ9'
      const result = keys.generateScopedSearchKey(searchKey, { filter_by: 'company_id:124' })

      expect(result).to.equal(scopedSearchKey)
      done()
    })
  })
})
