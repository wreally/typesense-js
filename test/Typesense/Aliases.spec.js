import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { Client as TypesenseClient } from '../../src/Typesense'
import ApiCall from '../../src/Typesense/ApiCall'
import axios from 'axios'
import MockAxiosAdapter from 'axios-mock-adapter'

let expect = chai.expect
chai.use(chaiAsPromised)

describe('Aliases', function () {
  let typesense
  let aliases
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
    aliases = typesense.aliases()
    apiCall = new ApiCall(typesense.configuration)
    mockAxios = new MockAxiosAdapter(axios)
  })

  describe('.upsert', function () {
    it('upserts an alias', function (done) {
      mockAxios
        .onPut(
          apiCall.uriFor('/aliases/books', typesense.configuration.nodes[0]),
          {
            collection_name: 'books_january'
          },
          {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
          }
        )
        .reply(201, '{}', { 'content-type': 'application/json; charset=utf-8' })

      let returnData = aliases.upsert('books', {
        collection_name: 'books_january'
      })

      expect(returnData).to.eventually.deep.equal({}).notify(done)
    })
  })

  describe('.retrieve', function () {
    it('retrieves all aliases', function (done) {
      mockAxios
        .onGet(apiCall.uriFor('/aliases', typesense.configuration.nodes[0]), undefined, {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
        })
        .reply(200, '[]', { 'content-type': 'application/json; charset=utf-8' })

      let returnData = aliases.retrieve()

      expect(returnData).to.eventually.deep.equal([]).notify(done)
    })
  })
})
