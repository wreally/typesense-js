import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { Client as TypesenseClient } from '../../src/Typesense'
import ApiCall from '../../src/Typesense/ApiCall'
import axios from 'axios'
import MockAxiosAdapter from 'axios-mock-adapter'

let expect = chai.expect
chai.use(chaiAsPromised)

describe('Metrics', function () {
  let mockAxios
  let typesense
  let apiCall
  beforeEach(function () {
    mockAxios = new MockAxiosAdapter(axios)
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
    apiCall = new ApiCall(typesense.configuration)
  })

  describe('.retrieve', function () {
    it('retrieves metrics', function (done) {
      mockAxios
        .onGet(apiCall.uriFor('/metrics.json', typesense.configuration.nodes[0]), undefined, {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
        })
        .reply(200, '{}', { 'content-type': 'application/json' })

      let returnData = typesense.metrics.retrieve()

      expect(returnData).to.eventually.deep.equal({}).notify(done)
    })
  })
})
