import React, {Component, PropTypes} from 'react';
import {compose} from 'ramda'
import classNames from 'classnames';
/**
 * Компонент для выпадающего списка
 * @param {Object} props - Свойства эелемента.
 * @param {String} props#header - заголовок
 * @param {Function} props#resizeHandler - действие ресайза
 */
export default class DropDown extends Component {
    static propTypes = {
        onClick: PropTypes.func,
        resizeHandler: PropTypes.func
    };
    constructor (props) {
        super(props);
        this.state = {
            collapsed: false
        };
        this.viewForm = this.viewForm.bind(this);
    };
    viewForm() {
        this.setState({ collapsed: !this.state.collapsed });
    };
    renderHeader(header) {
        const prefixCls  = "form-edit-";
        const iconCls    = classNames({ "img-rotate-right": this.state.collapsed, "img-rotate-down": !this.state.collapsed });
        return header ?
            <div
                className="header"
                onClick={compose(this.props.resizeHandler, this.viewForm)}
            >
                <div className="title">{header}</div>
                <div className={prefixCls+"wrapper-ico-left"} >
                    <div
                        className={prefixCls + iconCls}
                        onClick={compose(this.resizeHandler, this.viewForm)}
                    >
                    </div>
                </div>
            </div>:
            null;
    }
    renderChildren(children) {
        if (this.props.header) {
            if (!this.state.collapsed) {
                return <div className="body">{children}</div>;
            } else {
                return null;
            }
        } else {
            return <div className="body">{children}</div>;
        }
    }
    render() {
        const { header, children } = this.props;
        return (
            <div className='drop-down2'>
                {this.renderHeader(header)}
                {this.renderChildren(children)}
            </div>
        );
    }
}