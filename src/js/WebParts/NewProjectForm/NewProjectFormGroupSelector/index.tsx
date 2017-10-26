import * as React from "react";
import RESOURCE_MANAGER from "../../../@localization";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
import { Toggle } from "office-ui-fabric-react/lib/Toggle";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import * as Util from "../../../Util";
import INewProjectFormGroupSelectorProps from "./INewProjectFormGroupSelectorProps";
import INewProjectFormGroupSelectorState from "./INewProjectFormGroupSelectorState";

/**
 * New Project Form
 */
export default class NewProjectFormGroupSelector extends React.Component<INewProjectFormGroupSelectorProps, INewProjectFormGroupSelectorState> {
    public static displayName = "NewProjectFormGroupSelector";

    /**
     * Constructor
     *
     * @param {INewProjectFormGroupSelectorProps} props Props
     */
    constructor(props: INewProjectFormGroupSelectorProps) {
        super(props);
        this.state = {
            createNewGroup: true,
            createNewGroupDefaultValue: `${this.props.webTitle}${this.props.groupNamePostix}`,
        };
        this.onChanged = this.onChanged.bind(this);
    }

    public componentWillReceiveProps(nextProps: INewProjectFormGroupSelectorProps) {
        const createNewGroupDefaultValue = `${nextProps.webTitle}${nextProps.groupNamePostix}`;
        this.setState({ createNewGroupDefaultValue });
    }

    public shouldComponentUpdate(nextProps: INewProjectFormGroupSelectorProps, nextState: INewProjectFormGroupSelectorState) {
        return this.state.createNewGroupDefaultValue !== nextState.createNewGroupDefaultValue;
    }

    public componentDidUpdate() {
        this.onChanged(this.state.createNewGroupDefaultValue);
    }

    public render(): JSX.Element {
        return (
            <div style={{ marginBottom: 15 }}>
                <div className="ms-font-m">{this.props.title}</div>
                <div className="ms-font-xs">{this.props.description}</div>
                <div>
                    <Toggle
                        key={this.generateKey("ToggleCreateNewGroup", false)}
                        disabled={!this.props.useExistingGroupEnabled}
                        style={{ margin: 0 }}
                        defaultChecked={this.state.createNewGroup}
                        onChanged={createNewGroup => this.setState({ createNewGroup })}
                        onText={RESOURCE_MANAGER.getResource("String_CreateNewGroup")}
                        offText={RESOURCE_MANAGER.getResource("String_UseExistingGroup")} />
                    {this.state.createNewGroup
                        ? (
                            <TextField
                                key={this.generateKey("DropdownOption", true)}
                                defaultValue={this.state.createNewGroupDefaultValue}
                                onChanged={this.onChanged} />
                        )
                        : (
                            <Dropdown
                                key={this.generateKey("Dropdown", false)}
                                options={this.getSiteGroupOptions()}
                                onChanged={this.onChanged} />
                        )}
                </div>
            </div>
        );
    }

    private generateKey(component: string, updateOnStateChange: boolean, additionalString?: string): string {
        let parts = [this.props.title, component];
        if (additionalString) {
            parts.push(additionalString);
        }
        if (updateOnStateChange) {
            parts.push(`${new Date().getTime()}`);
        }
        return Util.cleanString(parts.join(""));
    }

    private onChanged(newValue): void {
        let siteGroup;
        if (typeof newValue === "string") {
            siteGroup = { Title: newValue };
        } else {
            siteGroup = { Title: newValue.data };
        }
        this.props.onChanged(this.props.modelKey, siteGroup);
    }

    private getSiteGroupOptions(): IDropdownOption[] {
        return this.props.siteGroups.map(grp => {
            return {
                key: this.generateKey("DropdownOption", false, grp.Title),
                text: grp.Title,
                data: grp,
            };
        });
    }
}

export {
    INewProjectFormGroupSelectorProps,
    INewProjectFormGroupSelectorState,
};
