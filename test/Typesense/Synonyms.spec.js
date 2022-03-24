import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { Client as TypesenseClient } from '../../src/Typesense'
import ApiCall from '../../src/Typesense/ApiCall'
import axios from 'axios'
import MockAxiosAdapter from 'axios-mock-adapter'

let expect = chai.expect
chai.use(chaiAsPromised)

describe('Synonyms', function () {
  let typesense
  let synonyms
  let synonym
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

    synonyms = typesense.collections('companies').synonyms()
    apiCall = new ApiCall(typesense.configuration)
    mockAxios = new MockAxiosAdapter(axios)
  })

  describe('.create', function () {
    it('creates the synonym in the collection', function (done) {
      mockAxios
        .onPut(
          apiCall.uriFor('/collections/companies/synonyms/synonym-set-1', typesense.configuration.nodes[0]),
          synonym,
          {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
          }
        )
        .reply(201, '{}', { 'content-type': 'application/json' })

      let returnData = synonyms.upsert('synonym-set-1', {})
      expect(returnData).to.eventually.deep.equal({}).notify(done)
    })
  })

  describe('.retrieve', function () {
    it('retrieves all synonyms', function (done) {
      mockAxios
        .onGet(apiCall.uriFor('/collections/companies/synonyms', typesense.configuration.nodes[0]), undefined, {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
        })
        .reply(200, JSON.stringify([]), { 'content-type': 'application/json' })

      let returnData = synonyms.retrieve()

      expect(returnData).to.eventually.deep.equal([]).notify(done)
    })
  })
})
