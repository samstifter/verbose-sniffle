import to from 'await-to-js';

export const GetQueue = async(QueueID) => {
  let err, response;
  [err, response] = await to(fetch(`https://helptrain.space:8080/queues/get/${QueueID}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }));
  if(!err) {
    let data = await response.json();
    if(data.length > 0) {
      return { 'error': null, data: data[0] }
    }
    else {
      return { 'error': 'No Data', data: null }
    }
  }
  else {
    return { 'error': err, data: null }
  }

}
export const NewQueue = async(QueueName, QueueDescription, Email) => {
  let body = JSON.stringify({
    Name: QueueName,
    Description: QueueDescription,
    Email: Email
  })
  let err, response;
  [err, response] = await to(fetch(`https://helptrain.space:8080/queues/new/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: body
  }));
  if(err) {
    console.error(err);
    return { 'error': err, data: null }
  }
  else {
    let data = await response.json();
    return { 'error': null, data: data }
  }
}
export const UpdateQueue = async(QueueID, QueueName, QueueDescription) => {
  let body = JSON.stringify({
    Name: QueueName,
    Description: QueueDescription
  })
  let err, response;
  [err, response] = await to(fetch(`https://helptrain.space:8080/queues/update/${QueueID}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: body
  }));
  if(err) {
    console.error(err);
    return err;
  }
  return response.ok;
}
export const DeleteQueue = async(QueueID) => {
  let body = JSON.stringify({})
  let err, response;
  [err, response] = await to(fetch(`https://helptrain.space:8080/queues/delete/${QueueID}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: body
  }));
  if(err) {
    console.error(err);
    return err;
  }
  return response.ok;
}
