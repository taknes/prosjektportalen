import RESOURCE_MANAGER from "../../../../Resources";
import { IList } from "sp-pnp-provisioning/lib/schema";

const PhaseChecklist: IList = {
    Title: RESOURCE_MANAGER.getResource("Lists_PhaseChecklist_Title"),
    Description: "",
    Template: 100,
    ContentTypesEnabled: true,
    RemoveExistingContentTypes: true,
    ContentTypeBindings: [{
        ContentTypeID: "0x010088578E7470CC4AA68D5663464831070204",
    }],
    AdditionalSettings: {
        EnableVersioning: true,
    },
    Views: [{
        Title: RESOURCE_MANAGER.getResource("View_AllItems_DisplayName"),
        ViewFields: ["LinkTitle", "GtProjectPhase", "GtChecklistStatus", "GtComment"],
        AdditionalSettings: {
            RowLimit: 50,
            ViewQuery: `<OrderBy>
              <FieldRef Name="GtSortOrder" />
              <FieldRef Name="ID" />
            </OrderBy>
            <Where>
                <Neq>
                    <FieldRef Name="GtChecklistStatus" />
                    <Value Type="Text">${RESOURCE_MANAGER.getResource("Choice_GtChecklistStatus_Archived")}</Value>
                </Neq>
            </Where>`,
        },
    },
    {
        Title: RESOURCE_MANAGER.getResource("View_Archived_DisplayName"),
        ViewFields: ["LinkTitle", "GtProjectPhase", "GtComment"],
        AdditionalSettings: {
            RowLimit: 50,
            ViewQuery: `<OrderBy>
              <FieldRef Name="GtSortOrder" />
              <FieldRef Name="ID" />
            </OrderBy>
            <Where>
                <Eq>
                    <FieldRef Name="GtChecklistStatus" />
                    <Value Type="Text">${RESOURCE_MANAGER.getResource("Choice_GtChecklistStatus_Archived")}</Value>
                </Eq>
            </Where>`,
        },
    },
    {
        Title: RESOURCE_MANAGER.getResource("View_GroupedStatus_DisplayName"),
        ViewFields: ["LinkTitle", "GtProjectPhase", "GtComment"],
        AdditionalSettings: {
            RowLimit: 50,
            ViewQuery: `<GroupBy Collapse="TRUE" GroupLimit="30">
              <FieldRef Name="GtChecklistStatus" Ascending="FALSE" />
            </GroupBy>
            <OrderBy>
                <FieldRef Name="GtSortOrder" />
                <FieldRef Name="ID" />
            </OrderBy>`,
        },
    }],
};

export default PhaseChecklist;
