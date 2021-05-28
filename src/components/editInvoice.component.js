import React, { Component } from 'react';
import axios from 'axios'
import { Form, Container } from 'react-bootstrap';

export default class EditInvoice extends Component {
    constructor(props) {

        super(props); 

        this.state = {
            cage: "",
            classDate: "",
            classDuration: "",
            classPayload: "", 
            classVenue: "", 
            courseName: "",
            cname: "", 
            courseName: "", 
            orderContact: "", 
            orderName:  "",
            orderStatus: "", 
        }
    }

    componentDidMount() {
        axios.get('https://mofunadmin-server.glitch.me/api/getUserInvoice/' + this.props.match.params.id)
        .then(response => {
            if (response.data.length > 0) {
                console.log(response)
                const data = response.data[0] 
                this.setState({
                    cage: data.cage,
                    classDate: data.classDate,
                    classDuration: data.classDuration,
                    classPayload: data.classPayload, 
                    classVenue: data.classVenue, 
                    cname: data.cname, 
                    courseName: data.courseName, 
                    orderContact: data.orderContact, 
                    orderName:  data.orderName,
                    orderStatus: data.orderStatus, 
                    courseName: data.courseName
                })
            }                
        })
    }

    onChangeOrderName(e) {
        this.setState({
            orderName: e.target.value
        })
    }

    onChangeCourseName(e) {
        this.setState({
            courseName: e.target.value
        }) 
    }

    onChangeClassDate(e) {
        this.setState({
            classDate: e.target.value
        })
    }

    onChangeClassDuration(e) {
        this.setState({
            classDuration: e.target.value
        })
    }

    onChangeOrderContact(e) {
        this.setState({
            orderContact: e.target.value
        })
    }

    onChangeCName(e) {
        this.setState({
            cname: e.target.value
        })
    }

    onChangeCAge(e) {
        this.setState({
            cage:e.target.value
        })
    }

    onChangeClassVenue(e) {
        this.setState({
            classVenue: e.target.value
        })
    }

    onChangeOrderStatus(e) {
        this.setState({
            orderStatus: e.target.value
        })
    }

    // onSubmit(e) {
    //     e.preventDefault();
    //     const product = {
    //         name: this.state.name,  
    //         price: this.state.price, 
    //         discountPrice: this.state.discountPrice, 
    //         category: this.state.category, 
    //         sale: this.state.sale,
    //         quantity: this.state.quantity,
    //         img: this.state.img, 
    //         isAvailable: this.state.isAvailable,  

    //     }
    //     // console.log(product)
    //     axios.post('https://swiftys-server.glitch.me/api/shop/updateProduct/' + this.props.match.params.id, product)
    //         .then(res => console.log(res.data)).then((_) =>  window.location = '/products');
    // }


    render() {
        return ( 
            <div>
      <h3>Edit Invoice</h3>
      <form onSubmit={this.onSubmit}>
      <Form>
        <Form.Group controlId="formBasicEmail">
            <Form.Label>Program:</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>
        </Form>
        <br></br>
        <div className="form-group"> 
          <label>Program: </label>
          <input  type="text"
              required
              className="form-control"
              value={this.state.courseName}
              onChange={this.onChangeCourseName}
              />
        </div>
        <br></br>
        <div className="form-group">
          <label>Date:</label>
          <input 
              type="text" 
              className="form-control"
              value={this.state.classDate}
              onChange={this.onChangeClassDate}
              />
        </div>
        <div className="form-group">
          <label>Duration: </label>
          <div>
          <input 
              type="text" 
              className="form-control"
              value={this.state.classDuration}
              onChange={this.onChangeClassDuration}
              />
          </div>
        </div>
        <div className="form-group">
          <label>Contact: </label>
          <div>
          <input 
              type="text" 
              className="form-control"
              value={this.state.orderContact}
              onChange={this.onChangeOrderContact}
              />
          </div>
        </div>
        <div className="form-group">
          <label>Participant: </label>
          <div>
          <input 
              type="text" 
              className="form-control"
              value={this.state.cname}
              onChange={this.onChangeCName}
              />
          </div>
        </div>
        <div className="form-group">
          <label>Participant's Age: </label>
          <div>
          <input 
              type="text" 
              className="form-control"
              value={this.state.cage}
              onChange={this.onChangeCAge}
              />
          </div>
        </div>
        <div className="form-group">
          <label>Venue: </label>
          <div>
          <input 
              type="text" 
              className="form-control"
              value={this.state.classVenue}
              onChange={this.onChangeClassVenue}
              />
          </div>
        </div>
        <div className="form-group">
          <label>Status: </label>
          <div>
          <input 
              type="text" 
              className="form-control"
              value={this.state.orderStatus}
              onChange={this.onChangeOrderStatus}
              />
          </div>
        </div>

        <div className="form-group">
          <input type="submit" value="Edit Invoice Log" className="btn btn-primary" />
        </div>
      </form>
    </div>
        )
    }
}