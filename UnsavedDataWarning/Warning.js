import React, {PropTypes} from 'react';
import Modal from './Modal';
import {ButtonBasic, ButtonLight} from 'virtu-react-ui';

/**
 * Окно с предупреждением
 * @param {Object}   props               Свойства компонента
 * @param {string}   props.text          Текст сообщения
 * @param {Function} props.okHandler     Обработчик нажатия на кнопку подтверждения
 * @param {string}   props.okText        Текст для кнопки подтверждения
 * @param {Function} props.cancelHandler Обработчик для кнопки отмены
 * @param {string}   props.cancelText    Текст для кнопки отмены
 * @returns {React.Element}
 */
export default function Warning(props) {
    return (
        <Modal style={{height: '200px', width: '450px'}} >
            <div className="ask-save-changes">
                <p>{props.text}</p>
                <ButtonBasic
                    text={props.okText}
                    clickHandler={props.okHandler}
                />
                <ButtonLight
                    text={props.cancelText}
                    clickHandler={props.cancelHandler}
                />
            </div>
        </Modal>
    );
}

Warning.propTypes = {
    // Текст сообщения
    text: PropTypes.string.isRequired,

    // Обработчик нажатия на кнопку подтверждения
    okHandler: PropTypes.func.isRequired,

    // Текст для кнопки подтверждения
    okText: PropTypes.string,

    // Обработчик для кнопки отмены
    cancelHandler: PropTypes.func.isRequired,

    // Текст для кнопки отмены
    cancelText: PropTypes.string
};
