# Framework for XHR fake

fake specified request with specified response at any time,and you can get the real request parameters

supports:
* XMLHttpRequest
* ajax request
* fetch request

# Why

current xhr interceptors can modify response after send request to server. but sometimes we don't want to send request to server. so we create a new pakcage witch is a fake rather than a interceptor, meaning we don't want to send request to server


## How to use

```javascript
import xhr from 'xhr-fake';

...

const fake = xhr.fake(/api\/caculate/, (_request) => ({ 
    status:200,
    body: JSON.stringify({ result: 27 }) 
}));

//trigger the xhr|ajax|fetch request ,but the request will not be sent to the server
document.getElementById('caculateBtn').click();

const request = await fake.getRequest(3*1000);
```


## test in browser

```bash
cd test-browser
npm run dev
```
open http://localhost:3000/ and run test
