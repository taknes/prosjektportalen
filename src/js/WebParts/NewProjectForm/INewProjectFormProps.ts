import RESOURCE_MANAGER from "../../@localization";
import NewProjectFormRenderMode from "./NewProjectFormRenderMode";

export default interface INewProjectFormProps {
    inheritPermissions?: boolean;
    className?: string;
    style?: React.CSSProperties;
    settingsClassName?: string;
    titleMinLength?: number;
    titleMaxLength?: number;
    maxUrlLength?: number;
    renderMode?: NewProjectFormRenderMode;
    onDialogDismiss?: (ev?: React.MouseEvent<HTMLButtonElement>) => any;
    headerText?: string;
    subHeaderText?: string;
    creationModalTitle?: string;
    inputContainerStyle?: React.CSSProperties;
}

export const NewProjectFormDefaultProps: Partial<INewProjectFormProps> = {
    inheritPermissions: false,
    titleMinLength: 4,
    className: "pp-newProjectForm",
    settingsClassName: "advanced-settings",
    maxUrlLength: 18,
    renderMode: NewProjectFormRenderMode.Default,
    onDialogDismiss: () => {
        //
    },
    headerText: RESOURCE_MANAGER.getResource("NewProjectForm_Title"),
    subHeaderText: RESOURCE_MANAGER.getResource("NewProjectForm_SubText"),
    creationModalTitle: RESOURCE_MANAGER.getResource("CreationModal_Title"),
    inputContainerStyle: { marginBottom: 5 },
};
