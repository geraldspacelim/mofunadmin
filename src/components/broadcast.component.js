import React, { Component } from 'react';
import axios from 'axios'
import Notify from "./toastEmitter.component"
import { ToastContainer} from 'react-toastify';


export default class BroadcastMessage extends Component {
    constructor(props) {

        super(props); 

        this.onChangeBroadcastMessage = this.onChangeBroadcastMessage.bind(this);
        this.onSubmit = this.onSubmit.bind(this);


        this.state = {
           broadcastMessage: "",
           users: []
        }
    }

    componentDidMount() {
    axios
      .get("https://mofunadmin-server.glitch.me/api/getUniqueUsers")
      .then(response => {
        this.setState({ users: response.data });
      })
      .catch(error => {
        console.log(error);
      });
    }

    onChangeBroadcastMessage(e) {
        this.setState({
            broadcastMessage: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault();
        this.setState({
            broadcastMessage: ""
        })
        const data = {
            userIds: this.state.users, 
            broadcastMessage: this.state.broadcastMessage
        }
        axios
        .post(`https://mofunadmin-server.glitch.me/api/broadcastMessage`, data)
        .then(response => {
          console.log(response);
          Notify(`Success - Broadcasted to Subscribers`)
        });
        // console.log(product)
       
    }


    render() {
        return ( 
            <div>
      <h3>Broadcast Message</h3>
      <br></br>
      <form onSubmit={this.onSubmit}>
        <div className="form-group">
            {/* <label for="exampleFormControlTextarea1">Example textarea</label> */}
            <textarea 
            className="form-control" 
            id="exampleFormControlTextarea1" 
            rows="5"
              required
              className="form-control"
              value={this.state.broadcastMessage}
              onChange={this.onChangeBroadcastMessage}
              placeholder="Type your custom message here"
              >
            </textarea>
        </div>
        <br></br>
        <div className="form-group">
          <input type="submit" value="Submit" className="btn btn-primary" />
        </div>
      </form>
      <ToastContainer />
    </div>
           
        )
    }
}