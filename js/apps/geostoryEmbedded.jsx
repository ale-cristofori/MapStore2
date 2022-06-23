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
import appConfigGeostoryEmbedded from '@mapstore/product/appConfigGeostoryEmbedded';
import pluginsEmbedded from '@mapstore/product/pluginsGeostoryEmbedded';
import main from '@mapstore/product/main';
import { loadVersion } from '@mapstore/actions/version';

/**
 * Add custom (overriding) translations with:
 *
 * ConfigUtils.setConfigProp('translationsPath', ['./MapStore2/web/client/translations', './translations']);
 */
setConfigProp('translationsPath', ['./MapStore2/web/client/translations', './translations']);


/**
 * Use a custom plugins configuration file with:
 *
 * ConfigUtils.setLocalConfigurationFile('localConfig.json');
 */
setLocalConfigurationFile('configs/localConfig.json');

main(
    { ...appConfigGeostoryEmbedded, themeCfg: { theme: "firenze" } },
    pluginsEmbedded,
    (cfg) => ({
        ...cfg,
        initialActions: [loadVersion]
    })
);
