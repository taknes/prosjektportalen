import RESOURCE_MANAGER from "../../../../Resources";
import { IList } from "sp-pnp-provisioning/lib/schema";

const MeetingCalendar: IList = {
    Title: RESOURCE_MANAGER.getResource("Lists_MeetingCalendar_Title"),
    Description: "",
    Template: 106,
    ContentTypesEnabled: true,
    RemoveExistingContentTypes: true,
    ContentTypeBindings: [{
        ContentTypeID: "0x010200A2B2AC17A2244B8590398A9D1E7E3E3701",
    }],
    AdditionalSettings: {
        EnableVersioning: true,
    },
};

export default MeetingCalendar;
