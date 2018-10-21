import React from 'react'
import PropTypes from 'prop-types'

class Demo extends React.Component {
  state = {
    num: 1
  }

  count = () => {
    this.setState({
      num: ++this.state.num
    })
  }

  render () {
    return (
      <div>
        <h1>Hello World</h1>
        <h4>{this.props.name}</h4>
        {this.state.num}
        <br/>
        <button onClick={() => this.count()}>Add 1</button>
      </div>
    )
  }
}

export default Demo;

Demo.propTypes = {
  name: PropTypes.string
};

Demo.defaultProps = {
  name: 'Stranger'
};
