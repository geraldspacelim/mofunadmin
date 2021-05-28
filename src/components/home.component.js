import React, { Component } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import {
  FaCheck,
  FaTelegramPlane,
  FaTimes,
  FaUndo,
  FaPencilAlt
} from "react-icons/fa";
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import CustomMessage from "./customMessage.component";
import Notify from "./toastEmitter.component"
import { ToastContainer} from 'react-toastify';
import LoaderSpinner from './loaderSpinner.component'
import "../App.css"

const Invoice = props => (
  <tr>
    <td>{props.currentInvoice.orderName}</td>
    <td>{props.currentInvoice.courseName}</td>
    <td>{props.currentInvoice.classDate}</td>
    <td>{props.currentInvoice.classDuration}</td>
    <td>{props.currentInvoice.orderContact}</td>
    <td>{props.currentInvoice.cname}</td>
    <td>{props.currentInvoice.cage}</td>
    <td>{props.currentInvoice.classVenue}</td>
    <td>{props.currentInvoice.orderStatus}</td>
    <td>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => props.confirmAlertDialog(props, "approved")}
        // onClick={() => props.updateInvoice(props, "approved")}
      >
        <FaCheck />
      </button>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => props.confirmAlertDialog(props, "rejected")}
      >
        <FaTimes />
      </button>
      <button
        type="button"
        className="btn btn-success"
        onClick={() => {props.handleShow(props.currentInvoice.orderName, props.currentInvoice.userId)}}
      >
        <FaTelegramPlane />
      </button>
      <Link to={"/editInvoice/"+props.currentInvoice.orderId}> 
      <button
        type="button"
        className="btn btn-warning"
      >
        <FaPencilAlt />
      </button>
      </Link>
    </td>
  </tr>
);

export default class Home extends Component {
  constructor(props) {
    super(props);
    // this.deleteRequest = this.deleteRequest.bind(this)
    this.updateInvoice = this.updateInvoice.bind(this);
    this.refreshPage = this.refreshPage.bind(this);
    this.confirmAlertDialog = this.confirmAlertDialog.bind(this)
    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.sendCustomMessage = this.sendCustomMessage.bind(this);
    this.onChangeCustomMessage = this.onChangeCustomMessage.bind(this);
    this.state = {
      invoices: [],
      alert: false,
      alertMessage: "",
      showModal: false,
      orderName: "",
      userId: 0,
      customMessage: "",
      loading: null, 
    };
  }

  componentDidMount() {
    // const tokenString = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjA1Njc1ODB9.4LS_s_FphPH1OviiYmGqmwvs-f8GO0qIklFetOQQ0yU"
    this.fetchData();
  }

  fetchData() {
    this.setState({loading: true}, () => {
      axios
      .get("https://mofunadmin-server.glitch.me/api/getInvoices")
      .then(response => {
        this.setState({ invoices: response.data , loading: false});
      })
      .catch(error => {
        console.log(error);
      });
    })
  }
  
  confirmAlertDialog(props, orderStatus) {
      confirmAlert({
        title: `Submit to ${orderStatus.slice(0, orderStatus.length - (orderStatus==="approved" ? 1 : 2))}`,
        message: `Are you sure you want to do this?`,
        buttons: [
          {
            label: 'Yes',
            onClick: () => this.updateInvoice(props, orderStatus)
          },
          {
            label: 'No',
            onClick: () => {}
           }
        ]
      });
    };

  updateInvoice(props, orderStatus) {
    const data = {
      orderId: props.currentInvoice.orderId,
      orderStatus: orderStatus
    };
    this.setState({loading: true}, () => {
    axios
      .post("https://mofunadmin-server.glitch.me/api/updateOrderStatus", data)
      .then(async() => {
          await this.updateCount(props.currentInvoice.classPayload);
          await this.sendUpdateNotification(props, orderStatus)
          const objIndex = this.state.invoices.findIndex(
            obj => obj.orderId === props.currentInvoice.orderId
          );
          let tempInvoices = [...this.state.invoices];
          tempInvoices[objIndex].orderStatus = orderStatus;
          this.setState({
            invoices: tempInvoices,
            loading: false
          });
          const notifer = {
            success: true,
            message: `Success - Changed to ${orderStatus[0].toUpperCase() + orderStatus.slice(1)}`
          }
          Notify(notifer)
      });
    })
  }

  updateCount(classPayload) {
    const data = {
      classPayload: classPayload
    };
    axios
      .post(`https://mofunadmin-server.glitch.me/api/reduceCount`, data)
      .then(response => {
        console.log(response.data);
      });
  }

  sendUpdateNotification(props, orderStatus) {
    let teleNotification;
    if (
      /HC/.test(props.currentInvoice.classPayload) &&
      orderStatus === "approved"
    ) {
      teleNotification = `Dear ${props.currentInvoice.orderName}, ${props.currentInvoice.cname}'s registration for ${props.currentInvoice.courseName} on ${props.currentInvoice.classDate} (${props.currentInvoice.classDuration}) has been confirmed. Looking forward to see you. Thank you.`;
    } else if (
      /HC/.test(props.currentInvoice.classPayload) &&
      orderStatus === "rejected"
    ) {
      teleNotification = `Dear ${props.currentInvoice.orderName}, I am sorry to inform you that ${props.currentInvoice.cname}'s registration for ${props.currentInvoice.courseName} on ${props.currentInvoice.classDate} (${props.currentInvoice.classDuration}) is fully booked due to overwhelming response.  Our course coordinator will contact you for arranging the alternative dates for Rubik's Cube Holiday Camp. Thank you.`;
    } else if (
      /TC/.test(props.currentInvoice.classPayload) &&
      orderStatus === "approved"
    ) {
      teleNotification = `Dear ${props.currentInvoice.orderName}, ${props.currentInvoice.cname}'s slot for ${props.currentInvoice.courseName} on the ${props.currentInvoice.classDate} has been confirmed. Our course coordinator will contact you for confirming the exact date of the Trial Class. Thank you.`;
    } else {
      teleNotification = `Dear ${props.currentInvoice.orderName}, I am sorry to inform you that ${props.currentInvoice.cname}'s application for ${props.currentInvoice.courseName} on ${props.currentInvoice.classDate} is fully booked. Our course coordinator will contact you for confirming the Trial Class on alternative date. Thank you.`;
    }
    const data = {
      chat_id: props.currentInvoice.userId,
      text: teleNotification
    };
    axios
      .post(
        `https://api.telegram.org/bot1793164407:AAEBo5TwuA7DtkZjLIzRzQATFqHpR3il2RM/sendMessage`,
        data
      )
      .then((_) => {
      });
  }

  invoicesList() {
    return this.state.invoices.map(currentInvoice => {
      return (
        <Invoice
          confirmAlertDialog={this.confirmAlertDialog}
          currentInvoice={currentInvoice}
          updateInvoice={this.updateInvoice}
          handleShow={this.handleShow}
          key={currentInvoice.orderId}
        />
      );
    });
  }

  onChangeCustomMessage(e) {
    this.setState({
        customMessage: e.target.value
    })
  }

  async refreshPage() {
    await this.fetchData()
    Notify(`Success - Page has been refreshed`)
  }

  handleClose() {
    this.setState({
      show: false
    });
  }

  handleShow(orderName, userId) {
    this.setState({
      show: true,
      orderName: orderName,
      userId: userId,
    });
  }

  sendCustomMessage(){
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
            loading: false
          })
          const notifer = {
            success: true,
            message: `Success - Custom message sent`
          }
          Notify(notifer)
        }
        console.log(response.data);
      }).catch(err => {
        console.log(err)
      })
    })
}

  render() {
    return (
      this.state.loading ? <div className="spinner"><LoaderSpinner/> </div> :
      <div>
        <div className="d-flex justify-content-between">
          <h3>All Invoices</h3>
          <button
            type="button"
            className="btn btn-dark"
            onClick={this.refreshPage}
          >
            <FaUndo />
          </button>
        </div>
        <br></br>
        <div className="container">
          <table class="table">
            <thead class="thead-dark">
              <tr>
                <th className="col-md-1">Applicant</th>
                <th className="col-md-2">Program</th>
                <th className="col-md-1">Date</th>
                <th className="col-md-1">Duration</th>
                <th className="col-md-1">Contact</th>
                <th className="col-md-1">Participant</th>
                <th className="col-md-1">Age</th>
                <th className="col-md-1">Venue</th>
                <th className="col-md-1">Status</th>
                <th className="col-md-2">Actions</th>
              </tr>
            </thead>
            <tbody>{this.invoicesList()}</tbody>
          </table>
          <CustomMessage 
                show = {this.state.show}
                handleShow={this.handleClose}
                handleClose={this.handleClose}
                orderName={this.state.orderName}
                customMessage={this.state.customMessage}
                sendCustomMessage = {this.sendCustomMessage}
                onChangeCustomMessage = {this.onChangeCustomMessage}
                >
            </CustomMessage>
        </div>
        <ToastContainer />
      </div>
    );
  }
}
