import RESOURCE_MANAGER from "../../../../Resources";
import { IFile } from "sp-pnp-provisioning/lib/schema";

const ProjectHome: IFile = {
    Folder: "SitePages",
    Src: "{sitecollection}/Resources/SitePage.txt",
    Url: "ProjectHome.aspx",
    Overwrite: true,
    Properties: {
        Title: "Hjemmeside",
        ContentTypeId: "0x010109010058561F86D956412B9DD7957BBCD67AAE01",
    },
    RemoveExistingWebParts: true,
    WebParts: [
        {
            Title: RESOURCE_MANAGER.getResource("WebPart_ProjectPhases_Title"),
            Zone: "LeftColumn",
            Order: 0,
            Contents: {
                FileSrc: "{wpgallery}/ProjectPhases.webpart",
            },
        },
        {
            Title: RESOURCE_MANAGER.getResource("WebPart_Timeline_Title"),
            Zone: "LeftColumn",
            Order: 1,
            PropertyOverrides: [{
                name: "Title",
                type: "string",
                value: RESOURCE_MANAGER.getResource("WebPart_Timeline_Title"),
            },
            {
                name: "ListUrl",
                type: "string",
                value: `{site}/${RESOURCE_MANAGER.getResource("Lists_Tasks_Url")}`,
            },
            {
                name: "TitleUrl",
                type: "string",
                value: `{site}/${RESOURCE_MANAGER.getResource("DefaultView_Tasks_Url")}`,
            },
            {
                name: "CurrentTaskListWebAddress",
                type: "string",
                value: "{site}",
            },
            {
                name: "PageAddress",
                type: "string",
                value: "{site}",
            },
            {
                name: "ViewName",
                type: "string",
                value: RESOURCE_MANAGER.getResource("WebPart_Timeline_ViewName"),
            },
            {
                name: "TimelineType",
                type: "string",
                value: "TaskListTimeline",
            }],
            Contents: {
                FileSrc: "{wpgallery}/Timeline.webpart",
            },
        },
        {
            Title: RESOURCE_MANAGER.getResource("WebPart_DocumentsCurrentPhase_Title"),
            Zone: "LeftColumn",
            Order: 2,
            PropertyOverrides: [{
                name: "Title",
                type: "string",
                value: RESOURCE_MANAGER.getResource("WebPart_DocumentsCurrentPhase_Title"),
            },
            {
                name: "ListUrl",
                type: "string",
                value: `{site}/${RESOURCE_MANAGER.getResource("Lists_Documents_Url")}`,
            },
            {
                name: "TitleUrl",
                type: "string",
                value: `{site}/${RESOURCE_MANAGER.getResource("DefaultView_Documents_Url")}`,
            }],
            Contents: {
                FileSrc: "{sitecollection}/Resources/ListViewWebPart.txt",
            },
            ListView: {
                List: RESOURCE_MANAGER.getResource("Lists_Documents_Title"),
                View: {
                    Title: "",
                    ViewFields: ["DocIcon", "LinkFilename", "Modified", "Editor"],
                    AdditionalSettings: {
                        RowLimit: 10,
                        Paged: true,
                        ViewQuery: "<OrderBy><FieldRef Name='Created' Ascending='FALSE' /></OrderBy>",
                        Scope: 0,
                    },
                },
            },
        },
        {
            Title: RESOURCE_MANAGER.getResource("Lists_BenefitsAnalysis_Title"),
            Zone: "LeftColumn",
            Order: 3,
            PropertyOverrides: [{
                name: "Title",
                type: "string",
                value: RESOURCE_MANAGER.getResource("Lists_BenefitsAnalysis_Title"),
            },
            {
                name: "ListUrl",
                type: "string",
                value: `{site}/${RESOURCE_MANAGER.getResource("Lists_BenefitsAnalysis_Url")}`,
            },
            {
                name: "TitleUrl",
                type: "string",
                value: `{site}/${RESOURCE_MANAGER.getResource("DefaultView_BenefitsAnalysis_Url")}`,
            }],
            Contents: {
                FileSrc: "{sitecollection}/Resources/ListViewWebPart.txt",
            },
            ListView: {
                List: RESOURCE_MANAGER.getResource("Lists_BenefitsAnalysis_Title"),
                View: {
                    Title: "",
                    ViewFields: ["LinkTitle", "GtChangeLookup", "GtGainsType", "GtRealizationTime"],
                    AdditionalSettings: {
                        RowLimit: 10,
                        Paged: true,
                        ViewQuery: "<OrderBy><FieldRef Name='Created' Ascending='FALSE' /></OrderBy>",
                    },
                },
            },
        },
        {
            Title: RESOURCE_MANAGER.getResource("WebPart_ProjectInfo_Title"),
            Zone: "RightColumn",
            Order: 0,
            Contents: {
                FileSrc: "{wpgallery}/ProjectInfo.webpart",
            },
        },
        {
            Title: RESOURCE_MANAGER.getResource("WebPart_SiteFeed_Title"),
            Zone: "RightColumn",
            Order: 1,
            Contents: {
                FileSrc: "{wpgallery}/SiteFeed.dwp",
            },
        },
        {
            Title: RESOURCE_MANAGER.getResource("WebPart_UncertaintiesCurrentPhase_Title"),
            Zone: "RightColumn",
            Order: 2,
            PropertyOverrides: [{
                name: "Title",
                type: "string",
                value: RESOURCE_MANAGER.getResource("WebPart_UncertaintiesCurrentPhase_Title"),
            },
            {
                name: "ListUrl",
                type: "string",
                value: `{site}/${RESOURCE_MANAGER.getResource("Lists_Uncertainties_Url")}`,
            },
            {
                name: "TitleUrl",
                type: "string",
                value: `{site}/${RESOURCE_MANAGER.getResource("DefaultView_Uncertainties_Url")}`,
            }],
            Contents: {
                FileSrc: "{sitecollection}/Resources/ListViewWebPart.txt",
            },
            ListView: {
                List: RESOURCE_MANAGER.getResource("Lists_Uncertainties_Title"),
                View: {
                    Title: "",
                    ViewFields: ["LinkTitle", "GtRiskProximity", "GtRiskFactor"],
                    AdditionalSettings: {
                        RowLimit: 10,
                        Paged: true,
                        ViewQuery: "<OrderBy><FieldRef Name='Created' Ascending='FALSE' /></OrderBy>",
                    },
                },
            },
        },
    ],
};

export default ProjectHome;
