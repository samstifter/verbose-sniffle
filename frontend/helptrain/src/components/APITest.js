import React from 'react'
import { QueueAPI, QueueMemberAPI } from '../api'

const STATE_MACHINE = {
  initial: 'GetQueue',
  GetQueue: 'GetQueue',
  NewQueue: 'NewQueue',
  UpdateQueue: 'UpdateQueue',
  DeleteQueue: 'DeleteQueue',
  GetQueueMember: 'GetQueueMember',
  NewQueueMember: 'NewQueueMember',
  DeleteQueueMember: 'DeleteQueueMember'
};

class APITest extends React.Component {
  state = {
    queueID: '',
    queueName: '',
    queueDescription: '',
    email: '',
    memberName: '',
    memberQuestion: '',
    memberID: '',
    curState: STATE_MACHINE.initial
  }

  handleInputChange = (e) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    switch (this.state.curState) {
      case STATE_MACHINE.GetQueue:
        this.getQueue();
        break;
      case STATE_MACHINE.NewQueue:
        this.newQueue();
        break;
      case STATE_MACHINE.UpdateQueue:
        this.updateQueue();
        break;
      case STATE_MACHINE.DeleteQueue:
        this.deleteQueue();
        break;
      case STATE_MACHINE.GetQueueMember:
        this.getQueueMember();
        break;
      case STATE_MACHINE.NewQueueMember:
        this.newQueueMember();
        break;
      case STATE_MACHINE.DeleteQueueMember:
        this.deleteQueueMember()
        break;
      default:
    }
  }

  getQueue = async() => {
    if(this.state.queueID.length !== 6) {
      console.error("QueueID must be 6 characters");
      return;
    }
    let queue = await QueueAPI.GetQueue(this.state.queueID);
    console.log("=====GetQueue=====");
    console.log(queue);
  }
  newQueue = async() => {
    if(this.state.queueName.length === 0) {
      console.error("QueueName Required");
      return;
    }
    if(this.state.queueDescription.length === 0) {
      console.error("QueueDescription Required");
      return;
    }

    let queue = await QueueAPI.NewQueue(this.state.queueName, this.state.queueDescription, this.state.email);
    console.log("=====NewQueue=====");
    console.log(queue);
  }
  updateQueue = async() => {
    if(this.state.queueID.length !== 6) {
      console.error("QueueID must be 6 characters");
      return;
    }
    if(this.state.queueName.length === 0) {
      console.error("QueueName Required");
      return;
    }
    if(this.state.queueDescription.length === 0) {
      console.error("QueueDescription Required");
      return;
    }

    let data = await QueueAPI.UpdateQueue(this.state.queueID, this.state.queueName, this.state.queueDescription);
    console.log("=====UpdateQueue=====");
    console.log(data);
  }
  deleteQueue = async() => {
    if(this.state.queueID.length !== 6) {
      console.error("QueueID must be 6 characters");
      return;
    }
    let data = await QueueAPI.DeleteQueue(this.state.queueID);
    console.log("=====DeleteQueue=====");
    console.log(data);
  }

  getQueueMember = async() => {
    if(this.state.queueID.length !== 6) {
      console.error("QueueID must be 6 characters");
      return;
    }
    let data = await QueueMemberAPI.GetQueueMember(this.state.queueID);
    console.log("=====GetQueueMember=====");
    console.log(data);
  }
  newQueueMember = async() => {
    if(this.state.queueID.length !== 6) {
      console.error("QueueID must be 6 characters");
      return;
    }
    if(this.state.memberName.length === 0) {
      console.error("QueueMemberName Required");
      return;
    }
    if(this.state.memberQuestion.length === 0) {
      console.error("QueueMemberQuestion Required");
      return;
    }

    let data = await QueueMemberAPI.NewQueueMember(this.state.queueID, this.state.memberName, this.state.memberQuestion);
    console.log("=====NewQueueMember=====");
    console.log(data);
  }
  deleteQueueMember = async() => {
    if(this.state.memberID.length === 0) {
      console.error("MemberID Required");
      return;
    }
    let data = await QueueMemberAPI.DeleteQueueMember(this.state.memberID);
    console.log("=====DeleteQueueMember=====");
    console.log(data);
  }

  render () {
    let _QueueID = (
      <React.Fragment>
        <label>QueueID</label>
        <input type='text' value={this.state.queueID} name='queueID' onChange={this.handleInputChange}/>
      </React.Fragment>
    )
    let _QueueName = (
      <React.Fragment>
        <label>QueueName</label>
        <input type='text' value={this.state.queueName} name='queueName' onChange={this.handleInputChange}/>
      </React.Fragment>
    )
    let _QueueDescription = (
      <React.Fragment>
        <label>QueueDescription</label>
        <input type='text' value={this.state.queueDescription} name='queueDescription' onChange={this.handleInputChange}/>
      </React.Fragment>
    )
    let _Email= (
      <React.Fragment>
        <label>Email</label>
        <input type='text' value={this.state.email} name='email' onChange={this.handleInputChange}/>
      </React.Fragment>
    )
    let _MemberName = (
      <React.Fragment>
        <label>MemberName</label>
        <input type='text' value={this.state.memberName} name='memberName' onChange={this.handleInputChange}/>
      </React.Fragment>
    )
    let _MemberQuestion = (
      <React.Fragment>
        <label>MemberQuestion</label>
        <input type='text' value={this.state.memberQuestion} name='memberQuestion' onChange={this.handleInputChange}/>
      </React.Fragment>
    )
    let _MemberID = (
      <React.Fragment>
        <label>MemberID</label>
        <input type='text' value={this.state.memberID} name='memberID' onChange={this.handleInputChange}/>
      </React.Fragment>
    )

    let VisibleInputs;

    switch (this.state.curState) {
      case STATE_MACHINE.GetQueue:
        VisibleInputs = (
          <React.Fragment>
            {_QueueID}
          </React.Fragment>
        )
        break;
      case STATE_MACHINE.NewQueue:
        VisibleInputs = (
          <React.Fragment>
            {_QueueName}
            {_QueueDescription}
            {_Email}
          </React.Fragment>
        )
        break;
      case STATE_MACHINE.UpdateQueue:
        VisibleInputs = (
          <React.Fragment>
            {_QueueID}
            {_QueueName}
            {_QueueDescription}
          </React.Fragment>
        )
        break;
      case STATE_MACHINE.DeleteQueue:
        VisibleInputs = (
          <React.Fragment>
            {_QueueID}
          </React.Fragment>
        )
        break;
      case STATE_MACHINE.GetQueueMember:
        VisibleInputs = (
          <React.Fragment>
            {_QueueID}
          </React.Fragment>
        )
        break;
      case STATE_MACHINE.NewQueueMember:
        VisibleInputs = (
          <React.Fragment>
            {_QueueID}
            {_MemberName}
            {_MemberQuestion}
          </React.Fragment>
        )
        break;
      case STATE_MACHINE.DeleteQueueMember:
        VisibleInputs = (
          <React.Fragment>
            {_MemberID}
          </React.Fragment>
        )
        break;
      default:
        VisibleInputs = (
          <React.Fragment>
          </React.Fragment>
        )
    }

    return (
      <div>
        <div>
          <button onClick={() => this.setState({curState: STATE_MACHINE.GetQueue})}>GetQueue</button>
          <button onClick={() => this.setState({curState: STATE_MACHINE.NewQueue})}>NewQueue</button>
          <button onClick={() => this.setState({curState: STATE_MACHINE.UpdateQueue})}>UpdateQueue</button>
          <button onClick={() => this.setState({curState: STATE_MACHINE.DeleteQueue})}>DeleteQueue</button>
        </div>

        <div>
          <button onClick={() => this.setState({curState: STATE_MACHINE.GetQueueMember})}>GetQueueMember</button>
          <button onClick={() => this.setState({curState: STATE_MACHINE.NewQueueMember})}>NewQueueMember</button>
          <button onClick={() => this.setState({curState: STATE_MACHINE.DeleteQueueMember})}>DeleteQueueMember</button>
        </div>

        <h3>{this.state.curState}</h3>

        <form onSubmit={(e) => this.handleSubmit(e)}>
          {VisibleInputs}
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}

export default APITest;
