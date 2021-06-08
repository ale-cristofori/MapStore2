/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import expect from 'expect';
import MockAdapter from "axios-mock-adapter";
import axios from "../../../libs/ajax";

import defaultSettingsTabs, { getStyleTabPlugin } from '../defaultSettingsTabs';
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from "react-dom/test-utils";

import SimpleVectorStyleEditor from "../SimpleVectorStyleEditor";

const BASE_STYLE_TEST_DATA = {
    settings: {},
    items: [],
    loadedPlugins: {}
};
let mockAxios;

const getQueryParam = (param, url) => {
    let href = url;
    // this expression is to get the query strings
    let reg = new RegExp("[?&]" + param + "=([^&#]*)", "i");
    let queryString = reg.exec(href);
    return queryString ? decodeURIComponent(queryString[1]) : null;
};

const mockFeatureRequestWithGeometryType = (geometryType) => {
    mockAxios.onGet().reply((req) => {
        const request = getQueryParam("request", req.url);
        if (request === "DescribeFeatureType") {
            let mockResponse = {
                "featureTypes": [
                    {
                        "properties": [
                            {
                                "name": "the_geom",
                                "type": `gml:${geometryType}`
                            }
                        ]
                    }
                ]
            };
            return [200, mockResponse];
        }
        return [404, "NOT FOUND"];
    });
};

describe('TOCItemsSettings - getStyleTabPlugin', () => {
    it('getStyleTabPlugin', () => {
        const DEFAULT_TEST_PARAMS = {
            ...BASE_STYLE_TEST_DATA
        };
        expect(getStyleTabPlugin(DEFAULT_TEST_PARAMS)).toEqual({});
    });
    it('getStyleTabPlugin gets thematic plugin if present and the layer is wfs', () => {
        const DEFAULT_TEST_PARAMS = {
            ...BASE_STYLE_TEST_DATA,
            element: {
                search: {
                    type: "wfs",
                    url: "something"
                }
            },
            items: [{
                target: 'style',
                name: 'ThematicLayer',
                selector: (props) => {
                    return props?.element?.search;
                }
            }]
        };
        const toolbar = getStyleTabPlugin(DEFAULT_TEST_PARAMS).toolbar;
        expect(toolbar).toBeTruthy();
        expect(toolbar.length).toBe(2);
    });
    it('getStyleTabPlugin exclude thematic plugin if layer is not', () => {
        const DEFAULT_TEST_PARAMS = {
            ...BASE_STYLE_TEST_DATA,
            element: {
                type: "asd"
            },
            items: [{
                target: 'style',
                name: 'ThematicLayer',
                selector: (props) => {
                    return props?.element?.search;
                }
            }]
        };
        expect(getStyleTabPlugin(DEFAULT_TEST_PARAMS)).toEqual({});
    });
    it('defaultSettingsTabs', () => {
        {
            const items = defaultSettingsTabs(BASE_STYLE_TEST_DATA);
            expect(items.length).toBe(1);
            expect(items[0].id).toBe('general');
        }
        {
            const items = defaultSettingsTabs(BASE_STYLE_TEST_DATA);
            expect(items.length).toBe(1);
        }
    });
});

describe('TOCItemsSettings - getStyleTabPlugin rendered items', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });

    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });

    it('getStyleTabPlugin with StyleEditor toolbar and cfg configuration', () => {
        const DEFAULT_TEST_PARAMS = {
            ...BASE_STYLE_TEST_DATA,
            items: [{
                ToolbarComponent: ({ enableSetDefaultStyle }) => (
                    <div className="test-toolbar">
                        {enableSetDefaultStyle ? 'enableSetDefaultStyle' : ''}
                    </div>
                ),
                cfg: {
                    enableSetDefaultStyle: true
                },
                items: [],
                name: 'StyleEditor',
                plugin: () => <div></div>,
                priority: 1,
                target: 'style'
            }]
        };

        const Toolbar = getStyleTabPlugin(DEFAULT_TEST_PARAMS).toolbarComponent;
        expect(Toolbar).toBeTruthy();

        ReactDOM.render(<Toolbar />, document.getElementById('container'));

        const toolbarNode = document.querySelector('.test-toolbar');

        expect(toolbarNode).toBeTruthy();
        expect(toolbarNode.innerHTML).toBe('enableSetDefaultStyle');

    });
});

describe('TOCItemsSettings - SimpleVectorStyleEditor rendered items', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        mockAxios = new MockAdapter(axios);
        setTimeout(done);
    });

    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = "";
        if (mockAxios) {
            mockAxios.restore();
        }
        mockAxios = null;
        setTimeout(done);
    });

    it("SimpleVectorStyleEditor displays an error message if the geometry is type GEOMETRY and the layer is wfs", async() => {
        const PROPS = {
            ...BASE_STYLE_TEST_DATA,
            element: {
                type: "wfs",
                search: {
                    url: "something"
                }
            }
        };

        mockFeatureRequestWithGeometryType("Geometry");

        await act(async() => {
            ReactDOM.render(<SimpleVectorStyleEditor {...PROPS}/>, document.querySelector('#container'));
        });

        // Check if an error message is rendered
        const messageComponent = document.querySelector("#container");
        expect(messageComponent.innerHTML).toContain("layerProperties.styleWarning");
    });

    it("SimpleVectorStyleEditor renders editor if the geometry is not of type GEOMETRY and the layer is wfs", async() => {
        const PROPS = {
            ...BASE_STYLE_TEST_DATA,
            element: {
                type: "wfs",
                search: {
                    url: "something"
                }
            }
        };

        mockFeatureRequestWithGeometryType("MultiPolygon");

        await act(async() => {
            ReactDOM.render(<SimpleVectorStyleEditor {...PROPS}/>, document.querySelector('#container'));
        });

        // Check if the editor is rendered
        const messageComponent = document.querySelector("#container");
        expect(messageComponent.innerHTML).toContain("layerProperties.style");
    });

    it("SimpleVectorStyleEditor renders an empty component if the geometry is not defined and the layer is wfs", async() => {
        const PROPS = {
            ...BASE_STYLE_TEST_DATA,
            element: {
                type: "wfs",
                search: {
                    url: "something"
                }
            }
        };

        mockFeatureRequestWithGeometryType("");

        await act(async() => {
            ReactDOM.render(<SimpleVectorStyleEditor {...PROPS}/>, document.querySelector('#container'));
        });

        // Check if an empty container has been rendered
        const messageComponent = document.querySelector(".empty-state-container");
        expect(messageComponent).toBeTruthy();
    });

    it("SimpleVectorStyleEditor displays an error message if the geometry is type GEOMETRY and the layer is not wfs", async() => {
        const PROPS = {
            ...BASE_STYLE_TEST_DATA,
            element: {
                features: [
                    {geometry: {
                        type: "Geometry"
                    }}
                ]
            }
        };

        await act(async() => {
            ReactDOM.render(<SimpleVectorStyleEditor {...PROPS}/>, document.querySelector('#container'));
        });

        // Check if an error message is rendered
        const messageComponent = document.querySelector("#container");
        expect(messageComponent.innerHTML).toContain("layerProperties.styleWarning");
    });

    it("SimpleVectorStyleEditor renders editor if the geometry is not of type GEOMETRY and the layer is not wfs", async() => {
        const PROPS = {
            ...BASE_STYLE_TEST_DATA,
            element: {
                features: [
                    {geometry: {
                        type: "MultiPolygon"
                    }}
                ]
            }
        };

        await act(async() => {
            ReactDOM.render(<SimpleVectorStyleEditor {...PROPS}/>, document.querySelector('#container'));
        });

        // Check if the editor is rendered
        const messageComponent = document.querySelector("#container");
        expect(messageComponent.innerHTML).toContain("layerProperties.style");
    });

    it("SimpleVectorStyleEditor renders an empty component if the geometry is not set and the layer is not wfs", async() => {
        const PROPS = {
            ...BASE_STYLE_TEST_DATA
        };

        await act(async() => {
            ReactDOM.render(<SimpleVectorStyleEditor {...PROPS}/>, document.querySelector('#container'));
        });

        // Check if an empty container has been rendered
        const messageComponent = document.querySelector(".empty-state-container");
        expect(messageComponent).toBeTruthy();
    });
});
