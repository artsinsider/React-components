import moment                                            from 'moment';

const WEEKDAYS_LONG = {
    "en": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "ru": ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресение"]
};

const WEEKDAYS_SHORT = {
    "en": ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    "ru": ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]
};

const MONTHS = {
    "en": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    "ru": ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
};

const FIRST_DAY = {
    "en": 0,
    "ru": 1
};

function getMonths() {
  return MONTHS;
}

const localeUtils = {
    getMonths: (locale) => MONTHS[locale],
    formatMonthTitle: (d, locale) => `${MONTHS[locale][d.getMonth()]} ${d.getFullYear()}`,
    formatWeekdayShort: (i, locale) => WEEKDAYS_SHORT[locale][i],
    formatWeekdayLong: (i, locale) => WEEKDAYS_LONG[locale][i],
    getFirstDayOfWeek: (locale) => FIRST_DAY[locale]
};

/**
 * Преобразует числа к двузначному виду, при необходимости добавляя 0 в начало.
 * @param {number || string} n - Преобразуемое число.
 * @returns {String}
 */
const dd = n => `0${n}`.substr(-2);

/**
 * Преобразует объект Date в строку вида yyyy.mm.dd.
 * @param {Date} day - Преобразуемый объект.
 * @return {String}
 */
const dateToString = day => day ? `${dd(day.getDate())}.${dd(day.getMonth() + 1)}.${day.getFullYear()}` : '';

/*
 * Преобразует строку в объект Date.
 * @param {String} str - Строка в формате dd.mm.yyyy.
 * @return {Date}
 */
const stringToDate = str => {
    if (!str)
        return undefined;

    const res = moment(str, 'DDMMYYYY').toDate();

    return res instanceof Date ? res : undefined;
};

/**
 * Округляет миллисекунды до целой даты.
 * @param {Number} ms - Количество милисекунд.
 * @returns {Number} - Округленное количество миллисекунд.
 */
const ms2Day = ms => Math.round(ms / (1000 * 60 * 60 * 24)); //ms - ms % (1000 * 60 * 60 * 24);

/**
 * Сравнивает даты.
 * @param {Date} d1 - Первая дата.
 * @param {Date} d2 - Вторая дата.
 * @returns {Number} Знак указывает на то, в каком порядке следуют дни, соответсвующие принятым датам.
 */
const compareDates = (d1, d2) => {
    // return  d1.getTime() - d2.getTime();
    return ms2Day(d1.getTime()) - ms2Day(d2.getTime());
};

/**
 * Проверяет, что две даты соответсвуют одному дню.
 * @param {Date} d1 - Первая дата.
 * @param {Date} d2 - Вторая дата.
 * @returns {Boolean}
 */
const isSameDays = (d1, d2) => d2 && !compareDates(d1, d2);

/**
 * Возвращает true, если дата соответвует слишком раннему периоду.
 * @param {Date} day - Проверяемая дата.
 * @param {Date} min - Ранняя дата.
 * @returns {Boolean}
 */
const isDayEarly = (day, min) => min && compareDates(day, min) < 0;

/**
 * Возвращает true, если дата соответвует слишком позднему периоду.
 * @param {Date} day - Проверяемая дата.
 * @param {Date} min - Поздняя дата.
 * @returns {Boolean}
 */
const isDayLate = (day, max) => max && compareDates(day, max) > 0;

/*
 * Преобразует строку в объект Date с учётом временной зоны.
 * @param {String} str - Строка в формате dd.mm.yyyy.
 * @return {string}
 */
const stringToDateWithTimezone = str => str ? moment(str, 'DDMMYYYY').format('YYYY-MM-DDTHH:mm:ss.SSSZ') : undefined;

/*
 * Преобразует строку в объект Date c учетом времени
 * @param {String} str - Строка в формате dd.mm.yyyy.mm.ss.
 * @return {string}
 */
const stringToDateWithTime = str => str ? moment(str, 'DDMMYYYY').format('YYYY-MM-DDTHH:mm:ss') : undefined;

/*
 * Преобразует строку в объект Date c учетом времени
 * @param {String} str - Строка в формате dd.mm.yyyy.mm.ss.
 * @return {string}
 */
const stringDateWithContractDialog = str =>  str ? moment(str, 'YYYYMMDDTHH:mm:ss').format('DD-MM-YYYY') : undefined;

export {localeUtils, dateToString, stringToDate, ms2Day, compareDates, isSameDays, isDayEarly, isDayLate, stringToDateWithTimezone, stringToDateWithTime,stringDateWithContractDialog};
