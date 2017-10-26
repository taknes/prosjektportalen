import {
    CreateJsomContext,
    ExecuteJsomQuery,
    JsomContext,
} from "jsom-ctx";
import { ISiteGroup } from "../../Model";
import IProvisionContext from "../IProvisionContext";
import ProvisionError from "../ProvisionError";

/**
 * Ensure Site Group
 *
 * @param {ISiteGroup} group Group to ensure
 * @param {SP.RoleType} roleType Role type
 * @param {JsomContext} jsomCtx JSOM context
 * @param {SP.Principal} owner Group owner
 * @param {boolean} allowRequestToJoinLeave Allow request to join/leave
 */
async function EnsureSiteGroup(group: ISiteGroup, roleType: SP.RoleType, jsomCtx: JsomContext, owner?: SP.Principal, allowRequestToJoinLeave = true): Promise<SP.Group> {
    let groupCreationInformation = new SP.GroupCreationInformation();
    groupCreationInformation.set_title(group.Title);
    const siteGroup = jsomCtx.rootWeb.get_siteGroups().add(groupCreationInformation);
    await ExecuteJsomQuery(jsomCtx, [siteGroup]);
    const roleDefinitionBinding = SP.RoleDefinitionBindingCollection.newObject(jsomCtx.clientContext);
    const roleDefinition = jsomCtx.web.get_roleDefinitions().getByType(roleType);
    roleDefinitionBinding.add(roleDefinition);
    const roleAssignments = jsomCtx.web.get_roleAssignments();
    roleAssignments.add(siteGroup, roleDefinitionBinding);
    siteGroup.set_allowRequestToJoinLeave(allowRequestToJoinLeave);
    if (owner) {
        siteGroup.set_owner(owner);
    }
    await ExecuteJsomQuery(jsomCtx, [siteGroup, roleDefinition]);
    return siteGroup;
}

/**
 * Creates a new subsite
 *
 * @param {IProvisionContext} context Provisioning context
 */
export default async function SetUpAssociatedGroup(context: IProvisionContext) {
    try {
        if (context.model.AssociatedVisitorGroup && context.model.AssociatedMemberGroup && context.model.AssociatedOwnerGroup) {
            context.progressCallbackFunc("Setter opp grupper", "");
            let jsomCtx = await CreateJsomContext(context.url);
            const currentUser = jsomCtx.web.get_currentUser();
            const associatedOwnerGroup = await EnsureSiteGroup(context.model.AssociatedOwnerGroup, SP.RoleType.administrator, jsomCtx, currentUser);
            const associatedVisitorGroup = await EnsureSiteGroup(context.model.AssociatedVisitorGroup, SP.RoleType.reader, jsomCtx, associatedOwnerGroup);
            const associatedMemberGroup = await EnsureSiteGroup(context.model.AssociatedMemberGroup, SP.RoleType.contributor, jsomCtx, associatedOwnerGroup);
            jsomCtx.web.set_associatedVisitorGroup(associatedVisitorGroup);
            jsomCtx.web.set_associatedMemberGroup(associatedMemberGroup);
            jsomCtx.web.set_associatedOwnerGroup(associatedOwnerGroup);
            jsomCtx.web.update();
            await ExecuteJsomQuery(jsomCtx);
            return {
                ...context,
                associatedVisitorGroup,
                associatedMemberGroup,
                associatedOwnerGroup,
                redirectUrl: context.url,
            };
        }
        return context;
    } catch (err) {
        console.log(err);
        throw new ProvisionError(err, "SetUpAssociatedGroup");
    }
}
