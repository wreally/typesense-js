import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { Client as TypesenseClient } from '../../src/Typesense'
import ApiCall from '../../src/Typesense/ApiCall'
import axios from 'axios'
import MockAxiosAdapter from 'axios-mock-adapter'

let expect = chai.expect
chai.use(chaiAsPromised)

describe('Override', function () {
  let typesense
  let overrideData
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

    overrideData = {
      id: 'lex-exact',
      rule: {
        query: 'lex luthor',
        match: 'exact'
      },
      includes: [{ id: '125', position: 1 }],
      excludes: [{ id: '124' }]
    }

    override = typesense.collections('companies').overrides('lex-exact')
    apiCall = new ApiCall(typesense.configuration)
    mockAxios = new MockAxiosAdapter(axios)
  })

  describe('.retrieve', function () {
    it('retreives the override with the given ID', function (done) {
      mockAxios
        .onGet(
          apiCall.uriFor('/collections/companies/overrides/lex-exact', typesense.configuration.nodes[0]),
          undefined,
          {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
          }
        )
        .reply(200, JSON.stringify(overrideData), { 'content-type': 'application/json' })

      let returnData = override.retrieve()
      expect(returnData).to.eventually.deep.equal(overrideData).notify(done)
    })
  })

  describe('.delete', function () {
    it('deletes the override with the given ID', function (done) {
      let stubbedResult = { id: 'lex-exact' }
      mockAxios
        .onDelete(
          apiCall.uriFor('/collections/companies/overrides/lex-exact', typesense.configuration.nodes[0]),
          undefined,
          {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
          }
        )
        .reply(200, JSON.stringify(stubbedResult), { 'content-type': 'application/json' })

      let returnData = override.delete()

      expect(returnData).to.eventually.deep.equal(stubbedResult).notify(done)
    })
  })
})
