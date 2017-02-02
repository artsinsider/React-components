import React, {PropTypes}  from "react";
import {uniq} from 'ramda';

/**
 * Функция создающая компонент навигации по годам и месяцам
 * @param {Object} props - Свойства поля.
 * @param {Object} props.date - установленная дата.
 * @param {Object} props.localeUtils - формат локализации.
 * @param {Function} props.onChange - Обработчик события handleChange.
 * @param {'ru' | 'en'} props.locale - локализация.
 * @param {Object} props.yearRange - параметры ограничивающие длинну массива.
 */

export default function YearMonthForm(props) {
  const { date, localeUtils, onChange, locale, yearRange={ futureTime:0, pastTime:100} } = props;
  const months = localeUtils.getMonths(locale);
  const currentYear = (new Date()).getFullYear();
  const years = [];

  /**
   * Цикл для построение массива годов
   * @param currentYear - текущий год
   * @param yearRange{futureTime,pastTime}- параметры ограничивающие длинну массива
   */
  for (let i = currentYear ; i <= currentYear + yearRange.futureTime; i++) {
    years.unshift(i);
  }
  for (let i = currentYear; i >= currentYear - yearRange.pastTime; i--) {
    years.push(i);
  }
  const yearRangeArr = uniq(years);

  const handleChange = function(e) {
    const { year, month } = e.target.form;
    onChange(new Date(year.value, month.value));
  }

  return (
    <form className="DayPicker-Caption">
        <select name="month" onChange={ handleChange } value={ date.getMonth() }>
          { months.map((month, i) =>
            <option key={ i } value={ i }>
              { month }
            </option>)
          }
        </select>
        <select name="year" onChange={ handleChange } value={ date.getFullYear() }>
          { yearRangeArr.map((year, i) =>
            <option key={ i } value={ year }>
              { year }
            </option>)
          }
        </select>
    </form>
  )
}


YearMonthForm.propTypes = {
  date: PropTypes.object,
  localeUtils: PropTypes.object,
  yearRange: PropTypes.object,
  locale: PropTypes.oneOf(['ru', 'en']),
  handleChange: PropTypes.func,
  onChange: PropTypes.func,
};
