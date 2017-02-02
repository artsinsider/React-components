import React, {Component, PropTypes}                         from 'react';
import DropDownField                                         from '../DropDownField';
import {localeUtils, dateToString, stringToDate, isDayEarly} from './dateUtils';
import DayPicker                                             from 'react-day-picker';
import classNames                                            from 'classnames';
import moment                                                from 'moment';
import {compose, dissoc, identity}                           from 'ramda';
import WraperHandler                                          from './WraperHandler';
import YearMonthForm                                          from './YearMonthForm';
/**
 * Класс для создания DateField.
 * @param {Boolean} [props#disabled] - Если true, делает комопнент не активным.
 * @param {Object} props - Свойства поля.
 * @param {String} [props#className] - дополнительный набор классов к полю.
 * @param {String} [props#name] - Аттрибут name.
 * @param {String} [props#value] - Значение.
 * @param {'ru' | 'en'} [props#locale] - Локализация.
 * @param {Date} [pros#fromDay] - Самая ранняя из возможных дат.
 * @param {Function} [props#changeHandler] - Обработчик события onchange.
 * @param {Function} [props#blurHandler] - Обработчик события onblur.
 * @extends React.Component.
 * @todo Настроить форматированный ввод с помощью компонента react-number-format (https://www.npmjs.com/package/react-number-format).
 */
export default class DateField extends Component {

    static propTypes = {
        className: PropTypes.string,
        name: PropTypes.string,
        value: PropTypes.string,
        locale: PropTypes.oneOf(['ru', 'en']),
        fromDay: PropTypes.instanceOf(Date),
        changeHandler: PropTypes.func,
        blurHandler: PropTypes.func,
        root: PropTypes.string
    };

    constructor (props) {
        super(props);

        this.state = {
            hidden: true,
            hideable: true
        };

        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.toggle = this.toggle.bind(this);

        this.parseValue = this.parseValue.bind(this);
        this.initialMonth = this.initialMonth.bind(this);
        this.strToDate = this.strToDate.bind(this);

        this.textChangeHandler = this.textChangeHandler.bind(this);
        this.textBlurHandler = this.textBlurHandler.bind(this);
        this.dayClickHandler = this.dayClickHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.blurHandler = this.blurHandler.bind(this);
    }

    /**
     * Показывает календарь.
     */
    show (callback = identity) {
        this.setState({hidden: false});
    }

    /**
     * Прячет календарь.
     */
    hide (callback = identity) {
        if (this.state.hideable)
            this.setState({hidden: true});
    }

    /**
     * Переключает отображение календаря.
     */
    toggle (callback = identity) {
        this.setState({hidden: !this.state.hidden});
    }

    /**
     * Обработчик onchange текстового поля. Преобразует введенное значение к виду даты.
     * @param {String} event#target#value - отображаемый в поле текст.
     */
    textChangeHandler({target: {value}, model, valid, errorMsg}) {
        const {state: {textValue}, unparsed, parsed, props} = this;

        if (value === unparsed) {
            value = parsed;
            delete this.unparsed;
            delete this.parsed;
        }
        this.setState({textValue: value}, () => this.changeHandler(...props, {target: {value}, model, valid, errorMsg}));
    }

    /**
     * Обработчик onblur текстового поля. Преобразует введенное значение к виду даты.
     * @param {String} event#target#value - отображаемый в поле текст.
     */
    textBlurHandler({target: {value: unparsed}}) {
        delete this.parsed;
        this.unparsed = unparsed;

        const {props, props: {fromDay, value: propsValue}, state: {oldValue}} = this;

        if (!unparsed)
            return this.setState({textValue: '', oldValue: undefined, hidden: true}, () => this.changeHandler(...props, {target: {value: ''}, type: 'change'}));

        const value = this.parseValue(unparsed);
        this.parsed = value;

        if (value && (!fromDay || fromDay.getTime() <= this.strToDate(value).getTime()))
                return this.setState({textValue: value, hidden: true}, this.changeHandler(...props, {target: {value}, type: 'change'}));

        const currentValue = oldValue || propsValue;

        return this.setState({textValue: currentValue, hidden: true}, this.changeHandler(...props, {target: {value: currentValue}, type: 'change'}));
    }

    /**
     * Преобразовывает полученное значение к виду даты.
     * @param {String} value - Преобразуемый текст.
     * @returns {String | undefined} - Преобразованное значение, если преобразование получилось, или undefined в противном случае.
     */
    parseValue (value) {
        if (!/^\d{6}|\d{8}|(?:(?:\d{1,2}\.){2}(?:\d{2}|\d{4}))$/.test(value))
            return;

        const date = moment(value, ['DDMMYYYY', 'DD.MM.YYYY']).format('DD.MM.YYYY');
        return typeof date === 'string' && /^(?:\d{1,2}\.){2}\d{4}$/.test(date) ? date : undefined;
    }

    /**
     * Преобразует строку в дату.
     * @param {String} str - Строка.
     * @returns {Date} - Если строка преобразуется, соответсвующее ей значение даты, в противном случае - текущая дата.
     */
    strToDate (str) {
        return stringToDate(str);
    }

    /**
     * По заданному значению устанавливает месяц, с которого должен открываться календарь.
     * @returns {Date}
     */
    initialMonth () {
        const {props: {value, initialMonth}, state} = this;
        const { oldValue, textValue = value } = state;
        const current = this.strToDate(oldValue || textValue);
        const valueDate = this.strToDate(value);
        const invalid = new Date('Invalid date').toString();
        return  current && current.toString() !== invalid ? current : valueDate && valueDate.toString() !== invalid ? valueDate : initialMonth || new Date();
    }

    /**
     * Обработчик клика по дате на календаре, выставляет значение, соответсвующее выбранной дате.
     * @param {Event} e - Событие.
     * @param {Date} day - Выбранная дата.
     * @param {Array} modifiers - Соответсвующий дате набор модификаторов.
     */
    dayClickHandler(e, day, modifiers) {
        const deprecated =  modifiers.some(x => x === 'deprecated');

        if (!deprecated) {
            const value = this.parseValue(moment(dateToString(day), 'DDMMYYYY').format('DD.MM.YYYY'));
            this.setState({hideable: true, hidden: true}, () => {
              this.changeHandler({target: {name, value}, type: 'change', ...this.props})
            });
        }
    }

    changeHandler ({target: {value}, model = {}, valid, errorMsg}) {
        const {props} = this;
        const {changeHandler=identity} = props;

        this.setState({
                textValue: value,
                oldValue: value
            },
            () => changeHandler({target: {...props, value}, ...props, type: 'change'})
        );
    }

    blurHandler ({target: {value}}) {
        const {props} = this;
        const {blurHandler = identity} = this.props;

        if (this.state.hideable)
            this.hide(() => blurHandler({target: {...props, value}, type: 'blur', ...this.props}));
    }

    render () {
        const {props, state} = this;
        const {className, locale='ru', fromDay, value, root, yearRange, disabled, ...rest} = props;
        const {hidden, textValue = value} = state;
        const baseCls = 'virtu-date-field';
        const cls = classNames(baseCls, className);
        const selected = day => textValue === moment(dateToString(day), 'DDMMYYYY').format('DD.MM.YYYY');
        const deprecated = day => isDayEarly(day, fromDay);
        const dateToYearMonth = stringToDate(textValue);

        return (
            <DropDownField
                {...rest}
                value={!value ? value : textValue} // костыль, правит баг с очисткой поля
                className={cls}
                changeHandler={this.textChangeHandler}
                blurHandler={this.textBlurHandler}
                open={!hidden}
                switcher={<WraperHandler disabled={disabled} className="btn" onClickHandler={this.toggle} onBlurHandler={this.blurHandler} tabIndexProp="1" />}
            >
              <DayPicker
                locale={locale}
                localeUtils={localeUtils}
                enableOutsideDays
                className={classNames({hidden})}
                onDayClick={this.dayClickHandler}
                initialMonth={this.initialMonth()}
                modifiers={{selected, deprecated}}
                onMouseEnter={()=>{this.setState({hideable: false});}}
                onMouseLeave={()=>{this.setState({hideable: true});}}
                fromMonth={this.initialMonth()}
                tabIndex="2"
                onBlur={this.blurHandler}
                yearRange={{ futureTime:'', pastTime:''}}

                captionElement={
                  <YearMonthForm
                    locale={locale}
                    onChange={date => this.dayClickHandler(undefined, date, [])}
                    yearRange={yearRange}
                    date={dateToYearMonth}
                  />
                }
              />
            </DropDownField>
        );
    }

}
