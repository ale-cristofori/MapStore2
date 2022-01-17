import { set } from '@mapstore/utils/ImmutableUtils';
import { TIME_SERIES_PLOTS, SELECT_NODE } from '../../../actions/layers';
import { 
    STORE_TIME_SERIES_CHART_DATA,
    STORE_TIME_SERIES_FEATURES_IDS,
    TEAR_DOWN,
    TOGGLE_SELECTION,
    SETUP,
    SET_CURRENT_SELECTION,
    REMOVE_TABLE_SELECTION_ROW
} from '../actions/timeSeriesPlots';

const INITIAL_STATE = {
    selections: [],
    timePlotsData: []
};

export default function timeSeriesPlots(state = INITIAL_STATE, action) {
    const type = action?.type;
    switch(type) {
        case TEAR_DOWN: {
            return INITIAL_STATE;
        }
        // this is temporary just to wire-up layer selection
        // we will setup a dropdown to select a single
        // layer directly from the plugin window
        case SELECT_NODE: {
            const { id } = action;
            return set("selectedLayer.id", id, state);
        }
        case SETUP:
            const { cfg } = action;
            return set('pluginCfg', cfg, state);
        case STORE_TIME_SERIES_FEATURES_IDS: {
            const { selectionId, selectionType, layerName, featuresIds } = action;
            let { selectionName } = action;
            selectionName = `${selectionName} ${state.selections.length + 1}`;
            return {
                ...state,
                selections: [...state.selections, {selectionId, selectionName, selectionType, layerName, featuresIds, isCurrent: true}]
            }
        }
        case STORE_TIME_SERIES_CHART_DATA: {
            const { selectionId, chartData } = action;
            return {
                ...state,
                timePlotsData: [...state.timePlotsData, {selectionId, chartData}]
            }
        }
        case SET_CURRENT_SELECTION:
            const { index } = action;
            return set('currentSelectionIndex', index, state);
        case TIME_SERIES_PLOTS: {
            return state;
        }
        case TOGGLE_SELECTION: {
            const { selectionType } = action;
            return set("selectionType", selectionType, state);
        }
        case REMOVE_TABLE_SELECTION_ROW: {
            const { selectionId } = action;
            return {
                ...state,
                selections: state.selections
                .filter(selection => selection.selectionId !== selectionId)
                .map((item, index) => ({
                    ...item,
                    selectionName: `${(item.selectionType === 'POLYGON' || item.selectionType === 'CIRCLE' ? 'AOI' : 'Point')} ${index + 1}`
                })),
                timePlotsData: state.timePlotsData.filter(timePlotData => timePlotData.selectionId !== selectionId)
            }
        }
        default:
            return state;
    }
}