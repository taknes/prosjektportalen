import { Web } from "sp-pnp-js";
import { IProjectModel } from "../Model";
import IProgressCallback from "./IProgressCallback";

export default interface IProvisionContext {
    model: IProjectModel;
    progressCallbackFunc: IProgressCallback;
    web?: Web;
    rootWeb?: Web;
    url?: string;
    redirectUrl?: string;
    webProperties?: { pp_assetssiteurl: string, pp_datasourcesiteurl: string, pp_version: string };
    associatedVisitorGroup?: SP.Group;
    associatedMemberGroup?: SP.Group;
    associatedOwnerGroup?: SP.Group;
}
