/*
 * Copyright 2021, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createPlugin } from '../../utils/PluginsUtils';
import { Glyphicon } from 'react-bootstrap';

import { CONTROL_NAME } from './constants';
import Message from '../../components/I18N/Message';
import { reset } from './actions/timeSeriesPlots';
import { showTimeSeriesPlotsPlugin } from './actions/timeSeriesPlots';
import TimeSeriesPlotsContainer from './containers/TimeSeriesPlotsContainer';

import timeSeriesPlots from './reducers/timeseriesplots';
import * as epics from './epics/timeSeriesPlots';
import './css/style.css';

const TimeSeriesPlotsPluginComponent =({ onMount = () => { }, onUnmount, ...props }) => {
    useEffect(() => {
        onMount(props);
        return () => {
            onUnmount();
        }
    }, []);
    return <TimeSeriesPlotsContainer />;
};

const TimeSeriesPlotsPluginContainer = connect(() => ({}), {
    onUnmount: reset
})(TimeSeriesPlotsPluginComponent);

/**
 * TimeSeriesPlots Plugin. Plot charts with time related data.
 * @name TimeSeriesPlots
 * @memberof plugins
 * @class
 */
export default createPlugin(
    CONTROL_NAME,
    {
        component: TimeSeriesPlotsPluginContainer,
        containers: {
            BurgerMenu: {
                position: 40,
                priority: 2,
                doNotHide: true,
                name: CONTROL_NAME,
                text: <Message msgId="timeSeriesPlots.title"/>,
                tooltip: "timeSeriesPlots.tooltip",
                icon: <Glyphicon glyph="time" />,
                action: () => showTimeSeriesPlotsPlugin()
            }
        },
        epics,
        reducers: {
            timeSeriesPlots
        },
    }
);