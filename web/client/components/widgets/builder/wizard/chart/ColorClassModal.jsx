/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {Col, Form, FormGroup, ControlLabel} from 'react-bootstrap';
import Select from 'react-select';

import Message from '../../../../../components/I18N/Message';
import Portal from '../../../../../components/misc/Portal';
import ResizableModal from '../../../../../components/misc/ResizableModal';
import ThemaClassesEditor from '../../../../style/ThemaClassesEditor';

export default ({ modalClassName, show, onClose, onSaveStyle, onChange, classificationAttribute, options, placeHolder, classification }) => (
    <Portal>
        <ResizableModal
            modalClassName={modalClassName}
            show={show}
            clickOutEnabled={false}
            showClose={false}
            onClose={() => onClose()}
            buttons={[
                {
                    text: <Message msgId="cancel" />,
                    bsSize: 'sm',
                    onClick: () => onClose()
                },
                {
                    text: <Message msgId="ok" />,
                    bsSize: 'sm',
                    onClick: () => onSaveStyle()
                }
            ]}>
            <Col xs={12}>
                <Form id="chart-color-class-form" horizontal>
                    <FormGroup controlId="classificationAttribute" className="chart-color-class-form-group">
                        <Col componentClass={ControlLabel} xs={6}>
                            <Message msgId={"Classification attribute"} />
                        </Col>
                        <Col xs={6}>
                            <Select
                                value={classificationAttribute}
                                options={options}
                                placeholder={placeHolder}
                                onChange={(val) => {
                                    onChange(val);
                                }}
                            />
                        </Col>
                    </FormGroup>
                    { classificationAttribute && <ThemaClassesEditor classification={classification} /> }
                </Form>
            </Col>
        </ResizableModal>
    </Portal>
);
