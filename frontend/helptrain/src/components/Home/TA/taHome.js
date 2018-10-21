import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './taHome.scss'

const ONE_SECOND = 1000;
const SECONDS_BETWEEN_FETCH = 10;
const INTERVAL_FETCH = SECONDS_BETWEEN_FETCH * ONE_SECOND;

class TAHome extends React.Component {
  state = {
    members: null,
    fetchQueueMembersInterval: null
  }

  componentDidMount = () => {
    this.fetchQueueMembers();
    let fetchQueueMembersInterval = setInterval(this.fetchQueueMembers,INTERVAL_FETCH)
  }

  fetchQueueMembers = async() => {
    console.log("Fetching Queue");
    let response = await fetch(`http://138.68.55.179:8080/queuemembers/get/${this.props.queue.ID}`)
    let data = await response.json();
    this.setState({
      members: data
    })
  }

  deleteMember = async(id) => {
    console.log("deleteMember");
    let response = await fetch(`http://138.68.55.179:8080/queuemembers/delete/${id}`)
    this.fetchQueueMembers();
  }

  render () {
    let members = this.state.members;
    let queue;
    if(members !== null) {
      queue = members.map((member,i) => {
        return (
          <div key={i} className='queueMember'>
            <FontAwesomeIcon icon="user" />
            <span
              className='queueMember__Name'>
              {(!member.Name || member.Name.length === 0) ? 'Anonymous' : member.Name}
            </span>
            <span
              className='faCheckIcon'
              onClick={() => this.deleteMember(member.ID)}>
              <FontAwesomeIcon icon="check" />
            </span>
          </div>
        );
      })
    }

    return (
      <div className='taHomePage'>
        <div className='taHomePage__SessionInfo'>
          <h1>TA</h1>
          <span className='title'>Session: {this.props.queue.Name}</span>
          <br/>
          <span className='desc'>{this.props.queue.Description}</span>
        </div>

        <div className='taHomePage__Content'>
          <div className='taHomePage__Queue'>
            <h3>Queue</h3>
            <div className='taScrollView'>
              {queue}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TAHome;
