/**
 * Компонент для отображения предупреждения о несохранённых данных
 */
import React, {PropTypes} from 'react';
import Warning from './Warning';

export default function UnsavedDataWarning(props) {
    return (
        <Warning
            text={'У вас есть несохранненые изменения. Если не сохранить данные будут утеряны.'}
            okText='Сохранить'
            okHandler={props.okHandler}
            cancelText='Не сохранять'
            cancelHandler={props.cancelHandler}
        />
    );
}

UnsavedDataWarning.propTypes = {
    // Обработчик нажатия на кнопку подтверждения
    okHandler: PropTypes.func.isRequired,

    // Обработчик для кнопки отмены
    cancelHandler: PropTypes.func.isRequired
};
