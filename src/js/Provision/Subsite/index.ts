import RESOURCE_MANAGER from "../../@localization";
import DoesWebExist from "./DoesWebExist";
import SetUpAssociatedGroup from "./SetUpAssociatedGroup";
import SetSharedNavigation from "./SetSharedNavigation";
import IProvisionContext from "../IProvisionContext";
import ProvisionError from "../ProvisionError";

/**
 * Get redirect URL. Appends permsetup.aspx if the web has unique permissions
 *
 * @param {string} url Url
 * @param {boolean} inheritPermissions Inherit permissions
 */
const GetRedirectUrl = (url: string, inheritPermissions: boolean): string => {
    return inheritPermissions ? url : String.format("{0}/_layouts/15/permsetup.aspx?next={1}", url, encodeURIComponent(url));
};

/**
 * Creates a new subsite
 *
 * @param {IProvisionContext} context Provisioning context
 */
async function CreateWeb(context: IProvisionContext): Promise<IProvisionContext> {
    context.progressCallbackFunc(RESOURCE_MANAGER.getResource("ProvisionWeb_CreatingWeb"), "");
    try {
        const webAddResult = await context.rootWeb.webs.add(context.model.Title, context.model.Url.toLowerCase(), context.model.Description, "STS#0", _spPageContextInfo.webLanguage, context.model.InheritPermissions);
        await SetSharedNavigation(webAddResult.data.Url);
        return {
            ...context,
            web: webAddResult.web,
            url: webAddResult.data.Url,
            redirectUrl: GetRedirectUrl(webAddResult.data.Url, context.model.InheritPermissions),
        };
    } catch (err) {
        throw new ProvisionError(err, "CreateWeb");
    }
}

export {
    DoesWebExist,
    SetSharedNavigation,
    CreateWeb,
    SetUpAssociatedGroup,
};
