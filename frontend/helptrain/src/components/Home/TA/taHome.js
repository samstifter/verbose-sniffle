import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Howl, Howler} from 'howler';
import Notifier from "react-desktop-notification"


import './taHome.scss'

const ONE_SECOND = 1000;
const SECONDS_BETWEEN_FETCH = 10;
const INTERVAL_FETCH = SECONDS_BETWEEN_FETCH * ONE_SECOND;

var sound = new Howl({
  src: ['sound.mp3']
});

class TAHome extends React.Component {
  state = {
    members: null,
    fetchQueueMembersInterval: null,
    previousQueueLength: 0
  }

  componentDidMount = () => {
    this.fetchQueueMembers();
    let fetchQueueMembersInterval = setInterval(this.fetchQueueMembers,INTERVAL_FETCH)
  }

  fetchQueueMembers = async() => {


    console.log("Fetching Queue");
    let response = await fetch(`https://138.68.55.179:8080/queuemembers/get/${this.props.queue.ID}`)
    let data = await response.json();

    if(data.length !== this.state.previousQueueLength) {
      //Notifier.start(`New Student: ${data[0].Name}`,`Question: ${data[0].Question}`,"","https://upload.wikimedia.org/wikipedia/commons/8/87/Google_Chrome_icon_%282011%29.png");
    }

    this.setState({
      members: data,
      previousQueueLength: data.length
    })
  }

  deleteMember = async(id) => {
    console.log("deleteMember");
    let response = await fetch(`https://138.68.55.179:8080/queuemembers/delete/${id}`, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: {}
    });
    this.fetchQueueMembers();
  }

  notify = () => {
    Notifier.start("Title","Here is context","www.google.com","https://upload.wikimedia.org/wikipedia/commons/8/87/Google_Chrome_icon_%282011%29.png");
  }

  render () {
    let members = this.state.members;
    let queue;
    if(members !== null) {
      queue = members.map((member,i) => {
        return (
          <div key={i} className='queueMember'>
            <div>
              <FontAwesomeIcon icon="user" />
              <span
                className='queueMember__Name'>
                {(!member.Name || member.Name.length === 0) ? 'Anonymous' : member.Name}
              </span>
            </div>
            <span
              className='queueMember__Question'>
              {member.Question}
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
