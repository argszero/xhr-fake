# Framework for XHR fake

fake specified request with specified response at any time,and you can get the real request parameters

## How to use

`
import xhr from 'xhr-fake';

...

const fake = xhr.fake(/api\/caculate/,(request)=>{JSON.stringify({result: 27}})

//trigger the xhr request ,but the request will not be sent to the server
document.getElementById('caculateBtn').click();

const request = await fake.getRequest(3*1000);
`
