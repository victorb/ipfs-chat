import React from 'react';
import 'styles/core.scss';

export default class CoreLayout extends React.Component {
  static propTypes = {
    children : React.PropTypes.element
  }

  constructor () {
    super();
  }

  render () {
    return (
      <div>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}
