import React, { Component, PropTypes } from 'react';
import classNames                      from 'classnames';
import WraperHandler                    from '../Buttons/WraperHandler/WraperHandler';

/**
 * Вращающиеся стрелка
 * @param {Object} props - Свойства стрелки.
 * @param {Boolean} [props#disabled] - Если true, делает комопнент не активным.
 * @param {String} [props#className] - Дополнительный набор классов.
 * @param {Boolean} props#open - Состояние.
 * @param {Function} props#viewList - Общий метод отображения состояния, выполняющийся по событиям blur и click.
 * @param {Function} [props#mouseOver] - Обработчик mouseover.
 * @param {Function} [props#mouseOut] - Обработчик mouseout.
 */
const RotatingArrow = props => {
	const {viewList, mouseOver, mouseOut, open} = props;
	const className = classNames('arrow', {'arrow-down': open, 'arrow-up': !open}, props.className);

	return <WraperHandler {...props} 
				tabIndexProp        ="0" 
				className       ={className} 
				onBlurHandler   ={viewList} 
				onClickHandler  ={viewList} 
				mouseOverHandler={mouseOver} 
				mouseOutHandler ={mouseOut} />;
};

RotatingArrow.propTypes = {
	className : PropTypes.string,
	open      : PropTypes.bool.isRequired,
	viewList  : PropTypes.func.isRequired,
	mouseOver : PropTypes.func,
	mouseOut  : PropTypes.func
};

export default RotatingArrow;