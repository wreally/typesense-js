import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { Client as TypesenseClient } from '../../src/Typesense'
import ApiCall from '../../src/Typesense/ApiCall'
import axios from 'axios'
import MockAxiosAdapter from 'axios-mock-adapter'

let expect = chai.expect
chai.use(chaiAsPromised)

describe('Collections', function () {
  let typesense
  let collections
  let apiCall
  let mockAxios
  let companySchema = {
    name: 'companies',
    num_documents: 0,
    fields: [
      {
        name: 'company_name',
        type: 'string',
        facet: false
      },
      {
        name: 'num_employees',
        type: 'int32',
        facet: false
      },
      {
        name: 'country',
        type: 'string',
        facet: true
      }
    ],
    default_sorting_field: 'num_employees'
  }
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
    collections = typesense.collections()
    apiCall = new ApiCall(typesense.configuration)
    mockAxios = new MockAxiosAdapter(axios)
  })

  describe('.create', function () {
    it('creates a collection', function (done) {
      let { num_documents: numDocuments, ...schemaForCreation } = companySchema
      mockAxios
        .onPost(apiCall.uriFor('/collections', typesense.configuration.nodes[0]), schemaForCreation, {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
        })
        .reply(201, JSON.stringify(companySchema), { 'content-type': 'application/json' })

      let returnData = collections.create(schemaForCreation)

      expect(returnData).to.eventually.deep.equal(companySchema).notify(done)
    })
  })

  describe('.retrieve', function () {
    it('retrieves all collections', function (done) {
      mockAxios
        .onGet(apiCall.uriFor('/collections', typesense.configuration.nodes[0]), undefined, {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
        })
        .reply(200, JSON.stringify([companySchema]), { 'content-type': 'application/json' })

      let returnData = collections.retrieve()

      expect(returnData).to.eventually.deep.equal([companySchema]).notify(done)
    })
  })
})
