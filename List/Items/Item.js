import React, {Component, PropTypes} from 'react';
import classNames                    from 'classnames';

/**
 * Класс создает отдельные элементы списка.
 * @extends React#Component
 */
export default class Item extends Component {
	static propTypes = {
		className: PropTypes.string,
		classPref: PropTypes.string,
		value: PropTypes.string,
		text: PropTypes.string,
		children: PropTypes.node.isRequired,
		id: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string
		]),
		clickHandler: PropTypes.func.isRequired,
		mouseOver: PropTypes.func,
		mouseOut: PropTypes.func

	};

	/**
	 * @param {Object} props - Свойства эелемента, из обязатльных.
	 * @param {String} props#id - id уникальный id элемента.
	 * @param {String}[ props#value] - Значение, соответсвующее элементу.
	 * @param {String} [props#text] - Текст, соответсвующий элементу.
	 * @param {Node} props#children - Текст в списке элемента.
	 * @param {Function} props#clickHandler - Обработчик клика на элемент.
	 * @param {String} [props#className] - Дополнительный к базовому набор классов.
	 * @param {String} [props#classPref = "virtu"] - Префикс к базовому классу.
	 */
	constructor (props) {
		super(props);

		this.baseCls = `${props.classPref || 'virtu'}-item`;
		this.clickHandler = this.clickHandler.bind(this);
	}

	clickHandler() {
		const {clickHandler, id, value, text} = this.props;
		return () => {clickHandler(id, value, text);};
	}

	render () {
		const {props, clickHandler} = this;
		const {checked, mouseOver, mouseOut, children} = props;
		const className = classNames(this.baseCls, {checked}, props.className);

		return (
			<div className={className} onClick={clickHandler()} onMouseOver={mouseOver} onMouseOut={mouseOut}>
        {children}
      </div>
		);
	}
}
