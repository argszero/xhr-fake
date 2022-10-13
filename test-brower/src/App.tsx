import { useState } from 'react'
import { xhr } from 'xhr-fake';
import './App.css'

function App() {
  return (
    <div className="App">
      <FetchGet />
      <FetchPost />
      <XhrGet />
      <XhrPost />
    </div>
  )
}

function XhrGet() {
  const [resp, setResp] = useState({});
  const [req, setReq] = useState({});
  const callApi = () => {
    setReq('{}');
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState == XMLHttpRequest.DONE) {
        setResp(JSON.parse(request.responseText));
      }
    }
    request.open('GET', 'api/hello', true);
    request.send(null);
  };
  const fake = async() => {
    const fake = xhr.fake((url, _body) => /api\/hello/.test(url + ''), () => ({
      status: 200, body: JSON.stringify({
        code: 200,
        message: 'I am fake response from client'
      })
    }));
    callApi();
    const req = await fake.getRequest(5 * 1000);
    setReq(req)
  };
  return (
    <div className='container'>
      <div>
        <span>Xhr Get Fake Test</span>
      </div>
      <div>
        <button onClick={callApi}>callApi</button>
        <button onClick={fake}>fakeAndCallApi</button>
      </div>
      <div>
        <span>
         REQ: {JSON.stringify(req)}
        </span>
      </div>
      <div>
        <span>
         RESP: {JSON.stringify(resp)}
        </span>
      </div>
    </div>
  )
}

function XhrPost() {
  const [resp, setResp] = useState({});
  const [req, setReq] = useState({});
  const callApi = () => {
    setReq('{}');
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState == XMLHttpRequest.DONE) {
        setResp(JSON.parse(request.responseText));
      }
    }
    request.open('POST', 'api/hello', true);
    request.send(JSON.stringify({name:'client'}));
  };
  const fake = async() => {
    const fake = xhr.fake((url, body) => /api\/hello/.test(url + '') && JSON.parse(body+'')['name']==='client', () => ({
      status: 200, body: JSON.stringify({
        code: 200,
        message: 'I am fake response from client'
      })
    }));
    callApi();
    const req = await fake.getRequest(5 * 1000);
    setReq(req)
  };
  return (
    <div className='container'>
      <div>
        <span>Xhr Post Fake Test</span>
      </div>
      <div>
        <button onClick={callApi}>callApi</button>
        <button onClick={fake}>fakeAndCallApi</button>
      </div>
      <div>
        <span>
         REQ: {JSON.stringify(req)}
        </span>
      </div>
      <div>
        <span>
         RESP: {JSON.stringify(resp)}
        </span>
      </div>
    </div>
  )
}



function FetchGet() {
  const [resp, setResp] = useState({});
  const [req, setReq] = useState({});
  const callApi = () => {
    setReq('{}');
    fetch('api/hello').then(res => res.json()).then(res => setResp(res));
  };
  const fake = async() => {
    const fake = xhr.fake((url, _body) => /api\/hello/.test(url + ''), () => ({
      status: 200, body: JSON.stringify({
        code: 200,
        message: 'I am fake response from client'
      })
    }));
    callApi();
    const req = await fake.getRequest(5 * 1000);
    setReq(req)
  };
  return (
    <div className='container'>
      <div>
        <span>Fetch Get Fake Test</span>
      </div>
      <div>
        <button onClick={callApi}>callApi</button>
        <button onClick={fake}>fakeAndCallApi</button>
      </div>
      <div>
        <span>
         REQ: {JSON.stringify(req)}
        </span>
      </div>
      <div>
        <span>
         RESP: {JSON.stringify(resp)}
        </span>
      </div>
    </div>
  )
}

function FetchPost() {
  const [resp, setResp] = useState({});
  const [req, setReq] = useState({});
  const callApi = () => {
    setReq('{}');
    fetch('api/hello',{
      method:'POST',
      body:JSON.stringify({name:"client"}),
    }).then(res => res.json()).then(res => setResp(res));
  };
  const fake = async() => {
    const fake = xhr.fake((url, body) => /api\/hello/.test(url + '')&& JSON.parse(body+'')['name']==='client', () => ({
      status: 200, body: JSON.stringify({
        code: 200,
        message: 'I am fake response from client'
      })
    }));
    callApi();
    const req = await fake.getRequest(5 * 1000);
    setReq(req)
  };
  return (
    <div className='container'>
      <div>
        <span>Fetch Post Fake Test</span>
      </div>
      <div>
        <button onClick={callApi}>callApi</button>
        <button onClick={fake}>fakeAndCallApi</button>
      </div>
      <div>
        <span>
         REQ: {JSON.stringify(req)}
        </span>
      </div>
      <div>
        <span>
         RESP: {JSON.stringify(resp)}
        </span>
      </div>
    </div>
  )
}

export default App
