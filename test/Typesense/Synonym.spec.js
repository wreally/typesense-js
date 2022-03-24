import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { Client as TypesenseClient } from '../../src/Typesense'
import ApiCall from '../../src/Typesense/ApiCall'
import axios from 'axios'
import MockAxiosAdapter from 'axios-mock-adapter'

let expect = chai.expect
chai.use(chaiAsPromised)

describe('Synonym', function () {
  let typesense
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

    synonym = typesense.collections('companies').synonyms('synonym-set-1')
    apiCall = new ApiCall(typesense.configuration)
    mockAxios = new MockAxiosAdapter(axios)
  })

  describe('.retrieve', function () {
    it('retreives the synonym with the given ID', function (done) {
      mockAxios
        .onGet(
          apiCall.uriFor('/collections/companies/synonyms/synonym-set-1', typesense.configuration.nodes[0]),
          undefined,
          {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
          }
        )
        .reply(200, '{}', { 'content-type': 'application/json' })

      let returnData = synonym.retrieve()
      expect(returnData).to.eventually.deep.equal({}).notify(done)
    })
  })

  describe('.delete', function () {
    it('deletes the synonym with the given ID', function (done) {
      mockAxios
        .onDelete(
          apiCall.uriFor('/collections/companies/synonyms/synonym-set-1', typesense.configuration.nodes[0]),
          undefined,
          {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
          }
        )
        .reply(200, '{}', { 'content-type': 'application/json' })

      let returnData = synonym.delete()

      expect(returnData).to.eventually.deep.equal({}).notify(done)
    })
  })
})
