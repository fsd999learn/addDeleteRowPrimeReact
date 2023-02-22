import React, { Component } from 'react';

export default class Home extends Component {
  componentDidCatch(error, info) {
    console.log(error, info);
  }

  render() {
    return <div>Home Page</div>;
  }
}
