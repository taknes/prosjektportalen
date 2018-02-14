import IRiskMatrixData from "./IRiskMatrixData";

export default interface IRiskMatrixState {
    isLoading?: boolean;
    data?: IRiskMatrixData;
    selectedRisk?: any;
    showDialog?: boolean;
    postAction?: boolean;
    hideLabels?: boolean;
}
