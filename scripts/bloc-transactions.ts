const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    authorization: 'Bearer sk_live_6568925f74bd15c3deb271916568925f74bd15c3deb27192'
  }
};

fetch('https://api.blochq.io/v1/transactions?customer_id=6578635a78dc50f2952673ff', options)
  .then(response => response.json())
  .then((response: any) => console.log(response?.data!!))
  .catch(err => console.error(err));