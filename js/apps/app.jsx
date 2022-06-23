/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { checkForMissingPlugins } from '@mapstore/utils/DebugUtils';
import main from '@mapstore/product/main';
import {setConfigProp, setLocalConfigurationFile} from '@mapstore/utils/ConfigUtils';
import appConfig from '@mapstore/product/appConfig';
import plugins from '@mapstore/product/plugins';

/**
 * Add custom (overriding) translations with:
 *
 * setConfigProp('translationsPath', ['./MapStore2/web/client/translations', './translations']);
 */
setConfigProp('translationsPath', ['./MapStore2/web/client/translations', './translations']);


/**
 * Use a custom plugins configuration file with:
 *
 * setLocalConfigurationFile('configs/localConfig.json');
 */
setLocalConfigurationFile('configs/localConfig.json');

/**
 * Use a custom application configuration file with:
 *
 * const appConfig = require('./appConfig');
 *
 * Or override the application configuration file with (e.g. only one page with a mapviewer):
 *
 * const appConfig = assign({}, require('@mapstore/product/appConfig'), {
 *     pages: [{
 *         name: "mapviewer",
 *         path: "/",
 *         component: require('@mapstore/product/pages/MapViewer')
 *     }]
 * });
 */

/**
 * Define a custom list of plugins with:
 *
 * const plugins = require('./plugins');
 */

checkForMissingPlugins(plugins.plugins);

main({
    ...appConfig,
    themeCfg: {
        theme: "firenze"
    }
}, plugins);
