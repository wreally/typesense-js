import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { Client as TypesenseClient } from '../../src/Typesense'
import ApiCall from '../../src/Typesense/ApiCall'
import axios from 'axios'
import MockAxiosAdapter from 'axios-mock-adapter'

let expect = chai.expect
chai.use(chaiAsPromised)

describe('Document', function () {
  let typesense
  let document
  let documentResult = {
    id: '124',
    company_name: 'Stark Industries',
    num_employees: 5215,
    country: 'USA'
  }
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
    document = typesense.collections('companies').documents('124')
    apiCall = new ApiCall(typesense.configuration)
    mockAxios = new MockAxiosAdapter(axios)
  })

  describe('.retrieve', function () {
    it('retrieves a document', function (done) {
      mockAxios
        .onGet(apiCall.uriFor('/collections/companies/documents/124', typesense.configuration.nodes[0]), null, {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
        })
        .reply(200, JSON.stringify(documentResult), { 'content-type': 'application/json' })

      let returnData = document.retrieve()

      expect(returnData).to.eventually.deep.equal(documentResult).notify(done)
    })
  })

  describe('.update', function () {
    it('updates a document', function (done) {
      const partialDocument = {
        id: 124,
        company_name: 'Stark Industries Inc'
      }
      mockAxios
        .onPatch(
          apiCall.uriFor('/collections/companies/documents/124', typesense.configuration.nodes[0]),
          partialDocument,
          {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
          }
        )
        .reply((config) => {
          expect(config.params.dirty_values).to.equal('coerce_or_reject')
          return [200, JSON.stringify(partialDocument), { 'content-type': 'application/json' }]
        })

      let returnData = document.update(partialDocument, { dirty_values: 'coerce_or_reject' })

      expect(returnData).to.eventually.deep.equal(partialDocument).notify(done)
    })
  })

  describe('.delete', function () {
    it('deletes a document', function (done) {
      mockAxios
        .onDelete(apiCall.uriFor('/collections/companies/documents/124', typesense.configuration.nodes[0]), null, {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
        })
        .reply(200, JSON.stringify(documentResult), { 'content-type': 'application/json' })

      let returnData = document.delete()

      expect(returnData).to.eventually.deep.equal(documentResult).notify(done)
    })
  })
})
