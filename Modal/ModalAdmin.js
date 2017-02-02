import React, {Component, PropTypes}        from 'react';
import ReactModal                           from 'react-modal';
import {merge}                              from 'ramda'

const defaultStyles = {
  overlay: {
    position        : 'fixed',
    top             : 0,
    left            : 0,
    right           : 0,
    bottom          : 0,
    backgroundColor : 'rgba(0, 0, 0, 0.1)'
  },
  content: {
    position                : 'absolute',
    top                     : '40px',
    left                    : '0',
    right                   : '0',
    bottom                  : '40px',
    border                  : '0px',
    background              : 'transparent',
    overflow                : 'visible',
    WebkitOverflowScrolling : 'touch',
    borderRadius            : '0px',
    outline                 : 'none',
    padding                 : '0px',
    margin                  : 'auto'
  }
};


/**
 * Элемент, создающий модальное окно,
 * которое состоит из области диалога и крестика для его закрытия
 */
export default class ModalAdmin extends Component {

  static PropTypes = {
    closeHandler: PropTypes.func.isRequired,
    style: PropTypes.object
  };


  constructor (props) {
    super(props);

    this.state = {
      expand: false
    };

    this.expandHandler = this.expandHandler.bind(this);
  };

  expandHandler(){
    console.log("expand");
  }

  render() {
    const {
      style = {},
      expandable = false
    } = this.props;

    let reactModalStyle = defaultStyles;
    reactModalStyle.content = merge(defaultStyles.content, style);

    return (
      <ReactModal isOpen {...this.props} style={reactModalStyle}>
        {expandable ?
          <div className={'expand-image'} onClick={this.expandHandler}>
            <img className="expand-image-icon"
                 src={`resources/img/icons/Full_size.svg`}/>
          </div>: null}
        <div ref={r => this._content = r} className={'modal-content'}>{this.props.children}</div>
      </ReactModal>
    );
  }
}
