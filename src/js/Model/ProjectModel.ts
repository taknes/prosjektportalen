import ISiteGroup from "./ISiteGroup";

export interface IProjectModel {
    Title?: string;
    Url?: string;
    Description?: string;
    InheritPermissions?: boolean;
    AssociatedVisitorGroup?: ISiteGroup;
    AssociatedMemberGroup?: ISiteGroup;
    AssociatedOwnerGroup?: ISiteGroup;
    IncludeContent?: string[];
    ProjectPhase?: string;
    ProjectPhaseLetter?: string;
    ProjectOwner?: string;
    ProjectManager?: string;
}

export class ProjectModel implements IProjectModel {
    public Title?: string;
    public Url?: string;
    public Description?: string;
    public InheritPermissions?: boolean;
    public AssociatedVisitorGroup?: ISiteGroup;
    public AssociatedMemberGroup?: ISiteGroup;
    public AssociatedOwnerGroup?: ISiteGroup;
    public IncludeContent?: string[];
    public ProjectPhase?: string;
    public ProjectPhaseLetter?: string;
    public ProjectOwner?: string;
    public ProjectManager?: string;

    constructor(obj?) {
        if (obj) {
            this.Title = obj.Title;
            this.Url = obj.Url;
            this.Description = obj.Description || "";
            this.InheritPermissions = obj.InheritPermissions;
            this.IncludeContent = obj.IncludeContent;
        }
    }
}
