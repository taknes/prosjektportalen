import * as React from "react";
import RESOURCE_MANAGER from "../../@localization";
import * as delay from "delay";
import pnp from "sp-pnp-js";
import ProvisionWeb, { DoesWebExist } from "../../Provision";
import {
    PrimaryButton,
    DefaultButton,
} from "office-ui-fabric-react/lib/Button";
import { Modal } from "office-ui-fabric-react/lib/Modal";
import { Icon } from "office-ui-fabric-react/lib/Icon";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { Toggle } from "office-ui-fabric-react/lib/Toggle";
import {
    Dialog,
    DialogFooter,
    DialogType,
} from "office-ui-fabric-react/lib/Dialog";
import { ISiteGroup } from "../../Model";
import ListConfig from "../../Provision/Data/Config/ListConfig";
import * as ListDataConfig from "../../Provision/Data/Config";
import * as Util from "../../Util";
import NewProjectFormRenderMode from "./NewProjectFormRenderMode";
import INewProjectFormProps, { NewProjectFormDefaultProps } from "./INewProjectFormProps";
import INewProjectFormState, { ProvisionStatus } from "./INewProjectFormState";
import NewProjectFormGroupSelector from "./NewProjectFormGroupSelector";
import CreationModal from "./CreationModal";

/**
 * New Project Form
 */
export default class NewProjectForm extends React.Component<INewProjectFormProps, INewProjectFormState> {
    public static displayName = "NewProjectForm";
    public static defaultProps = NewProjectFormDefaultProps;
    private doesWebExistDelay;

    /**
     * Constructor
     *
     * @param {INewProjectFormProps} props Props
     */
    constructor(props: INewProjectFormProps) {
        super(props);
        this.state = {
            model: {
                Title: "",
                Description: "",
                Url: "",
                InheritPermissions: props.inheritPermissions,
            },
            errorMessages: {},
            listDataConfig: {},
            provisioning: { status: ProvisionStatus.Idle },
            siteGroups: [],
        };
        this._onSubmit = this._onSubmit.bind(this);
    }

    public async componentDidMount() {
        const [configState, dataState] = await Promise.all([
            this.getRequiredConfig(),
            this.getRequiredData(),
        ]);
        const defaultContent = Object.keys(configState.listDataConfig).filter(key => configState.listDataConfig[key].Default);
        let model = {
            ...this.state.model,
            IncludeContent: defaultContent,
        };
        this.setState({ ...configState, ...dataState, model });
    }

    public render(): JSX.Element {
        switch (this.state.provisioning.status) {
            case ProvisionStatus.Idle: {
                switch (this.props.renderMode) {
                    case NewProjectFormRenderMode.Default: {
                        return (
                            <div
                                className={this.props.className}
                                style={this.props.style}>
                                <div
                                    className="ms-font-l"
                                    style={{ paddingBottom: 15 }}>{this.props.subHeaderText}</div>
                                {this.renderFormInput()}
                                {this.renderSettings()}
                                {this.renderFooter()}
                            </div>
                        );
                    }
                    case NewProjectFormRenderMode.Dialog: {
                        return (
                            <Dialog
                                hidden={false}
                                dialogContentProps={{
                                    type: DialogType.largeHeader,
                                    subText: this.props.subHeaderText,
                                }}
                                modalProps={{
                                    isDarkOverlay: true,
                                    isBlocking: true,
                                    className: this.props.className,
                                }}
                                title={this.props.headerText}
                                onDismiss={this.props.onDialogDismiss}>
                                <div>
                                    {this.renderFormInput()}
                                    {this.renderSettings()}
                                    {this.renderFooter()}
                                </div>
                            </Dialog >
                        );
                    }
                }
            }
                break;
            case ProvisionStatus.Creating: {
                return (
                    <CreationModal
                        title={String.format(this.props.creationModalTitle, this.state.model.Title)}
                        isBlocking={true}
                        isDarkOverlay={true}
                        progressLabel={this.state.provisioning.step}
                        progressDescription={this.state.provisioning.progress} />
                );
            }
            case ProvisionStatus.Error: {
                return (
                    <Modal
                        isOpen={true}
                        isBlocking={false}
                        isDarkOverlay={true}
                        onDismiss={this.props.onDialogDismiss}
                        containerClassName="pp-modal" >
                        <div style={{ padding: 50 }}>
                            <div style={{ marginBottom: 25 }} className="ms-font-xl">{RESOURCE_MANAGER.getResource("ProvisionWeb_Failed")}</div>
                            <div className="ms-font-m">{RESOURCE_MANAGER.getResource("String_ContactAdmin")}</div>
                        </div>
                    </Modal>
                );
            }
        }
    }

    /**
     * Get required config for the component
     */
    private async getRequiredConfig(): Promise<{ listDataConfig: { [key: string]: ListConfig } }> {
        const listDataConfig = await ListDataConfig.RetrieveConfig();
        return { listDataConfig };
    }

    /**
     * Get required data for the component
     */
    private async getRequiredData(): Promise<{ siteGroups: ISiteGroup[] }> {
        const siteGroups = await pnp.sp.web.siteGroups.select("Id", "Title").get();
        return { siteGroups };
    }

    /**
     * Render form input field
     */
    private renderFormInput(): JSX.Element {
        return (
            <section>
                <div style={this.props.inputContainerStyle}>
                    <TextField
                        placeholder={RESOURCE_MANAGER.getResource("NewProjectForm_TitlePlaceholder")}
                        onChanged={newValue => this.onFormInputChange("Title", newValue)}
                        errorMessage={this.state.errorMessages.Title} />
                </div>
                <div style={this.props.inputContainerStyle}>
                    <TextField
                        placeholder={RESOURCE_MANAGER.getResource("NewProjectForm_DescriptionPlaceholder")}
                        multiline
                        autoAdjustHeight
                        onChanged={newValue => this.onFormInputChange("Description", newValue)}
                        errorMessage={this.state.errorMessages.Description} />
                </div>
                <div style={this.props.inputContainerStyle}>
                    <TextField
                        placeholder={RESOURCE_MANAGER.getResource("NewProjectForm_UrlPlaceholder")}
                        value={this.state.model.Url}
                        onChanged={newValue => this.onFormInputChange("Url", newValue)}
                        errorMessage={this.state.errorMessages.Url} />
                </div>
            </section>
        );
    }

    /**
     * Render settings
     */
    private renderSettings() {
        return (
            <div className={this.props.settingsClassName}>
                <div hidden={Object.keys(this.state.listDataConfig).length === 0}>
                    <div className="ms-font-l toggle-section" onClick={e => this.setState({ showListContentSettings: !this.state.showListContentSettings })} >
                        <span>{RESOURCE_MANAGER.getResource("NewProjectForm_ShowListContentSettings")}</span>
                        <span className={this.state.showListContentSettings ? "ChevronUp" : "ChevronDown"}>
                            <Icon iconName={this.state.showListContentSettings ? "ChevronUp" : "ChevronDown"} />
                        </span>
                    </div>
                    <section hidden={!this.state.showListContentSettings}>
                        {Object.keys(this.state.listDataConfig).map(key => {
                            const { Default, Label } = this.state.listDataConfig[key];
                            return (
                                <Toggle
                                    key={key}
                                    defaultChecked={Default}
                                    label={Label}
                                    onChanged={checked => this.toggleContent(key, checked)}
                                    onText={RESOURCE_MANAGER.getResource("String_Yes")}
                                    offText={RESOURCE_MANAGER.getResource("String_No")} />
                            );
                        })}
                    </section>
                </div>
                <div>
                    <div className="ms-font-l toggle-section" onClick={e => this.setState({ showGroupSettings: !this.state.showGroupSettings })}                    >
                        <span>{RESOURCE_MANAGER.getResource("NewProjectForm_ShowGroupSettings")}</span>
                        <span className={this.state.showGroupSettings ? "ChevronUp" : "ChevronDown"}>
                            <Icon iconName={this.state.showGroupSettings ? "ChevronUp" : "ChevronDown"} />
                        </span>
                    </div>
                    <section hidden={!this.state.showGroupSettings}>
                        <NewProjectFormGroupSelector
                            modelKey="AssociatedVisitorGroup"
                            title={RESOURCE_MANAGER.getResource("String_GroupVisitors_Title")}
                            description={RESOURCE_MANAGER.getResource("String_GroupVisitors_Description")}
                            groupNamePostix={RESOURCE_MANAGER.getResource("String_GroupVisitors_Postfix")}
                            siteGroups={this.state.siteGroups}
                            webTitle={this.state.model.Title}
                            onChanged={(key, group) => {
                                let { model } = this.state;
                                model[key] = group;
                                this.setState({ model });
                            }} />
                        <NewProjectFormGroupSelector
                            modelKey="AssociatedMemberGroup"
                            title={RESOURCE_MANAGER.getResource("String_GroupMembers_Title")}
                            description={RESOURCE_MANAGER.getResource("String_GroupMembers_Description")}
                            groupNamePostix={RESOURCE_MANAGER.getResource("String_GroupMembers_Postfix")}
                            siteGroups={this.state.siteGroups}
                            webTitle={this.state.model.Title}
                            onChanged={(key, group) => {
                                let { model } = this.state;
                                model[key] = group;
                                this.setState({ model });
                            }} />
                        <NewProjectFormGroupSelector
                            modelKey="AssociatedOwnerGroup"
                            title={RESOURCE_MANAGER.getResource("String_GroupOwners_Title")}
                            description={RESOURCE_MANAGER.getResource("String_GroupOwners_Description")}
                            groupNamePostix={RESOURCE_MANAGER.getResource("String_GroupOwners_Postfix")}
                            siteGroups={this.state.siteGroups}
                            webTitle={this.state.model.Title}
                            onChanged={(key, group) => {
                                let { model } = this.state;
                                model[key] = group;
                                this.setState({ model });
                            }} />
                    </section>
                </div>
            </div>
        );
    }


    /**
     * Render footer
     */
    private renderFooter() {
        switch (this.props.renderMode) {
            case NewProjectFormRenderMode.Default: {
                return (
                    <div style={{ paddingTop: 15 }}>
                        <div style={{ float: "right" }}>
                            <PrimaryButton
                                onClick={this._onSubmit}
                                disabled={!this.state.formValid}>{RESOURCE_MANAGER.getResource("String_Create")}</PrimaryButton>
                        </div>
                    </div>
                );
            }
            case NewProjectFormRenderMode.Dialog: {
                return (
                    <DialogFooter>
                        <PrimaryButton
                            onClick={this._onSubmit}
                            disabled={!this.state.formValid}>{RESOURCE_MANAGER.getResource("String_Create")}</PrimaryButton>
                        <DefaultButton onClick={() => this.props.onDialogDismiss()}>{RESOURCE_MANAGER.getResource("String_Close")}</DefaultButton>
                    </DialogFooter>
                );
            }
        }
    }

    /**
     * Toggle content
     *
     * @param {string} key Key
     * @param {boolean} checked Is checked
     */
    private toggleContent(key: string, checked: boolean) {
        this.setState(prevState => {
            let { IncludeContent } = prevState.model;
            if (checked) {
                IncludeContent.push(key);
            } else {
                IncludeContent.splice(IncludeContent.indexOf(key), 1);
            }
            return {
                model: {
                    ...prevState.model,
                    IncludeContent: IncludeContent,
                },
            };
        });
    }

    /**
     * On form input change
     *
     * @param {string} input Input (key) that was changed
     * @param {string} newTitleValue New Title value
     */
    private async onFormInputChange(input: string, newValue: string) {
        const self = this;
        switch (input) {
            case "Title": {
                const url = Util.cleanString(newValue, this.props.maxUrlLength);
                if (this.doesWebExistDelay) {
                    this.doesWebExistDelay.cancel();
                    this.doesWebExistDelay = null;
                }
                this.doesWebExistDelay = delay(250);
                try {
                    await this.doesWebExistDelay;
                    const doesExist = await DoesWebExist(url);
                    self.setState(prevState => ({
                        errorMessages: {
                            ...prevState.errorMessages,
                            Url: doesExist ? RESOURCE_MANAGER.getResource("NewProjectForm_UrlPlaceholderAlreadyInUse") : null,
                        },
                        formValid: (newValue.length >= self.props.titleMinLength) && !doesExist,
                        model: {
                            ...prevState.model,
                            Title: newValue,
                            Url: url,
                        },
                    }));
                } catch (err) {
                    // Timeout cancelled
                }
            }
                break;
            case "Url": {
                if (this.doesWebExistDelay) {
                    this.doesWebExistDelay.cancel();
                    this.doesWebExistDelay = null;
                }
                this.doesWebExistDelay = delay(250);
                try {
                    await this.doesWebExistDelay;
                    const doesExist = await DoesWebExist(newValue);
                    self.setState(prevState => ({
                        errorMessages: {
                            ...prevState.errorMessages,
                            Url: doesExist ? RESOURCE_MANAGER.getResource("NewProjectForm_UrlPlaceholderAlreadyInUse") : null,
                        },
                        formValid: (prevState.model.Title.length >= self.props.titleMinLength) && !doesExist,
                        model: {
                            ...prevState.model,
                            Url: newValue,
                        },
                    }));
                } catch (err) {
                    // Timeout cancelled
                }
            }
                break;
            case "Description": {
                this.setState(prevState => ({
                    formValid: (prevState.model.Title.length >= this.props.titleMinLength),
                    model: {
                        ...prevState.model,
                        Description: newValue,
                    },
                }));
            }
                break;
        }
    }

    /**
     * Submits a project model
     */
    private async _onSubmit(event): Promise<void> {
        event.preventDefault();
        this.setState({ provisioning: { status: ProvisionStatus.Creating } });
        try {
            const redirectUrl = await ProvisionWeb(this.state.model, (step, progress) => {
                this.setState({
                    provisioning: { status: ProvisionStatus.Creating, step, progress },
                });
            });
            document.location.href = redirectUrl;
        } catch {
            this.setState({
                provisioning: { status: ProvisionStatus.Error },
            });
        }
    }
}

export {
    NewProjectFormRenderMode,
    INewProjectFormProps,
    INewProjectFormState,
};
