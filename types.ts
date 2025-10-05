
export enum UserRole {
  EMPLOYEE = 'Employee',
  MANAGER = 'Line Manager',
  ER_MANAGER = 'ER Manager',
  HR_ADMIN = 'HR Admin',
}

export enum WorkbookStatus {
  IN_PROGRESS = 'In Progress',
  AWAITING_FEEDBACK = 'Awaiting Feedback',
  COMPLETED = 'Completed',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  managerId?: string;
  erManagerId?: string;
  directReportIds?: string[];
  erManagedIds?: string[];
}

export enum ComponentType {
  STATIC_TEXT = 'Static Content Block',
  CHECKLIST = 'Checklist',
  TEXT_INPUT = 'Text Input',
  TABLE_INPUT = 'Table Input',
  LIKERT_SCALE = 'Likert Scale',
  DROPDOWN = 'Dropdown',
  FILE_UPLOAD = 'File Upload',
}

export interface BaseComponent {
  id: string;
  type: ComponentType;
  title: string;
}

export interface StaticTextComponent extends BaseComponent {
  type: ComponentType.STATIC_TEXT;
  content: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
}

export interface ChecklistComponent extends BaseComponent {
  type: ComponentType.CHECKLIST;
  items: ChecklistItem[];
}

export interface TextInputComponent extends BaseComponent {
  type: ComponentType.TEXT_INPUT;
  isLongText: boolean;
  placeholder?: string;
}

export interface TableInputComponent extends BaseComponent {
  type: ComponentType.TABLE_INPUT;
  columns: string[];
}

export interface LikertScaleComponent extends BaseComponent {
  type: ComponentType.LIKERT_SCALE;
  labels: [string, string, string, string, string];
}

export interface DropdownComponent extends BaseComponent {
  type: ComponentType.DROPDOWN;
  options: string[];
}

export interface FileUploadComponent extends BaseComponent {
  type: ComponentType.FILE_UPLOAD;
}

export type TemplateComponent =
  | StaticTextComponent
  | ChecklistComponent
  | TextInputComponent
  | TableInputComponent
  | LikertScaleComponent
  | DropdownComponent
  | FileUploadComponent;

export interface OnboardingWeek {
  weekNumber: number;
  title: string;
  components: TemplateComponent[];
}

export interface OnboardingTemplate {
  id: string;
  name: string;
  description: string;
  durationInWeeks: number;
  weeks: OnboardingWeek[];
}

export interface ComponentAnswer {
  componentId: string;
  value: any; 
}

export interface WeeklyWorkbook {
  id: string;
  userId: string;
  templateId: string;
  weekNumber: number;
  status: WorkbookStatus;
  answers: ComponentAnswer[];
  managerFeedback?: string;
}

export interface EmployeeAssignment {
  userId: string;
  templateId: string | null;
}
