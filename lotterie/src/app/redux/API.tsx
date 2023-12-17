import ipAddressServer from '../config';

interface IAction {
  type: string;
  year: string; 
}

export function fetchApiData(obj:IAction) {
  return fetch(`${ipAddressServer}/${obj.type}`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({year:Number(obj.year)}),
  })
  .then(response => {
      return response.json();
  });
}
