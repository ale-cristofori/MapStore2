/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import expect from 'expect';

import {
    isValidNewGroupOption,
    getTooltip,
    getTooltipFragment,
    flattenGroups,
    getTitleAndTooltip,
    getLabelName,
    getTitle
} from '../TOCUtils';

const groups = [{
    "id": "first",
    "title": "first",
    "name": "first",
    "nodes": [
        {
            "id": "first.second",
            "title": "second",
            "name": "second",
            "nodes": [
                {
                    "id": "first.second.third",
                    "title": "third",
                    "name": "third",
                    "nodes": [
                        {
                            "id": "topp:states__6",
                            "format": "image/png8",
                            "search": {
                                "url": "https://demo.geo-solutions.it:443/geoserver/wfs",
                                "type": "wfs"
                            },
                            "name": "topp:states",
                            "opacity": 1,
                            "description": "This is some census data on the states.",
                            "title": "USA Population",
                            "type": "wms",
                            "url": "https://demo.geo-solutions.it:443/geoserver/wms",
                            "bbox": {
                                "crs": "EPSG:4326",
                                "bounds": {
                                    "minx": -124.73142200000001,
                                    "miny": 24.955967,
                                    "maxx": -66.969849,
                                    "maxy": 49.371735
                                }
                            },
                            "visibility": true,
                            "singleTile": false,
                            "allowedSRS": {},
                            "dimensions": [],
                            "hideLoading": false,
                            "handleClickOnLayer": false,
                            "catalogURL": "https://demo.geo-solutions.it/geoserver/csw?request=GetRecordById&service=CSW&version=2.0.2&elementSetName=full&id=topp:states",
                            "useForElevation": false,
                            "hidden": false,
                            "params": {
                                "layers": "topp:states"
                            },
                            "loading": false,
                            "loadingError": false,
                            "group": "first.second.third",
                            "expanded": false
                        }
                    ],
                    "expanded": true,
                    "visibility": true
                }
            ],
            "expanded": true,
            "visibility": true
        }
    ],
    "expanded": true,
    "visibility": true
}];

describe('TOCUtils', () => {
    it('test isValidNewGroupOption for General Fragment with value not allowed', () => {
        let val = isValidNewGroupOption({ label: "/as" });
        expect(val).toBe(false);
        val = isValidNewGroupOption({ label: "a//s" });
        expect(val).toBe(false);
        val = isValidNewGroupOption({ label: "s/d&/" });
        expect(val).toBe(false);
    });

    it('test getTooltip for General Fragment with new valid value', () => {
        const node = {
            name: 'layer00',
            title: {
                'default': 'Layer',
                'it-IT': 'Livello'
            },
            id: "layer00",
            description: "desc",
            visibility: true,
            storeIndex: 9,
            type: 'wms',
            url: 'fakeurl',
            tooltipOptions: "both"
        };
        const currentLocale = "it-IT";
        const tooltip = getTooltip(node, currentLocale);
        expect(tooltip).toBe("Livello - desc");
    });

    it('test getTooltipFragment', () => {
        const node = {
            name: 'layer00',
            title: {
                'default': 'Layer',
                'it-IT': 'Livello'
            },
            id: "layer00",
            description: "desc",
            visibility: true,
            storeIndex: 9,
            type: 'wms',
            url: 'fakeurl'
        };
        const currentLocale = "it-IT";
        let tooltip = getTooltipFragment("title", node, currentLocale);
        expect(tooltip).toBe("Livello");
        tooltip = getTooltipFragment("description", node, currentLocale);
        expect(tooltip).toBe("desc");

        tooltip = getTooltipFragment("fakeFragment", node, currentLocale);
        expect(tooltip).toBe(undefined);

    });
    it('test flattenGroups, wholeGroup true', () => {
        const allGroups = flattenGroups(groups, 0, true);
        expect(allGroups.length).toBe(3);
        expect(allGroups[0].id).toBe("first");
        expect(allGroups[0].value).toBe(undefined);
        expect(allGroups[1].id).toBe("first.second");
        expect(allGroups[1].value).toBe(undefined);
        expect(allGroups[2].id).toBe("first.second.third");
        expect(allGroups[2].value).toBe(undefined);
    });
    it('test flattenGroups, wholeGroup false', () => {
        const allGroups = flattenGroups(groups);
        expect(allGroups.length).toBe(3);
        expect(allGroups[0].id).toBe(undefined);
        expect(allGroups[0].value).toBe("first");
        expect(allGroups[0].label).toBe("first");
        expect(allGroups[1].id).toBe(undefined);
        expect(allGroups[1].value).toBe("first.second");
        expect(allGroups[1].label).toBe("second");
        expect(allGroups[2].id).toBe(undefined);
        expect(allGroups[2].value).toBe("first.second.third");
        expect(allGroups[2].label).toBe("third");
    });
    it('test flattenGroups, wholeGroup false with translation', () => {
        const title = {
            "default": "first",
            "en-US": 'first-en'
        };
        const _groups = [{...groups[0], title}];
        const allGroups = flattenGroups(_groups);
        expect(allGroups.length).toBe(3);
        expect(allGroups[0].id).toBe(undefined);
        expect(allGroups[0].value).toBe("first");
        expect(allGroups[0].label).toBeTruthy();
        expect(allGroups[0].label.default).toBe(title.default);
        expect(allGroups[1].id).toBe(undefined);
        expect(allGroups[1].value).toBe("first.second");
        expect(allGroups[1].label).toBe("second");
        expect(allGroups[2].id).toBe(undefined);
        expect(allGroups[2].value).toBe("first.second.third");
        expect(allGroups[2].label).toBe("third");
    });
    it('test getTitleAndTooltip both', () => {
        const node = {
            name: 'layer00',
            title: {
                'default': 'Layer',
                'it-IT': 'Livello'
            },
            id: "layer00",
            description: "desc",
            tooltipOptions: "both"
        };
        const currentLocale = "it-IT";
        const {title, tooltipText} = getTitleAndTooltip({node, currentLocale});
        expect(title).toBe("Livello");
        expect(tooltipText).toBe("Livello - desc");
    });
    it('test getTitleAndTooltip NoTooltip', () => {
        const node = {
            name: 'layer00',
            title: {
                'default': 'Layer',
                'it-IT': 'Livello'
            },
            id: "layer00",
            description: "desc",
            tooltipOptions: "none"
        };
        const currentLocale = "it-IT";
        const {title, tooltipText} = getTitleAndTooltip({node, currentLocale});
        expect(title).toBe("Livello");
        expect(tooltipText).toBe("");
    });
    it('test default value getLabelName from object', () => {
        const groupLabel = "Default";
        const nodes = [{
            value: 'Layer',
            label: 'Default'
        }, {
            value: 'Layer_1',
            label: 'Default_1'
        }];
        const label = getLabelName(groupLabel, nodes);
        expect(label).toBe("Default");
    });
    it('test parsed title getTitle', () => {
        const title = "Default.Livello";
        expect(getTitle(title)).toBe("Default/Livello");
    });
    it('test localized title getTitle from object', () => {
        const title = {
            'default': 'Layer',
            'no-EX': 'Livello'
        };
        expect(getTitle(title)).toBe("Layer");
    });
    it('test localized title getTitle with locale', () => {
        const locale = 'it-IT';
        const title = {
            'default': 'Layer',
            [locale]: 'Livello'
        };
        expect(getTitle(title, locale)).toBe("Livello");
    });
});
