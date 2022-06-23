/**
 * Copyright 2021, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
    setConfigProp,
    setLocalConfigurationFile
} from '@mapstore/utils/ConfigUtils';
import { loadVersion } from '@mapstore/actions/version';
import { triggerShowConnections } from '@mapstore/actions/dashboard';
import appConfigDashboardEmbedded from '@mapstore/product/appConfigDashboardEmbedded';
import pluginsDashboardEmbedded from '@mapstore/product/pluginsDashboardEmbedded';
import main from '@mapstore/product/main';
import url from 'url';

const { query } = url.parse(window.location.href, true);

/**
 * Add custom (overriding) translations with:
 *
 * ConfigUtils.setConfigProp('translationsPath', ['./MapStore2/web/client/translations', './translations']);
 */
setConfigProp('translationsPath', ['./MapStore2/web/client/translations', './translations']);

/**
 * Use a custom plugins configuration file with:
 *
 */
setLocalConfigurationFile('configs/localConfig.json');

main(
    {
        ...appConfigDashboardEmbedded,
        themeCfg: {
            theme: "firenze"
        }
    },
    pluginsDashboardEmbedded,
    (cfg) => ({
        ...cfg,
        initialActions: [
            loadVersion,
            triggerShowConnections.bind(null, !!query.connections)
        ]
    })
);
