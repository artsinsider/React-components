import React, { Component, PropTypes } from 'react';
import classNames                      from 'classnames';


/**
 * WraperHandler - компонент реализует включение выключение 
 * @param  {Boolean} [props#disabled] - Если true, делает комопнент не активным.
 * @param  {string} className дополнительный css класс
 * @param  {requestCallback} [props#clickHandler] функция при клике
 * @param  {Function} [props#changeHandler] - Обработчик события onchange.
 * @param  {Function} [props#blurHandler]   - Обработчик события onblur.
 * @param  {Function} [props#focusHandler]  - Обработчик события, возникающего при наведении фокуса.
 * @param  {Function} [props#onMouseOver]   - Обработчик mouseover.
 * @param  {Function} [props#onMouseOut]    - Обработчик mouseout.
 * 
 * 
 * @param  {object} children 
 */
export default class WraperHandler extends Component {

	static propTypes = {
		disabled        : PropTypes.bool,
		className       : PropTypes.string,
		children        : PropTypes.node,
		onClickHandler  : PropTypes.func,
		onBlurHandler   : PropTypes.func,
		mouseUpHandler  : PropTypes.func,
		mouseDownHandler: PropTypes.func,
		mouseOutHandler : PropTypes.func,
		mouseOverHandler: PropTypes.func,
		focusHandler    : PropTypes.func
	};

	constructor(props) {
		super(props);
	}

	render() {
		const {children, disabled, className, tabIndexProp, 
					mouseDownHandler, mouseUpHandler, onClickHandler, onBlurHandler, 
						focusHandler, mouseOverHandler, mouseOutHandler} = this.props;

        const baseCls = classNames(className, {"disabled": disabled})

		if(disabled) {
			return (
				<div tabIndex={tabIndexProp}
					className={baseCls}>
						{children}
				</div>
			);
		} else {
			return (
				<div tabIndex  ={tabIndexProp}
					onMouseDown={mouseDownHandler} 
					onMouseOver={mouseOverHandler}
					onMouseOut ={mouseOutHandler}  
					onMouseUp  ={mouseUpHandler}
					onClick    ={onClickHandler} 
					onFocus    ={focusHandler}
					onBlur     ={onBlurHandler}
					className  ={baseCls}>
					
						{children}
				</div>
			);
		}

	}
}