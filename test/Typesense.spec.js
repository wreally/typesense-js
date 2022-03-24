import chai from 'chai'
import { Client as TypesenseClient, SearchClient as TypesenseSearchClient, Errors } from '../src/Typesense'

let expect = chai.expect

describe('Typesense', function () {
  it('should have a Client object that can be instantiated', function (done) {
    let client = new TypesenseClient({
      nodes: [
        {
          host: 'node0',
          port: '8108',
          protocol: 'http'
        }
      ],
      apiKey: 'abcd'
    })

    expect(client.configuration).to.be.an('object')
    done()
  })

  it('should have a SearchClient object that can be instantiated', function (done) {
    let client = new TypesenseSearchClient({
      nodes: [
        {
          host: 'node0',
          port: '8108',
          protocol: 'http'
        }
      ],
      apiKey: 'abcd'
    })

    expect(client.configuration).to.be.an('object')
    done()
  })

  it('should have all the custom error objects', function (done) {
    // Just to make sure the object is available
    expect(new Errors.TypesenseError()).to.be.an.instanceof(Errors.TypesenseError)
    done()
  })
})
