import React, { Component } from 'react'

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      age: "",
      location: "",
      level: 0,  // 0 = Initiate, 1 = Padawan, 2 = Knight, 3 = Master
    }
  }

  render() {
    return (
      <div>
        
      </div>
    )
  }
}
