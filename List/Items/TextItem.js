import React, {Component, PropTypes} from 'react';
import Item                          from './Item';
import classNames                    from 'classnames';

/**
 * Создает отдельные текстовые элементы списка.
 * @param {Object} props - Свойства эелемента, из обязатльных.
 * @param {String} props#children - Текст в списке элемента.
 * @param {Function} props#clickHandler - Обработчик клика на элемент.
 * @param {String} [props#className] - Дополнительный к базовому набор классов.
 * @param {String} [props#classPref = "virtu-text"] - Префикс к базовому классу.
 * @param {String} props#id - id уникальный id элемента.
 */
const TextItem = props => {

	const {classPref='virtu-text', children=props.value} = props;
	return (
		<Item {...props} classPref={classPref} text={children} >
			{children}
		</Item>
	);
	
};

TextItem.propTypes = {
	className: PropTypes.string,
	classPref: PropTypes.string,
    value: PropTypes.string.isRequired,
    children: PropTypes.string,
	id: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string
		]),
	clickHandler: PropTypes.func.isRequired,
	mouseOver: PropTypes.func
};

export default TextItem;