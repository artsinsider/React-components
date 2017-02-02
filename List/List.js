import React, {Component, PropTypes} from 'react';
import classNames                    from 'classnames';

/**
 * Создает список.
 * @param {Object} props - Свойства списка.
 * @param {String} [props#name] - Заголовок списка.
 * @param {Node} props#children - Элементы списка.
 * @param {String} [props#className] - Дополнительный к базовому набор классов.
 * @param {String} [props#classPref = 'virtu'] - Префикс к базовому классу.
 * @param {Number} [props#listHeight] - Высота списка.
 * @param {Function} [props#blurHandler] - Обработчик события blur.
 * @returns {Node}
 */
const List = props => {
    const {name, listHeight, classPref, className, children, blurHandler} = props;
    const baseCls = `${classPref || 'virtu'}-list`;
    const cls = classNames(baseCls, className);

    return (
        name ?
            <div className={cls} style={{'height': `${listHeight}px`}} onBlur={blurHandler} tabIndex="0">
                <h6>{name}</h6>
                {children}
            </div>
           :
            <div className={cls} style={{'height': `${listHeight}px`}} onBlur={blurHandler} tabIndex="0">
                {children}
            </div>
    );
};

List.propTypes = {
    className : PropTypes.string,
    classPref : PropTypes.string,
    name: PropTypes.string,
    children  : PropTypes.node.isRequired,
    listHeight: PropTypes.number,
    blurHandler: PropTypes.func
};

export default List;
