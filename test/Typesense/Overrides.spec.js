import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { Client as TypesenseClient } from '../../src/Typesense'
import ApiCall from '../../src/Typesense/ApiCall'
import axios from 'axios'
import MockAxiosAdapter from 'axios-mock-adapter'

let expect = chai.expect
chai.use(chaiAsPromised)

describe('Overrides', function () {
  let typesense
  let overrides
  let override
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

    override = {
      id: 'lex-exact',
      rule: {
        query: 'lex luthor',
        match: 'exact'
      },
      includes: [{ id: '125', position: 1 }],
      excludes: [{ id: '124' }]
    }

    overrides = typesense.collections('companies').overrides()
    apiCall = new ApiCall(typesense.configuration)
    mockAxios = new MockAxiosAdapter(axios)
  })

  describe('.create', function () {
    it('creates the override in the collection', function (done) {
      mockAxios
        .onPut(
          apiCall.uriFor('/collections/companies/overrides/lex-exact', typesense.configuration.nodes[0]),
          override,
          {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
          }
        )
        .reply(201, JSON.stringify(override), { 'content-type': 'application/json' })

      let returnData = overrides.upsert('lex-exact', override)
      expect(returnData).to.eventually.deep.equal(override).notify(done)
    })
  })

  describe('.retrieve', function () {
    it('retrieves all overrides', function (done) {
      mockAxios
        .onGet(apiCall.uriFor('/collections/companies/overrides', typesense.configuration.nodes[0]), undefined, {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
        })
        .reply(200, JSON.stringify([override]), { 'content-type': 'application/json' })

      let returnData = overrides.retrieve()

      expect(returnData).to.eventually.deep.equal([override]).notify(done)
    })
  })
})
