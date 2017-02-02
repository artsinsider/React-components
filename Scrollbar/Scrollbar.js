import React, { PropTypes, Component }    from 'react';
import ReactDOM                           from 'react-dom';
import GeminiScrollbar                    from 'gemini-scrollbar';

/**
 * Класс для отрисовки скрола.
 * @param {String} [props#children] -
 */
export default class Scrollbar extends Component {

  static propTypes = {
    autoshow: React.PropTypes.bool,
    forceGemini: React.PropTypes.bool
  };

  static defaultProps = {
    autoshow: false,
    forceGemini: false
  };

  componentDidMount() {
    this.scrollbar = new GeminiScrollbar({
      element: ReactDOM.findDOMNode(this._node),
      autoshow: this.props.autoshow,
      forceGemini: this.props.forceGemini,
      createElements: false
    }).create();
  }

  componentDidUpdate() {
    this.scrollbar.update();
  }

  componentWillUnmount() {
    if (this.scrollbar) {
      this.scrollbar.destroy();
    }
    this.scrollbar = null;
  }

  render() {
    var {className, children, autoshow, forceGemini, resize, ...other} = this.props,
        classes = '';

    this.refs = {};

    if (className) {
      classes += ' ' + className;
    }

    return (
        <div {...other} className={classes} ref={x => this._node = x}>
          <div className='gm-scrollbar -vertical'>
            <div className='thumb'></div>
          </div>
          <div className='gm-scrollbar -horizontal'>
            <div className='thumb'></div>
          </div>
          <div className='gm-scroll-view'>
            {children}
          </div>
        </div>
    );
  }
}
