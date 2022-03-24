import fs from 'fs'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { Client as TypesenseClient } from '../../src/Typesense'
import ApiCall from '../../src/Typesense/ApiCall'
import axios from 'axios'
import MockAxiosAdapter from 'axios-mock-adapter'
import timekeeper from 'timekeeper'

let expect = chai.expect
chai.use(chaiAsPromised)

describe('Documents', function () {
  let typesense
  let documents
  let document
  let anotherDocument
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
      apiKey: 'abcd',
      cacheSearchResultsForSeconds: 2 * 60
    })

    document = {
      id: '124',
      company_name: 'Stark Industries',
      num_employees: 5215,
      country: 'USA'
    }

    anotherDocument = {
      id: '125',
      company_name: 'Stark Industries',
      num_employees: 5215,
      country: 'USA'
    }

    documents = typesense.collections('companies').documents()
    apiCall = new ApiCall(typesense.configuration)
    mockAxios = new MockAxiosAdapter(axios)
  })

  describe('.search', function () {
    it('searches the documents in a collection', function (done) {
      let searchParameters = {
        q: 'Stark',
        query_by: 'company_name'
      }
      let stubbedSearchResult = {
        facet_counts: [],
        found: 0,
        search_time_ms: 0,
        page: 0,
        hits: [
          {
            _highlight: {
              company_name: '<mark>Stark</mark> Industries'
            },
            document: {
              id: '124',
              company_name: 'Stark Industries',
              num_employees: 5215,
              country: 'USA'
            }
          }
        ]
      }
      mockAxios
        .onGet(
          apiCall.uriFor('/collections/companies/documents/search', typesense.configuration.nodes[0]),
          {
            params: searchParameters
          },
          {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
          }
        )
        .reply(200, JSON.stringify(stubbedSearchResult), { 'content-type': 'application/json' })

      let returnData = documents.search(searchParameters)

      expect(returnData).to.eventually.deep.equal(stubbedSearchResult).notify(done)
    })
    it('searches with and without cache', async function () {
      let searchParameters = [
        {
          q: 'Stark',
          query_by: 'company_name'
        },
        {
          q: 'Acme',
          query_by: 'company_name'
        }
      ]
      let stubbedSearchResults = [
        {
          facet_counts: [],
          found: 0,
          search_time_ms: 0,
          page: 0,
          hits: [
            {
              _highlight: {
                company_name: '<mark>Stark</mark> Industries'
              },
              document: {
                id: '124',
                company_name: 'Stark Industries',
                num_employees: 5215,
                country: 'USA'
              }
            }
          ]
        },
        {
          facet_counts: [],
          found: 0,
          search_time_ms: 0,
          page: 0,
          hits: [
            {
              _highlight: {
                company_name: '<mark>Acme</mark> Corp'
              },
              document: {
                id: '124',
                company_name: 'Acme Corp',
                num_employees: 231,
                country: 'USA'
              }
            }
          ]
        }
      ]

      searchParameters.forEach((_, i) => {
        mockAxios
          .onGet(
            apiCall.uriFor('/collections/companies/documents/search', typesense.configuration.nodes[0]),
            {
              params: searchParameters[i]
            },
            {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json',
              'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
            }
          )
          .reply(200, JSON.stringify(stubbedSearchResults[i]), { 'content-type': 'application/json' })
      })

      let currentTime = Date.now()
      timekeeper.freeze(currentTime)

      let returnData = [
        await documents.search(searchParameters[0]),
        await documents.search(searchParameters[0]), // Repeat the same query a 2nd time, to test caching
        await documents.search(searchParameters[1]) // Now do a different query
      ]

      // Only two requests should be made, since one of them was cached
      expect(mockAxios.history['get'].length).to.equal(2)

      expect(returnData[0]).to.deep.equal(stubbedSearchResults[0])
      expect(returnData[1]).to.deep.equal(stubbedSearchResults[0]) // Same response should be returned
      expect(returnData[2]).to.deep.equal(stubbedSearchResults[1])

      // Now wait 60s and then retry the request, still should be fetched from cache
      timekeeper.freeze(currentTime + 60 * 1000)
      returnData.push(await documents.search(searchParameters[1]))
      expect(returnData[3]).to.deep.equal(stubbedSearchResults[1])

      // No new requests should have been made
      expect(mockAxios.history['get'].length).to.equal(2)

      // Now wait 2 minutes and then retry the request, it should now make an actual request, since cache is stale
      timekeeper.freeze(currentTime + 121 * 1000)
      returnData.push(await documents.search(searchParameters[1]))
      expect(returnData[4]).to.deep.equal(stubbedSearchResults[1])

      // One new request should have been made
      expect(mockAxios.history['get'].length).to.equal(3)
      timekeeper.reset()
    })
  })

  it('should evict least used cache entries', async function () {
    const searchFactory = () => ({
      q: Math.random().toString(),
      query_by: 'company_name'
    })
    let searchParameters = []

    for (let i = 0; i <= 100; i++) {
      searchParameters.push(searchFactory())
    }

    let stubbedSearchResults = [
      {
        facet_counts: [],
        found: 0,
        search_time_ms: 0,
        page: 0,
        hits: [
          {
            _highlight: {
              company_name: '<mark>Stark</mark> Industries'
            },
            document: {
              id: '124',
              company_name: 'Stark Industries',
              num_employees: 5215,
              country: 'USA'
            }
          }
        ]
      }
    ]

    searchParameters.forEach((_, i) => {
      mockAxios
        .onGet(
          apiCall.uriFor('/collections/companies/documents/search', typesense.configuration.nodes[0]),
          {
            params: searchParameters[i]
          },
          {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
          }
        )
        .reply(200, JSON.stringify(stubbedSearchResults[i]), { 'content-type': 'application/json' })
    })

    let currentTime = Date.now()
    timekeeper.freeze(currentTime)

    // Fill the cache
    const searches = searchParameters
      .map((searchParameters) => {
        return documents.search(searchParameters)
      })
      .slice(0, 100)

    await Promise.all(searches)

    // Existing entries should already be in cache.
    await documents.search(searchParameters[19])
    await documents.search(searchParameters[18])

    // making a new entry should evict the oldest entry
    await documents.search(searchParameters[100])

    // get 0 again because it was the oldest
    await documents.search(searchParameters[0])

    const numberOfRequest = mockAxios.history['get'].length
    expect(numberOfRequest).to.equal(102)
  })

  describe('.create', function () {
    it('creates the document', function (done) {
      mockAxios
        .onPost(apiCall.uriFor('/collections/companies/documents', typesense.configuration.nodes[0]), document, {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
        })
        .reply(201, document)

      let returnData = documents.create(document)

      expect(returnData).to.eventually.deep.equal(document).notify(done)
    })
  })

  describe('.upsert', function () {
    it('upserts the document', function (done) {
      mockAxios
        .onPost(apiCall.uriFor('/collections/companies/documents', typesense.configuration.nodes[0]), document, {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
        })
        .reply((config) => {
          expect(config.params.action).to.equal('upsert')
          expect(config.params.dirty_values).to.equal('reject')
          return [201, JSON.stringify(document), { 'content-type': 'application/json' }]
        })

      let returnData = documents.upsert(document, { dirty_values: 'reject' })

      expect(returnData).to.eventually.deep.equal(document).notify(done)
    })
  })

  describe('.update', function () {
    it('updates the document', function (done) {
      mockAxios
        .onPost(apiCall.uriFor('/collections/companies/documents', typesense.configuration.nodes[0]), document, {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
        })
        .reply((config) => {
          expect(config.params.action).to.equal('update')
          expect(config.params.dirty_values).to.equal('reject')
          return [201, JSON.stringify(document), { 'content-type': 'application/json' }]
        })

      let returnData = documents.update(document, { dirty_values: 'reject' })

      expect(returnData).to.eventually.deep.equal(document).notify(done)
    })
  })

  describe('.createMany', function () {
    it('imports the documents', function (done) {
      mockAxios
        .onPost(
          apiCall.uriFor('/collections/companies/documents/import', typesense.configuration.nodes[0]),
          `${JSON.stringify(document)}\n${JSON.stringify(anotherDocument)}`,
          {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'text/plain',
            'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
          }
        )
        .reply(200, JSON.stringify({ success: true }), { 'content-type': 'text/plain' })

      let returnData = documents.createMany([document, anotherDocument])

      expect(returnData)
        .to.eventually.deep.equal([{ success: true }])
        .notify(done)
    })

    context('when a query paramater is passed', function () {
      it('passes the query parameter to the API', function (done) {
        mockAxios
          .onPost(
            apiCall.uriFor('/collections/companies/documents/import', typesense.configuration.nodes[0]),
            `${JSON.stringify(document)}\n${JSON.stringify(anotherDocument)}`,
            {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'text/plain',
              'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
            }
          )
          .reply((config) => {
            expect(config.params.upsert).to.equal(true)
            return [200, JSON.stringify({ success: true }), { 'content-type': 'text/plain' }]
          })

        let returnData = documents.createMany([document, anotherDocument], { upsert: true })

        expect(returnData)
          .to.eventually.deep.equal([{ success: true }])
          .notify(done)
      })
    })
  })

  describe('.import', function () {
    context('when a query paramater is passed', function () {
      it('passes the query parameter to the API', function (done) {
        mockAxios
          .onPost(
            apiCall.uriFor('/collections/companies/documents/import', typesense.configuration.nodes[0]),
            `${JSON.stringify(document)}\n${JSON.stringify(anotherDocument)}`,
            {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'text/plain',
              'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
            }
          )
          .reply((config) => {
            expect(config.params.action).to.equal('upsert')
            return [200, JSON.stringify({ success: true }), { 'content-type': 'text/plain' }]
          })

        let jsonlData = [document, anotherDocument].map((document) => JSON.stringify(document)).join('\n')
        let returnData = documents.import(jsonlData, { action: 'upsert' })

        expect(returnData)
          .to.eventually.deep.equal(JSON.stringify({ success: true }))
          .notify(done)
      })
    })

    context('when an array of docs is passed', function () {
      it('converts it to JSONL and returns an array of results', function (done) {
        mockAxios
          .onPost(
            apiCall.uriFor('/collections/companies/documents/import', typesense.configuration.nodes[0]),
            `${JSON.stringify(document)}\n${JSON.stringify(anotherDocument)}`,
            {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'text/plain',
              'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
            }
          )
          .reply((config) => {
            return [200, '{}\n{}', { 'content-type': 'text/plain' }]
          })

        let returnData = documents.import([document, anotherDocument])

        expect(returnData).to.eventually.deep.equal([{}, {}]).notify(done)
      })
      context('when there is an import error', function () {
        it('it raises an exception', function (done) {
          mockAxios
            .onPost(
              apiCall.uriFor('/collections/companies/documents/import', typesense.configuration.nodes[0]),
              `${JSON.stringify(document)}\n${JSON.stringify(anotherDocument)}`,
              {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'text/plain',
                'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
              }
            )
            .reply((config) => {
              return [
                200,
                '{"success": false, "message": "Error message"}\n{"success": false, "message": "Error message"}',
                { 'content-type': 'text/plain' }
              ]
            })

          documents.import([document, anotherDocument]).catch((error) => {
            expect(error.constructor.name).to.eq('ImportError')
            expect(error.importResults.length).to.eq(2)
            expect(error.importResults[0].success).to.eq(false)
            expect(error.importResults[0].message).to.eq('Error message')
            done()
          })
        })
      })
    })

    context('when a JSONL string is passed', function () {
      it('it sends the string as is and returns a string', function (done) {
        mockAxios
          .onPost(
            apiCall.uriFor('/collections/companies/documents/import', typesense.configuration.nodes[0]),
            `${JSON.stringify(document)}\n${JSON.stringify(anotherDocument)}`,
            {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'text/plain',
              'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
            }
          )
          .reply((config) => {
            return [200, '{}\n{}', { 'content-type': 'text/plain' }]
          })

        let jsonlData = [document, anotherDocument].map((document) => JSON.stringify(document)).join('\n')
        let returnData = documents.import(jsonlData)

        expect(returnData).to.eventually.deep.equal('{}\n{}').notify(done)
      })
    })
  })

  describe('.export', function () {
    it('exports the documents', function (done) {
      mockAxios
        .onGet(apiCall.uriFor('/collections/companies/documents/export', typesense.configuration.nodes[0]), undefined, {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
        })
        .reply((config) => {
          expect(config.params.include_fields).to.equal('field1')
          return [
            200,
            [JSON.stringify(document), JSON.stringify(anotherDocument)].join('\n'),
            {
              'content-type': 'text/plain'
            }
          ]
        })

      let returnData = documents.export({ include_fields: 'field1' })

      expect(returnData)
        .to.eventually.deep.equal([JSON.stringify(document), JSON.stringify(anotherDocument)].join('\n'))
        .notify(done)
    })
  })

  describe('.exportStream', function () {
    const tempDirectory = 'test-files'
    const tempFile = `${tempDirectory}/exportStreamData.jsonl`
    const directoryExists = (dir) =>
      fs.promises
        .access(dir)
        .then(() => true)
        .catch(() => false)

    beforeEach(async function () {
      if (!(await directoryExists(tempDirectory))) {
        await fs.promises.mkdir(tempDirectory)
      }
      await fs.promises.writeFile(tempFile, [JSON.stringify(document), JSON.stringify(anotherDocument)].join('\n'))
    })

    afterEach(async function () {
      if (await directoryExists(tempDirectory)) {
        await fs.promises.rmdir(tempDirectory, { recursive: true })
      }
    })

    it('exports a nodejs stream', async function () {
      mockAxios
        .onGet(apiCall.uriFor('/collections/companies/documents/export', typesense.configuration.nodes[0]), undefined, {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
        })
        .reply((config) => {
          expect(config.params.include_fields).to.equal('field1')
          return [200, fs.createReadStream(tempFile)]
        })

      const stream = await documents.exportStream({ include_fields: 'field1' })
      const getDataFromStream = () =>
        new Promise((resolve, reject) => {
          let finalData = ''
          stream.on('data', (data) => {
            finalData += data
          })
          stream.on('end', () => resolve(finalData))
          stream.on('error', (err) => reject(err))
        })
      const data = await getDataFromStream()
      expect(data).to.deep.equal([JSON.stringify(document), JSON.stringify(anotherDocument)].join('\n'))
    })
  })

  describe('.delete', function () {
    it('delete documents', function (done) {
      mockAxios
        .onDelete(
          apiCall.uriFor('/collections/companies/documents', typesense.configuration.nodes[0]),
          {
            params: { filter_by: 'field:=value' }
          },
          {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
          }
        )
        .reply(200, '{}', { 'content-type': 'application/json' })

      let returnData = documents.delete({ filter_by: 'field:=value' })

      expect(returnData).to.eventually.deep.equal({}).notify(done)
    })
  })
})
