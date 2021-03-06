import RESOURCE_MANAGER from "../../../../Resources";
import { IList } from "sp-pnp-provisioning/lib/schema";

const ProjectStatus: IList =  {
    Title: RESOURCE_MANAGER.getResource("Lists_ProjectStatus_Title"),
    Description: "",
    Template: 101,
    ContentTypesEnabled: true,
    RemoveExistingContentTypes: true,
    ContentTypeBindings: [{
        ContentTypeID: "0x010100293FDE3FCADA480B9A77BBDAD7DFA28C02",
    }],
    AdditionalSettings: {
        EnableVersioning: true,
    },
    Views: [{
        Title: RESOURCE_MANAGER.getResource("View_AllDocuments_DisplayName"),
        ViewFields: ["DocIcon", "LinkFilename", "Modified", "Editor"],
        AdditionalSettings: {
            RowLimit: 30,
            Paged: true,
            ViewQuery: `<OrderBy>
              <FieldRef Name="ID" Ascending="FALSE" />
            </OrderBy>`,
        },
    }],
};

export default ProjectStatus;
