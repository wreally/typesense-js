import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { Client as TypesenseClient } from '../../src/Typesense'
import ApiCall from '../../src/Typesense/ApiCall'
import axios from 'axios'
import MockAxiosAdapter from 'axios-mock-adapter'

let expect = chai.expect
chai.use(chaiAsPromised)

describe('Collection', function () {
  let typesense
  let collection
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
    collection = typesense.collections('companies')
    apiCall = new ApiCall(typesense.configuration)
    mockAxios = new MockAxiosAdapter(axios)
  })

  describe('.retrieve', function () {
    it('retrieves a collection', function (done) {
      mockAxios
        .onGet(apiCall.uriFor('/collections/companies', typesense.configuration.nodes[0]), null, {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
        })
        .reply(200, JSON.stringify(companySchema), { 'content-type': 'application/json' })

      let returnData = collection.retrieve()

      expect(returnData).to.eventually.deep.equal(companySchema).notify(done)
    })
  })

  describe('.delete', function () {
    it('deletes a collection', function (done) {
      mockAxios
        .onDelete(apiCall.uriFor('/collections/companies', typesense.configuration.nodes[0]), null, {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
        })
        .reply(200, JSON.stringify(companySchema), { 'content-type': 'application/json' })

      let returnData = collection.delete()

      expect(returnData).to.eventually.deep.equal(companySchema).notify(done)
    })
  })
})
