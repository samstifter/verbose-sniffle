export const GetQueueMember = async(QueueID) => {
  let body = JSON.stringify({})
  let response = await fetch(`http://helptrain.space:8080/queuemembers/get/${QueueID}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: body
  });
  return await response.json();
}
export const NewQueueMember = async(QueueID, MemberName, MemberQuestion) => {
  let body = JSON.stringify({
    Name: MemberName,
    Question: MemberQuestion,
    QueueID: QueueID
  })
  let response = await fetch(`http://helptrain.space:8080/queuemembers/new/${QueueID}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: body
  });
  return response;
}
export const DeleteQueueMember = async(MemberID) => {
  let body = JSON.stringify({})
  let response = await fetch(`http://helptrain.space:8080/queuemembers/delete/${MemberID}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: body
  });
  return response;
}
