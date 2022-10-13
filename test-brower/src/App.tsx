import { useEffect, useState } from 'react'
import { xhr } from 'xhr-fake';
import './App.css'

function App() {
  const [resp, setResp] = useState({});
  const fetchGetRes = () => {
    fetch('api/hello').then(res => res.json()).then(res => setResp(res));
  };
  const fakeFetchGetRes = () => {
    fetchGetRes();
  };
  return (
    <div className="App">
      <button onClick={fetchGetRes}>fetchGetRes</button>
      <button onClick={fakeFetchGetRes}>fakeFetchGetRes</button>
      <span>
        {JSON.stringify(resp)}
      </span>
    </div>
  )
}

export default App
