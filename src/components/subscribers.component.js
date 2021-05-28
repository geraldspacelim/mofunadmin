import React, { Component } from "react";
import axios from "axios";
import {
  FaTelegramPlane,
  FaUndo,
  FaRegEye,
  FaBullhorn,
  FaUsers,
  FaTrashAlt
} from "react-icons/fa";
import 'react-confirm-alert/src/react-confirm-alert.css';
import CustomMessage from "./customMessage.component";
import Notify from "./toastEmitter.component"
import { ToastContainer} from 'react-toastify';
import LoaderSpinner from './loaderSpinner.component'
import { confirmAlert } from 'react-confirm-alert'; 


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
      <button
        type="button"
        className="btn btn-danger"
        onClick={() => {props.confirmAlertDialog(props.currentSubscriber.username, props.currentSubscriber.userId)}}
      >
        <FaTrashAlt />
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
    this.deleteUser = this.deleteUser.bind(this)
    this.confirmAlertDialog = this.confirmAlertDialog.bind(this)

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
      customMessage: "", 
      broadcastAll: false
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
          this.setState({ subscribers: response.data,loading: false, modalMultiSubscribers:{}, multiSubscribers: {} });
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
          confirmAlertDialog={this.confirmAlertDialog}
          key={currentSubscriber.userId}
        />
      );
    });
  }

  confirmAlertDialog(username, userId) {
    confirmAlert({
      title: `Submit to delete user ${username}`,
      message: `Are you sure you want to do this?`,
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.deleteUser(userId)
        },
        {
          label: 'No',
          onClick: () => {}
         }
      ]
    });
  };

  deleteUser(userId) {
    this.setState({loading: true}, () => {
    axios.delete('https://mofunadmin-server.glitch.me/api/deleteUser/' + userId)
      .then(response => {
        if (response) {
          this.setState({
            subscribers: this.state.subscribers.filter(el => el.userId !== userId),
            loading: false
          })
          const notifer = {
            success: true,
            message: 'Success - User Deleted'
          }
          Notify(notifer); 
        }
      });
    })
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
      const notifer = {
        success: false,
        message: 'You need at least 1 recepient'
      }
      Notify(notifer);
    } else {
      delete tempObj[key]
      this.setState({
        modalMultiSubscribers: tempObj
      })
    }
  }

  async refreshPage() {
    const res = await this.fetchData()
    if (res) {
      console.log(res)
      const notifer = {
        success: true,
        message: 'Success - Custom Message Sent', 
      }
      Notify(notifer);
    }
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
              isMulti: false,
              loading: false,
              modalMultiSubscribers: {}, 
              multiSubscribers: {}
            })
            const notifer = {
              success: true,
              message: 'Success - Broadcast message sent'
            }
            Notify(notifer)
          }
          console.log(response.data);
        }).catch(err => {
          console.log(err)
        })
      })
    } else if (this.state.broadcastAll) {
      let data = {
        broadcastMessage: this.state.broadcastMessage
      }
      this.setState({loading: true}, () => {
      axios
      .post(`https://mofunadmin-server.glitch.me/api/broadcastMessageToAll`, data)
      .then(response => {
        if (response) {
          this.setState({
            show: false, 
            broadcastAll: false,
            loading: false,
            modalMultiSubscribers: {}, 
            multiSubscribers: {}
          })
        }
        const notifier = {
          success: true,
          message: 'Success - Broadcast messsage sent'
        }
        Notify(notifier)
      });
    })
    } else {
      const data = {
        chat_id: this.state.userId,
        text: this.state.customMessage
      };
      this.setState({loading: true}, () => {
      axios
        .post(
          `https://api.telegram.org/bot1793164407:AAEBo5TwuA7DtkZjLIzRzQATFqHpR3il2RM/sendMessage`,
          data
        )
        .then(response => {
          if (response) {
            this.setState({
              show: false,
              loading: false,
              modalMultiSubscribers: {}, 
              multiSubscribers: {}
            })
            const notifier = {
              success: true,
              message: 'Success - Custom Message Sent'
            }
            Notify(notifier)
          }
          console.log(response.data);
        }).catch(err => {
          console.log(err)
        })
      })
    }
}

  render() {
    return (
      this.state.loading ? <div className="spinner"><LoaderSpinner/> </div> :
      <div>
        <div className="d-flex justify-content-between">
          <h3>Subscribers</h3>
          <div class="column">
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => {
              this.setState({
                show: true, 
                isMulti: false, 
                broadcastAll: true,
                username: "All Subscribers"
              })
            }}
          >
            <FaBullhorn />
          </button>
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => {
              if (Object.keys(this.state.multiSubscribers).length == 0) {
                const notifier = {
                  success: false,
                  message: 'You need to select at least 1 recepient'
                }
                Notify(notifier);
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
            <FaUsers />
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
                <th className="col-md-1">Select</th>
                <th className="col-md-1">Actions</th>
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
