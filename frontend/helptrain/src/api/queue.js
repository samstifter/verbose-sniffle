export const GetQueue = async(QueueID) => {
  let response = await fetch(`http://helptrain.space:8080/queues/get/${QueueID}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
  let data = await response.json();
  if(data.length > 0)
    return data[0];
  else
    return null;
}
export const NewQueue = async(QueueName, QueueDescription, Email) => {
  let body = JSON.stringify({
    Name: QueueName,
    Description: QueueDescription,
    Email: Email
  })
  let response = await fetch(`http://helptrain.space:8080/queues/new/`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: body
  });
  return await response.json();
}
export const UpdateQueue = async(QueueID, QueueName, QueueDescription) => {
  let body = JSON.stringify({
    Name: QueueName,
    Description: QueueDescription
  })
  let response = await fetch(`http://helptrain.space:8080/queues/update/${QueueID}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: body
  });
  return response;
}
export const DeleteQueue = async(QueueID) => {
  let body = JSON.stringify({})
  let response = await fetch(`http://helptrain.space:8080/queues/delete/${QueueID}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: body
  });
  return response;
}
