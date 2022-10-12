# Framework for XHR fake

fake specified request with specified response at any time,and you can get the real request parameters

supports:
* XMLHttpRequest
* ajax request
* fetch request



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
