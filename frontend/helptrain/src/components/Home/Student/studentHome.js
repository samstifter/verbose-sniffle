import React from 'react'
//import PropTypes from 'prop-types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './studentHome.scss'

const ONE_SECOND = 1000;
const SECONDS_BETWEEN_FETCH = 10;
const INTERVAL_FETCH = SECONDS_BETWEEN_FETCH * ONE_SECOND;

class StudentHome extends React.Component {
  state = {
    members: null,
    addToQueueIsOpen: false,
    question: '',
    postError: null,
    fetchQueueMembersInterval: null
  }

  componentDidMount = () => {
    this.fetchQueueMembers();
    let fetchQueueMembersInterval = setInterval(this.fetchQueueMembers,INTERVAL_FETCH)
  }

  componentWillUnmount() {
    clearInterval(this.state.fetchQueueMembersInterval)
  }

  fetchQueueMembers = async() => {
    console.log("Fetching Queue");
    let response = await fetch(`http://138.68.55.179:8080/queuemembers/get/${this.props.queue.ID}`)
    let data = await response.json();
    this.setState({
      members: data
    })
  }

  addToQueue = async(e) => {
    e.preventDefault();
    this.setState({
      postError: null
    })
    let body = JSON.stringify({
      Name: this.props.userName,
      Question: this.state.question,
      QueueID: this.props.queue.ID
    })
    let response = await fetch(`http://138.68.55.179:8080/queuemembers/new/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: body
    });
    if(!response.ok) {
      console.log(response);
      this.setState({
        postError: 'Error Joining Queue, Try again'
      })
    }
    this.fetchQueueMembers();//Could keep local state in redux

    this.setState({
      addToQueueIsOpen: false
    })
  }

  handleQuestionChange = (e) => {
    this.setState({question: e.target.value});
  }

  render () {
    let members = this.state.members;
    let queue;
    if(members !== null) {
      queue = members.map((member,i) => {
        if(i === 0) return null;//This is the current person
        return (
          <div key={i} className='queueMember'>
            {
              this.props.queue.userName === member.Name
              &&
              <span>Me! </span>
            }
            <FontAwesomeIcon icon="user" /><span className='queueMember__Name'>{(!member.Name || member.Name.length === 0) ? 'Anonymous' : member.Name}</span>
          </div>
        );
      })
    }

    return (
      <div className='studentHomePage'>
        <div className='studentHomePage__SessionInfo'>
          <span className='title'>Session: {this.props.queue.Name}</span>
          <br/>
          <span className='desc'>{this.props.queue.Description}</span>
        </div>

        <div className='studentHomePage__Content'>
          <div className='studentHomePage__Queue'>
            <h3>Queue</h3>
            <div className='scrollView'>
              {queue}
            </div>
          </div>

          <div className='studentHomePage__Current'>
            {
              members !== null && members[0] !== null
              &&
              <div>
                <h3>Current</h3>
                {
                  this.props.queue.userName === members[0].Name
                  &&
                  <span>Me! </span>
                }
                {members[0].Name}
              </div>
            }
          </div>
        </div>

        <button className='studentHomePage__Add' onClick={() => this.setState({addToQueueIsOpen: true})}>+</button>

        {/*Add To Queue Modal*/}
        {
          this.state.addToQueueIsOpen
          &&
          <div className='addToQueueModal__container'>
            <div className='addToQueueModal'>
              <form onSubmit={this.addToQueue}>
                <label>Question: <input value={this.state.question} onChange={this.handleQuestionChange}/></label>
                <div>
                  <input type="submit" value="Submit" />
                  <button onClick={() => this.setState({addToQueueIsOpen: false})}>Close</button>
                </div>
              </form>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default StudentHome;
