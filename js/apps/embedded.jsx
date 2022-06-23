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
import appConfigEmbedded from '@mapstore/product/appConfigEmbedded';
import apiPlugins from '@mapstore/product/apiPlugins';
import { loadVersion } from '@mapstore/actions/version';
import main from '@mapstore/product/main';

/**
 * Add custom (overriding) translations with:
 *
 * setConfigProp('translationsPath', ['./MapStore2/web/client/translations', './translations']);
*/
setConfigProp('translationsPath', ['./MapStore2/web/client/translations', './translations']);

/**
 * Use a custom plugins configuration file with:
 *
 * setLocalConfigurationFile('localConfig.json');
*/
setLocalConfigurationFile('configs/localConfig.json');

main(
    {
        ...appConfigEmbedded,
        themeCfg: {
            theme: "firenze"
        }
    },
    apiPlugins,
    (cfg) => ({
        ...cfg,
        initialActions: [loadVersion]
    })
);
