import ListConfig from "../../Provision/Data/Config/ListConfig";
import { IProjectModel, ISiteGroup } from "../../Model";

export enum ProvisionStatus {
    Idle,
    Creating,
    Error,
}

export default interface INewProjectFormState {
    model: IProjectModel;
    errorMessages: any;
    listDataConfig: { [key: string]: ListConfig };
    provisioning: {
        status: ProvisionStatus;
        step?: string;
        progress?: string;
        error?: any;
    };
    siteGroups: ISiteGroup[];
    showListContentSettings?: boolean;
    showGroupSettings?: boolean;
    formValid?: boolean;
}

