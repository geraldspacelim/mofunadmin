import React, { Component } from "react";
import axios from "axios";
import {
  FaTelegramPlane,
  FaUndo,
  FaRegEye,
  FaBullhorn
} from "react-icons/fa";
import 'react-confirm-alert/src/react-confirm-alert.css';
import CustomMessage from "./customMessage.component";
import Notify from "./toastEmitter.component"
import { ToastContainer} from 'react-toastify';
import LoaderSpinner from './loaderSpinner.component'


const Subscriber = props => (
  <tr>
    <td>{props.currentSubscriber.userId}</td>
    <td>{props.currentSubscriber.username}</td>
    <td>{props.currentSubscriber.identity}</td>
    <td>{props.currentSubscriber.currentStatus}</td>
    <td>{props.currentSubscriber.enrolledProgram}</td>
    <td>{props.currentSubscriber.dateTimeJoined}</td>
    <td>
      <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" onChange={() => props.handleCheckBoxChange(props.currentSubscriber.userId, props.currentSubscriber.username)}/>
    </td>
    <td>
      <button
        type="button"
        className="btn btn-warning"
        onClick={() => props.deleteRequest(props.currentRequest.uuid)}
      >
        <FaRegEye />
      </button>
      <button
        type="button"
        className="btn btn-success"
        onClick={() => {props.handleShow(props.currentSubscriber.username, props.currentSubscriber.userId)}}
      >
        <FaTelegramPlane />
      </button>
    </td>
  </tr>
);

export default class Subscribers extends Component {
  constructor(props) {
    super(props);
    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.sendCustomMessage = this.sendCustomMessage.bind(this);
    this.onChangeCustomMessage = this.onChangeCustomMessage.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.refreshPage = this.refreshPage.bind(this);
    this.removeFromSubscriberList = this.removeFromSubscriberList.bind(this);

    this.state = {
      subscribers: [],
      username: "",
      show: false, 
      userId: 0,
      multiSubscribers: {}, 
      modalMultiSubscribers: {},
      checked: true,
      isMulti: false,
      loading: null, 
      customMessage: ""
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    this.setState({loading: true}, () => {
      axios
        .get("https://mofunadmin-server.glitch.me/api/getSubscribers")
        .then(response => {
          console.log(response);
          this.setState({ subscribers: response.data,loading: false });
          const notifer = {
            success: true,
            message: 'Success - Page Refreshed'
          }
          Notify(notifer)
        })
        .catch(error => {
          console.log(error);
        });
    })
  }

    subscribersList() {
    return this.state.subscribers.map(currentSubscriber => {
      return (
        <Subscriber
          currentSubscriber={currentSubscriber}
          handleShow={this.handleShow}
          handleCheckBoxChange={this.handleCheckBoxChange}
          checked = {this.state.multiSubscribers}
          key={currentSubscriber.userId}
        />
      );
    });
  }

  onChangeCustomMessage(e) {
    this.setState({
        customMessage: e.target.value
    })
  }

  // add remove from subscriber list {id:true}
  handleCheckBoxChange(userId, username) {
    let tempObj = JSON.parse(JSON.stringify(this.state.multiSubscribers));
    if (!(userId in tempObj)){
      tempObj[userId] = {
        isChecked: false, 
        username: username
      } 
    } else {
      delete tempObj[userId]
    }
    this.setState({
      multiSubscribers: tempObj
    })
  }

  handleShow(username, userId) {
    this.setState({
      show: true,
      username: username,
      userId: userId,
      isMulti: false
    });
  }


  handleClose() {
    let tempObj = JSON.parse(JSON.stringify(this.state.multiSubscribers));
    for (const [key, value] of Object.entries(tempObj)) {
      tempObj[key].isChecked = false
    }
    this.setState({
      show: false,
      multiSubscribers: tempObj
    });
  }

  removeFromSubscriberList(key) {
    let tempObj = JSON.parse(JSON.stringify(this.state.modalMultiSubscribers));
    if (Object.keys(tempObj).length == 1) {
      Notify(`You need at least 1 recepient`);
    } else {
      delete tempObj[key]
      this.setState({
        modalMultiSubscribers: tempObj
      })
    }
  }

  async refreshPage() {
    await this.fetchData()
    Notify(`Success - Page has been refreshed`);
  }

  sendCustomMessage(){
    if (this.state.customMessage == "") {
      const notifer = {
        success: false,
        message: 'Failure - Please input a message'
      }
      Notify(notifer)
      return 
    }
    if (this.state.isMulti) {
      const data = {
        chat_ids: this.state.modalMultiSubscribers, 
        broadcastMessage: this.state.customMessage 
      }
      this.setState({loading: true}, () => {
        axios
        .post(
          `https://mofunadmin-server.glitch.me/api/multiBroadcastMessage`,
          data
        )
        .then(response => {
          if (response) {
            this.setState({
              show: false,
              isMulti: true,
              loading: false,
            })
            const notifer = {
              success: true,
              message: 'Success - Custom Message Sent'
            }
            Notify(notifer)
          }
          console.log(response.data);
        }).catch(err => {
          console.log(err)
        })
      })
    } else {
      const data = {
        chat_id: this.state.userId,
        text: this.state.customMessage
      };
      axios
        .post(
          `https://api.telegram.org/bot1793164407:AAEBo5TwuA7DtkZjLIzRzQATFqHpR3il2RM/sendMessage`,
          data
        )
        .then(response => {
          if (response) {
            this.setState({
              show: false,
              isMulti: true 
            })
            Notify(`Success - Custom Message Sent`)
          }
          console.log(response.data);
        }).catch(err => {
          console.log(err)
        })
    }
}

  render() {
    return (
      this.state.loading ? <div className="spinner"><LoaderSpinner/> </div> :
      <div>
        <div className="d-flex justify-content-between">
          <h3>All Invoices</h3>
          <div class="column">

          <button
            type="button"
            className="btn btn-dark"
            onClick={() => {
              if (Object.keys(this.state.multiSubscribers).length == 0) {
                Notify(`You need to select at least 1 recepient`);
              } else {
                let tempObj = JSON.parse(JSON.stringify(this.state.multiSubscribers));
                this.setState({
                  show: true,
                  isMulti: true,
                  modalMultiSubscribers: tempObj
                })
              }
            }}
          >
            <FaBullhorn />
          </button>
          <button
            type="button"
            className="btn btn-dark"
            onClick={this.refreshPage}
          >
            <FaUndo />
          </button>
          </div>
        </div>
        <br></br>
        <div className="container">
            <table class="table">
            <thead class="thead-dark">
              <tr>
                <th className="col-md-1">User ID</th>
                <th className="col-md-1">Subscriber</th>
                <th className="col-md-1">Role</th>
                <th className="col-md-1">Existing Student</th>
                <th className="col-md-1">Enrolled Program</th>
                <th className="col-md-1">Date-Time Joined</th>
                <th className="col-md-1">Actions</th>
                <th className="col-md-1">Select</th>
              </tr>
            </thead>
            <tbody>{this.subscribersList()}</tbody>
          </table>
          <CustomMessage 
                show = {this.state.show}
                handleShow={this.handleClose}
                handleClose={this.handleClose}
                orderName={this.state.username}
                customMessage={this.state.customMessage}
                sendCustomMessage = {this.sendCustomMessage}
                onChangeCustomMessage = {this.onChangeCustomMessage}
                modalMultiSubscribers = {this.state.modalMultiSubscribers}
                isMulti = {this.state.isMulti}
                removeFromSubscriberList = {this.removeFromSubscriberList}
                >
          </CustomMessage>
        </div>
        <ToastContainer />
      </div>
    );
  }
}
