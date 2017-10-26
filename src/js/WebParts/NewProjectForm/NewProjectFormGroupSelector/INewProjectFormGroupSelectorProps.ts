import { ISiteGroup } from "../../../Model";

export default interface INewProjectFormGroupSelectorProps {
    modelKey: string;
    title: string;
    description: string;
    groupNamePostix: string;
    siteGroups: ISiteGroup[];
    webTitle: string;
    onChanged: (modelKey: string, group: ISiteGroup) => void;
    useExistingGroupEnabled?: boolean;
}
