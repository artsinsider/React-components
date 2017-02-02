import React, { Component, PropTypes } from 'react';
import classNames                      from 'classnames';
import WraperHandler                    from '../WraperHandler/WraperHandler';


/**
 * ButtonBasic - базовый компонент кнопки
 * @param  {string} text заголовок кнопки
 * @param  {Boolean} [props#disabled] - Если true, делает комопнент не активным.
 * @param  {Boolean} disabled делает кнопку неактивной
 * @param  {string} className дополнительный css класс
 * @param  {Boolean} icon отоброжает иконку
 * @param  {Boolean} select выбор возможных действий
 * @param  {requestCallback} clickHandler функция при клике
 * @param  {object} children 
 * @param  {string} value значение кнопок выбора
 */
export default class ButtonBasic extends Component {

	static propTypes = {
		text     : PropTypes.string.isRequired,
		disabled : PropTypes.bool,
		className: PropTypes.string,
		icon: PropTypes.bool,
		select: PropTypes.bool,
        clickHandler: PropTypes.func,
        children: PropTypes.node,
        value: PropTypes.string
	};

	constructor(props) {
		super(props);

		this.renderButton = () => props.icon ? this.renderWithIcon() : props.select ? this.renderSelectButton() : this.renderPlainText();
		this.baseCls      = 'virtu-button';
		this.state        = props.select ? {value: props.value || '', text: props.text} : {};

		this.mouseDownHandler = e => this.onMouseDown(e);
		this.mouseUpHandler   = e => this.onMouseUp(e);
		
	}

	renderSelectButton () {
		const state                            = this.state;
		const {text=this.props.text, showList} = state;
		const innerCls                         = 'button-inner';
		const iconCls                          = 'button-icon';
		const textCls                          = 'button-text';
		const listCls                          = classNames('button-selection-list', {hidden: !showList});
		const { disabled } = this.props;
		return (
			<div>
				<div className={innerCls}>
					<span className={textCls}>{text}</span>
					<div className={iconCls}></div>
				</div>
				<div className={listCls}>
					{disabled ? <div/> : this.props.children}
				</div>
			</div>
		);
	}

	renderWithIcon() {
		const innerCls     = 'button-inner';
		const iconOuterCls = 'button-icon-outer';
		const iconCls      = 'button-icon';
		const textCls      = 'button-text';

		return (
			<div className={innerCls}>
				<div className={iconOuterCls}>
					<div className={iconCls}></div>
				</div>
				<span className={textCls}>{this.props.text}</span>
			</div>
		);
	}

	renderPlainText() {
		return <span>{this.props.text}</span>;
	}

	onMouseDown() {
		this.setState({ ...this.state, pressed: true });
	}

	onMouseUp() {
		this.setState({ ...this.state, pressed: false });
	}

	render() {
        const { text, className, icon, clickHandler, select, disabled } = this.props;
		const { pressed } = this.state;
		const btnCls = classNames(className, this.baseCls, {
			'with-icon': icon,
			'button-select': select,
            'button-disabled': disabled,
			pressed
		});

			return ( 
				<WraperHandler 
					disabled={disabled}
					tabIndex="1" 
					mouseDownHandler={this.mouseDownHandler} 
					mouseUpHandler  ={this.mouseUpHandler} 
					onClickHandler  ={select ? (() => {this.setState({...this.state, showList: !this.state.showList});}) : clickHandler} 
					onBlurHandler   ={() => {this.setState({...this.state, showList: false});}} 
					className  ={btnCls}>
						{this.renderButton()}
				</WraperHandler>
			);
		}

	
}