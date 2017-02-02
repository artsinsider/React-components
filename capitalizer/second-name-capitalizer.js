import {isEmpty, isNil} from 'ramda';

/**
 * Функции для работы со строками
 * @module string
 */

/**
 * Делает пустую строку из `undefined` и `null`
 * @function
 * @param   {?string|undefined} value значение
 * @returns {string}
 */
 export const clearValue = value => (value === null || value === undefined) ?
    '' :
    value;


/**
 * Проверка, если в word пришла не срока
 * @param   {string} word значение
 * @returns {string}
  */
export const capitalize = word => (isNil(word) || isEmpty(word)) ?
  word :
  capitalizeVerification(word);


/**
 * Первая буква в строке приводится к верхнему регистру,
 * если строки разделены ' ' или "-", первая буква в строке приводится к верхнему регистру.
 * @param {string} word слово
 * @returns {string}
 */
  function capitalizeVerification(word) {
     word = capitalizer(word);
     word = splitCapitalizeJoin('-', word);
     word = splitCapitalizeJoin(' ', word);
     return word;
}

/**
 * Разбивает строку по найденному символу
 * @param [separator] выражение по которому будет разбита строка
 * @param {string} word слово
 * @returns {string}
 */
function splitCapitalizeJoin(separator, word) {
  if (word.indexOf(separator) != -1) {
    return word.split(separator).map(capitalizeVerification).join(separator);
  }
  return word;
}

/**
 * Приводит первый символ строки к верхнему регистру
 * @param {string} word слово
 * @returns {string}
 */
function capitalizer(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
