import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { SearchClient as TypesenseSearchClient } from '../../src/Typesense'
import MockAxiosAdapter from 'axios-mock-adapter'
import axios from 'axios'
import ApiCall from '../../src/Typesense/ApiCall'

let expect = chai.expect
chai.use(chaiAsPromised)

describe('SearchClient', function () {
  let typesense
  beforeEach(function () {
    typesense = new TypesenseSearchClient({
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
  it('should only expose the search endpoints', function (done) {
    expect(typesense.collections).to.throw('Typesense.SearchClient only supports search operations')
    expect(typesense.collections('xyz').documents().search).to.be.a('function')
    expect(typesense.multiSearch.perform).to.be.a('function')
    expect(typesense.keys).to.be.an('undefined')
    done()
  })

  it('should send the api key via GET, when key is less than 2000 characters', function (done) {
    let mockAxios = new MockAxiosAdapter(axios)
    let apiCall = new ApiCall(typesense.configuration)
    let searches = {
      searches: [{ q: 'term1' }, { q: 'term2' }]
    }
    let commonParams = {
      collection: 'docs',
      query_by: 'field'
    }

    mockAxios
      .onPost(apiCall.uriFor('/multi_search', typesense.configuration.nodes[0]), searches, {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'text/plain'
      })
      .reply((config) => {
        expect(config.params).to.deep.equal(
          Object.assign({}, commonParams, { 'x-typesense-api-key': typesense.configuration.apiKey })
        )
        return [200, '{}', { 'content-type': 'application/json' }]
      })

    let returnData = typesense.multiSearch.perform(searches, commonParams)

    expect(returnData).to.eventually.deep.equal({}).notify(done)
  })
  it('should send the api key via headers, when key is over 2000 characters', function (done) {
    let mockAxios = new MockAxiosAdapter(axios)
    const configuration = {
      nodes: [
        {
          host: 'node0',
          port: '8108',
          protocol: 'http'
        }
      ],
      apiKey:
        '2e8aa18217d0d64173ee2c897d7847adad903c4ef711ad9dd1b66071e346b4524f8f4c96bef3424b893b0d2e25d17028422d487a17cee645720b59bdae2c6c0f21d8e474d29aebd788194a339c015e87c7a02547d4664171e515a4f1bef80ae68ef606009f2205e87e00249468b8b121afa184630aa3c1c5a613adab62fa3c98e6e8b92642af9c9d4ff5cd5ceda4c062603fc4c255895e527fcfda7c89cdb2bc84e947ab89733bed2ab138f29bd7f3766f92e01e024c131ca8877a8fa18045ea6bedfb44cec03486067186ac5803c4c2a8eee9d926a51dc9d2ec2ec9e833d2e11bf9fa67f57760dd12ad40f5ca6a74bfd580bf42b84425efd3ba298dba5a50b6e262193604d94ca2baa8eeca55b0336e7392e4433871c83e16a7450b1d927043e4b6712e0b752a3eb8a402b10be0eba79adf1ca0a3495d3ae8edde25030ce4a4499754f23dc22690d4c769ac9212b8b68b3208cfba56cf43cec52a9184fd4596ba196cf4aa8cdad5365ea4600c5cc2789f9f79953b1955eb78b84f6dc78e2e3b7967ff2f8c5706e2041364b9e3948f487ca6cd6f6993eeffc3b50d9ee54a04b09507c29a9b926e24834cf430dc56f577f32e871dba7bfd57f25a3b8dd915289ab3efe6596868ba2222daa794019715cfef2271a0fca6f8de6ba8881ba1d1228c078ee4619fcc29598aa27038f99c81321381c6892ddb8fc1b7c71b1de5d057243eeb1649643c452b062bd94c71f26b8e7bea12b938a2458cadddc5af6f1210b7f71f1988412e0504c1f63bf20a84847da96a4241feee67784828bcd842bb3670f88bbe6f346a9b2dc59698407ee6ef70e35911f3c00f7826e323e7a46bd33acfb7b824c44185b6d973ca1c5b1686e9565121b0204b68b4491f652d0ac5331ed7ba76112728d559df60f2b57dad1b809001fec95bad2030f53396ccf1f4412aeb2339ab7e924002adfc8d377cc31c427b36fb083e0835de77a543839ec4f8dcb3cfa5943d8e22fd20440014ecf2c32b2f4bb8f854a6fb777b7927a337c73fa9fefe88147096cad0cb22995c98a8d19f8a033b8fe3c20f69963e3c935823f28394e21ee9f3471c9ff0894bc8ffc9a82ef8ef4bd3ad8436afb3768c6217bc10340ad04111601eaf4dc058ca44897e4d7f13a3ef56c1ca9119d5fd6f995ab5a6cb2d9a43cc8587506345ca2e2b24660833e01752f32420cdec108e8043dc533ea6cc5753071a25d34bf8bb2c503d711394810ecf63a100522914aa4faeab18ac471f8a70128bf07bb43da489649678bc92f02eda671351381590ae43b9e272148ef97e464c47929b303df67c56d1dc698e63149094118ad33bd753b6d6a3c41bab8596636062a3fc8d90c1b6bdafa03cdf6bb048d6222ea1fd5a1c8670eedfdb252dfd5b14315d0ed71ada4ffb4a691960c83bf31c762d4a5dbbf9f92bc9b1c2b575b9e2c1ff7a56a7f8a510394ae2cf7ee413590882813f5a01c20781d1f6339127ec6249075b5cac9c28b2675bc11a42fce0c0da704ffa24e4a63ef5adf17fc7d2eefbcece4a24f1a69f830e6fc0a5a2bbe95cf23cdab2992aca1ab2b8f6362c1fdce3b8f07c25044e5ceaa462cd12eead68b87b2cb5b5a673190cbe58bb4253b88ffb9301dca677f41b7a8bf16a7cad01920dfb2b869d90cec79c2ebe2fd4c8474ce0215aaf587ac415e40a07d1350935dd64c4c8e58dc7b33c9a2d6a41fca9f120db71a563ac00ff8367f39dc0a544882adc49ea070a47a0b93cc05e37c081862c071d15bfd73f31b7c2e0c55bcfb7874f533e7e71eccced539e0ea02f7d47dfe02bdf08161f5c5bc6d1ea84d00cc2cb493808bd74aae2018c0a39bc68acdf1a26a93f25588d44558f85d12a32bd130046bcb3d3cbed5c0abd855923f46d57ab040ba63af005a297be955ab44542cec41eb026b43a5e957c655519cd70854ef82555e89534d2a12b88b1a6d81d80a59da6ea98b7c9e684e87f311736a4babc19c8b7cbecee29bc870c9092bf600ef079a91d5891b229e0f6560704daa4c42e34052bd03969c38bc4ba0c3ca6eeba1086e72269e7d5f306e4ac11ef61f18709585e2e97a94c2ca24f4b0264b92efe5b2a395c33512692520c7648b1c78138cc958f2bba89ffb041f41ce3a534270c1d238fca4c46b2a602ec084ee7abcf36f96c5dc9a677cc4a9bd75c59cb7d24384a6219bd8c9ddce8904ef4baae91b7231916fffaa1f53c672c4f4ab979b58f95de7081de1ac28b44bad9ac2098a65f2c5fa1c798bf10236042c3298e6676a073148bf37d608f9f38b9ec6f321239495acb960f5ca1729b7c6829757418819e5b2fe96be6a88a0936b6d5e637eeb0b87d74792241cb461f78402bcf49a1b28c3a758eba2279f0a3c15054a1ede806e15a58cb6327a818268264ffbfd5a8594d29d5582366d8c9dc595a2974871258d2b30130fbb0038dc7a00d2ec9f7cc0d5286dc2fd39a50b65792044c6130c75576b9838d3760c8fe62cce46119b1420735816f663e6b5c30836a4fc7fbf6a7f2de79ffb8cc472a46b269fc23ac92ff96742c622bd7d06e183c24f0d43a49b8ea8fd85b4174844166fcfbeb49122e2ade8ad0428b3ab86006a1133f8616c7dd2bb647ae691d7decd99ce05a9b2c21514130582f6ddb08f53223e4f61371f68d1c9be93eaf9167cb9ef06ee2d2b8b0c74dbf30a06b40c5cdd982c21b82587066961ecbc18f13eb0568826270d992410ce29e5838b95132bb603f3ba946e1cd8d1e888daf1292266748ada8a83771e40fd4ef44373c69fc7f25336119ab53339f6d376aa7b95530c2bbedfab91fb0555b4c02203b2edd'
    }
    typesense = new TypesenseSearchClient(configuration)
    let apiCall = new ApiCall(typesense.configuration)
    let searches = {
      searches: [{ q: 'term1' }, { q: 'term2' }]
    }
    let commonParams = {
      collection: 'docs',
      query_by: 'field'
    }

    mockAxios
      .onPost(apiCall.uriFor('/multi_search', typesense.configuration.nodes[0]), searches, {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'text/plain',
        'X-TYPESENSE-API-KEY': typesense.configuration.apiKey
      })
      .reply((config) => {
        expect(config.params['x-typesense-api-key']).to.eq(undefined)
        return [200, '{}', { 'content-type': 'application/json' }]
      })

    let returnData = typesense.multiSearch.perform(searches, commonParams)

    expect(returnData).to.eventually.deep.equal({}).notify(done)
  })
})
