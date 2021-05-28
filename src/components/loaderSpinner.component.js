import Loader from "react-loader-spinner";
import React, { Component } from "react";

export default class LoaderSpinner extends Component {
  //other logic
  render() {
    return (
      <Loader
        type="Bars"
        color="#000000"
        height={50}
        width={50}
        timeout={3000} //3 secs
      />
    );
  }
}