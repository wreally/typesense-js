import chai from 'chai'
import { Client as TypesenseClient } from '../../src/Typesense'

let expect = chai.expect

describe('Client', function () {
  let typesense
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
  })
  it('should set the right default configuration values', function (done) {
    expect(typesense.configuration.nodes).to.eql([
      {
        host: 'node0',
        port: '8108',
        protocol: 'http',
        path: ''
      }
    ])
    expect(typesense.configuration.connectionTimeoutSeconds).to.eql(10)
    expect(typesense.configuration.apiKey).to.eql('abcd')
    done()
  })
  it('should allow custom user headers to be passed in', function (done) {
    typesense = new TypesenseClient({
      nodes: [
        {
          host: 'node0',
          port: '8108',
          protocol: 'http'
        }
      ],
      apiKey: 'abcd',
      additionalHeaders: {
        'CF-Access-Client-Id': 'abcd'
      }
    })
    expect(typesense.configuration.additionalHeaders['CF-Access-Client-Id']).to.eql('abcd')
    done()
  })
})
