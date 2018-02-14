export default interface IRiskMatrixState {
    isLoading?: boolean;
    data?: { items: any[], views: any[] };
    selectedRisk?: any;
    showDialog?: boolean;
    postAction?: boolean;
    hideLabels?: boolean;
}
