import React, {Component, PropTypes}                                 from 'react';
import Scrollbar                                                     from '../Scrollbar';
import {List, TextItem}                                              from '../List';
import DropDownField                                                 from '../DropDownField';
import RotatingArrow                                                 from '../RotatingArrow';
import classNames                                                    from 'classnames';
import keys                                                          from '../lib/keys';
import {identity, compose, propEq, find, prop, defaultTo, findIndex} from 'ramda';

/**
 * Возвращает индекс выбранной записи
 * @param {string}        selectedValue выбранное значение
 * @param {Array<Object>} list          массив записей
 * @param {String} valueField           настраиваемый идентификатор
 * @returns {number} индекс выбранной записи или -1 если запись не найдена
 */
function selectedIdx(selectedValue, list = [], valueField) {
    if (!selectedValue) return -1;
    return findIndex(propEq(valueField, selectedValue), list);
}

/**
 * Выбирает следующее значение из массив, в зависимости от направления
 * @param {string}        idx       индекс текущего выбранного элемента
 * @param {1|-1}          direction направление изменения выбора
 * @param {Array<Object>} list      массив данных
 * @param {String} valueField       настраиваемый идентификатор
 * @returns {string}
 */
function selectValue(idx, direction, list = [], valueField) {
    if (!list.length) return;

    if (idx === -1) {
        return list[0][valueField];
    }
    else{
        const newItem = list[idx + direction];
        return newItem ? newItem[valueField] : list[idx][valueField];
    }
}


/**
 * Элемент управления ComboBox с поддержкой функции автозаполнения
 * @param {Boolean} [props#disabled] - Если true, делает комопнент не активным.
 * @extends React#Component
 * @todo Реализовать возможность передвигается стрелками клавиатуры по списку выбора
 */
export default class Combobox extends Component {

    static propTypes = {
        placeholder: PropTypes.string,
        className: PropTypes.string,
        name: PropTypes.string,
        dataList: PropTypes.array,
        open: PropTypes.bool,
        listHeight: PropTypes.number,
        recordId: PropTypes.string,
        nofilter: PropTypes.bool,
        changeHandler: PropTypes.func,
        update: PropTypes.func,
        blurHandler: PropTypes.func,
        remote: PropTypes.bool,
        searchHandler: PropTypes.func,
        //Имя поля для отображение в выпадающем листе
        displayField: PropTypes.string,
        //Имя поля, которое должно быть идентификатором : настраиваемый идентификатор
        valueField: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            selected: props.value,
            open: false,
            data: undefined,
            filter: null
        };

        this.closeable = true;

        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handleItemclick = this.handleItemclick.bind(this);
        this.viewList = this.viewList.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.blurHandler = this.blurHandler.bind(this);
        this.setCloseableTrue = this.setCloseableTrue.bind(this);
        this.setCloseableFalse = this.setCloseableFalse.bind(this);
        this.renderArrow = this.renderArrow.bind(this);

    }


    componentDidUpdate(prevProps, prevState) {
        const {
            state: {open, filter, selected},
            props: {nostrict, dataList = [], displayField, valueField}
        } = this;

        if (open) {
            window.document.addEventListener('keydown', this.handleKeyPress);
        }
        else {
            window.document.removeEventListener('keydown', this.handleKeyPress);
            if (filter !== null) {
                if (nostrict) {
                    const found = dataList.reduce(
                        (v, elem) => {
                            return elem[displayField] === filter ? elem[valueField] : v
                        }, null
                    );

                    this.setState({filter: null, selected: found || filter});

                } else {
                    this.setState({filter: null});
                }
            }
        }
    }

    componentWillReceiveProps({ value }) {
        // если значение поля пришло извне и не соответсвует выбранному, то
        // оно становится новым выбранным значением
        if (value !== this.state.selected) {
            this.setState({ selected: value });
        }
    }

    /**
     * Обработчик нажатий клавиш при открытом выпадающем списке
     * @param {SyntheticEvent} e объект события
     */
    handleKeyPress(e) {
        const key = keys(e);
        const {dataList, valueField} = this.props;
        const {selected} = this.state;
        const idx = selectedIdx(selected, dataList, valueField);

        if (key.down) {
            this.setState({ selected: selectValue(idx, 1, dataList, valueField)});
        }
        else if(key.up) {
            this.setState({selected: selectValue(idx, -1, dataList, valueField)});
        }
        else if (key.enter) {
            if (idx !== -1)
                this.handleItemclick({value: selected}); // только если нажат `enter` и выбран какой-нибудь элемент
            else
                this.hide();
        }
    }

    /**
     * Обработчик клика по элементу списка.
     * @param  {string} value значениe выбранного элемента списка
     */
    handleItemclick({value}) {
        const {props, props: {dataList = [], displayField, valueField}} = this;
        const data = dataList.reduce(
            (o, elem) => {
                return elem[valueField] === value ? elem.data : o
            }, {}
        )

        this.setState({ selected: value, open: false, data, filter: null }, () => {
            this.props.changeHandler({...this.props, target: { value, data }, valid: true, type: 'change'});
        });
    }

    blurHandler () {
        if (!this.closeable)
            return;
        this.hidden = true;
        this.hide();
    }

    /**
     * Фильтрует данные в соответсвии со значением в текстовом поле и обеспечивает работу валидатора
     * @param {Object} event событие
     * @param {String} event#target#value - значение, на основе которого производится поиск.
     */
    changeHandler(args) {
        const {target: {value}, model, valid, errorMsg} = args;
        const {
            props,
            props: {changeHandler, searchHandler = identity, dataList = [], nofilter, enabled, nostrict},
            state: {selected, open: stateOpen, data = {}, filter: stateFilter},
            hidden
        } = this;
        const filter = value;
        const open = nofilter && !enabled ? stateOpen : !hidden;

        delete this.hidden;

        this.setState({filter, open}, () => {
            if (!nofilter || enabled)
                searchHandler(value);

            // было (nostrict && !open)
            changeHandler({...props, target: {value: (nostrict && true) ? filter : selected, data}, valid: false, errorMsg: 'test', type: 'change'});
        });
    }


    show () {
        this.setState({open: true});
    }

    hide () {
        if (this.closeable)
            this.setState({open: false});
    }

    setCloseableTrue () {
        this.closeable = true;
    }

    setCloseableFalse () {
        this.closeable = false;
    }

    toggle () {
        this.setState({open: !this.state.open});
    }

    /**
     * Показывает или скрывает список выбора
     * @param {Object} event - Cобытие
     * @param {String} event#type - Тип события.
     */
    viewList({type}) {
        switch (type) {
            case 'click': return this.toggle();
            case 'blur': return this.hide();
        }
    }

    /**
     * Создает новый список выбора из массива
     * @param  {Array<Object>} [dataList = []] массив записей
     * @param  {string}        selected        идентификатор выбраной строки
     * @return {Array<TextItem>}
     */
    renderDataList(dataList = [], selected, displayField, valueField) {

        return dataList.map((elem) => {
            const idValue = elem[valueField];
            return (
                <TextItem
                    key={`item-key-${idValue}`}
                    id={`item-id-${idValue}`}
                    className={selected === valueField ? 'active' : ''}
                    clickHandler={compose(this.handleItemclick, value => {return {value: idValue};})}
                    value={elem[valueField]}
                >
                {elem[displayField]}
                </TextItem>
            );
        });
    }

    renderArrow (open, disabled) {
        return <RotatingArrow
            disabled={disabled}
            open={open}
            viewList={this.viewList}
            onMouseEnter={this.setCloseableFalse}
            onMouseLeave={this.setCloseableTrue}
        />;
    }

    render() {

        const {props,
            props: {
                disabled, className, nofilter, enabled, dataList = [], itemHeight = 28, listHeight, nostrict, displayField, valueField
            },
            state: {
                open, selected, filter
            }
        } = this;

        const baseCls = "virtu-combobox";
        const cls = classNames(baseCls, className);
        const viewListCls = open ? 'display-block' : 'display-none';

        const name = id => compose(
            prop(displayField),
            defaultTo({}),
            find(propEq(valueField, id))
        )(dataList);

        const regular = new RegExp(filter || '');
        const list = !nofilter && filter
            ?
        dataList.filter( (elem) => regular.test(elem[displayField]) )
            :
        dataList;

        return (
            <DropDownField
                {...props}
                value={filter !== null ? filter : (name(selected) || (nostrict ? selected : ''))}
                fixedWidth={true}
                open={open}
                className={cls}
                switcher={this.renderArrow(open, disabled)}
                disabled={nofilter && !enabled || disabled}
                changeHandler={this.changeHandler}
                blurHandler={this.blurHandler}
            >
                <List
                    className={viewListCls}
                    listHeight={listHeight || itemHeight * Math.min(dataList.length, 8)}
                    blurHandler={this.hide}
                >
                    <Scrollbar
                        autoshow={false}
                        onMouseEnter={this.setCloseableFalse}
                        onMouseLeave={this.setCloseableTrue}
                    >
                        {this.renderDataList(list, selected, displayField, valueField)}
                    </Scrollbar>
                </List>
            </DropDownField>
        );
    }
}

Combobox.defaultProps = {
    //Имя поля для отображение в выпадающем листе
    displayField: 'name',
    //Имя поля, которое должно быть идентификатором : настраиваемый идентификатор
    valueField: 'id'
};
