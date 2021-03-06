import RESOURCE_MANAGER from "../../Resources";
import {
    SelectionMode,
    ConstrainMode,
    DetailsListLayoutMode,
} from "office-ui-fabric-react/lib/DetailsList";
import { IDynamicPortfolioViewConfig } from "./DynamicPortfolioConfiguration";
import { IBaseWebPartProps } from "../@BaseWebPart";

export interface IDynamicPortfolioExcelExportConfig {
    fileName: string;
    sheetName: string;
    buttonLabel: string;
    buttonIcon: string;
}

export default interface IDynamicPortfolioProps extends IBaseWebPartProps {
    loadingText?: string;
    searchProperty?: string;
    searchBoxLabelText?: string;
    showCountText?: string;
    showCountTextWithFilters?: string;
    showGroupBy?: boolean;
    modalHeaderClassName?: string;
    projectInfoFilterField?: string;
    constrainMode?: ConstrainMode;
    layoutMode?: DetailsListLayoutMode;
    selectionMode?: SelectionMode;
    excelExportEnabled?: boolean;
    excelExportConfig?: IDynamicPortfolioExcelExportConfig;
    defaultSortFunction?: (a, b) => 1 | -1;
    defaultView?: IDynamicPortfolioViewConfig;
    viewSelectorEnabled?: boolean;
}

export const DynamicPortfolioDefaultProps: Partial<IDynamicPortfolioProps> = {
    loadingText: RESOURCE_MANAGER.getResource("DynamicPortfolio_LoadingText"),
    searchProperty: "Title",
    searchBoxLabelText: RESOURCE_MANAGER.getResource("DynamicPortfolio_SearchBox_Placeholder"),
    showCountText: RESOURCE_MANAGER.getResource("DynamicPortfolio_ShowCounts"),
    showCountTextWithFilters: RESOURCE_MANAGER.getResource("DynamicPortfolio_ShowCountsWithFilters"),
    showGroupBy: true,
    modalHeaderClassName: "ms-font-xxl",
    projectInfoFilterField: "GtPcPortfolioPage",
    constrainMode: ConstrainMode.horizontalConstrained,
    layoutMode: DetailsListLayoutMode.fixedColumns,
    selectionMode: SelectionMode.none,
    excelExportEnabled: true,
    excelExportConfig: {
        fileName: RESOURCE_MANAGER.getResource("DynamicPortfolio_ExcelExportFileName"),
        sheetName: "Sheet A",
        buttonLabel: RESOURCE_MANAGER.getResource("DynamicPortfolio_ExcelExportButtonLabel"),
        buttonIcon: "ExcelDocument",
    },
    defaultSortFunction: (a, b) => a.Title > b.Title ? 1 : -1,
    viewSelectorEnabled: true,
};
