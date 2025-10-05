
import { User, UserRole, OnboardingTemplate, WeeklyWorkbook, WorkbookStatus, ComponentType, OnboardingWeek, TemplateComponent } from './types';

export const USERS: User[] = [
  { id: 'usr_admin_1', name: 'Aditi Sharma', email: 'aditi.sharma@example.com', role: UserRole.HR_ADMIN, designation: 'HR Director' },
  { id: 'usr_er_1', name: 'Rajesh Kumar', email: 'rajesh.kumar@example.com', role: UserRole.ER_MANAGER, designation: 'ER Lead', erManagedIds: ['usr_emp_1', 'usr_emp_2', 'usr_emp_3', 'usr_emp_4'] },
  { id: 'usr_mgr_1', name: 'Priya Patel', email: 'priya.patel@example.com', role: UserRole.MANAGER, designation: 'Sales Manager', directReportIds: ['usr_emp_1', 'usr_emp_2'] },
  { id: 'usr_mgr_2', name: 'Amit Singh', email: 'amit.singh@example.com', role: UserRole.MANAGER, designation: 'Engineering Lead', directReportIds: ['usr_emp_3', 'usr_emp_4'] },
  { id: 'usr_emp_1', name: 'Neha Gupta', email: 'neha.gupta@example.com', role: UserRole.EMPLOYEE, designation: 'Sales Executive', managerId: 'usr_mgr_1', erManagerId: 'usr_er_1' },
  { id: 'usr_emp_2', name: 'Vikram Rao', email: 'vikram.rao@example.com', role: UserRole.EMPLOYEE, designation: 'Sales Associate', managerId: 'usr_mgr_1', erManagerId: 'usr_er_1' },
  { id: 'usr_emp_3', name: 'Sunita Menon', email: 'sunita.menon@example.com', role: UserRole.EMPLOYEE, designation: 'Software Engineer', managerId: 'usr_mgr_2', erManagerId: 'usr_er_1' },
  { id: 'usr_emp_4', name: 'Rohan Joshi', email: 'rohan.joshi@example.com', role: UserRole.EMPLOYEE, designation: 'QA Engineer', managerId: 'usr_mgr_2', erManagerId: 'usr_er_1' },
];

const salesTemplateWeek1: OnboardingWeek = {
  weekNumber: 1,
  title: 'Welcome & Foundations',
  components: [
    { id: 'st1', type: ComponentType.STATIC_TEXT, title: 'Welcome to the Team!', content: 'This week is about setting you up for success. Please complete all the initial HR formalities and get to know your tools.' },
    { id: 'cl1', type: ComponentType.CHECKLIST, title: 'HR & IT Checklist', items: [{ id: 'cli1', label: 'Sign employment contract' }, { id: 'cli2', label: 'Set up company laptop' }, { id: 'cli3', label: 'Access sales CRM' }] },
    { id: 'ti1', type: ComponentType.TEXT_INPUT, title: 'Your 30-Day Goals', isLongText: true, placeholder: 'What do you hope to achieve in your first month?' },
    { id: 'ls1', type: ComponentType.LIKERT_SCALE, title: 'How prepared do you feel for your role?', labels: ['Not at all', 'Slightly', 'Moderately', 'Very', 'Extremely'] },
  ]
};

const salesTemplateWeek2: OnboardingWeek = {
    weekNumber: 2,
    title: 'Product & Process Deep Dive',
    components: [
        { id: 'st2', type: ComponentType.STATIC_TEXT, title: 'Understanding Our Products', content: 'This week, focus on learning our core product offerings and the sales process.' },
        { id: 'tbl1', type: ComponentType.TABLE_INPUT, title: 'Key Product Features Log', columns: ['Product Name', 'Key Feature', 'Customer Benefit'] },
        { id: 'fu1', type: ComponentType.FILE_UPLOAD, title: 'Upload Your Mock Sales Pitch Deck' },
        { id: 'dd1', type: ComponentType.DROPDOWN, title: 'Which product are you most excited about?', options: ['Core Platform', 'Analytics Suite', 'Enterprise API'] },
    ]
}

export const TEMPLATES: OnboardingTemplate[] = [
  {
    id: 'tpl_sales_1',
    name: 'Sales Team Onboarding',
    description: 'A 4-week program for new sales executives.',
    durationInWeeks: 4,
    weeks: [salesTemplateWeek1, salesTemplateWeek2],
  },
  {
    id: 'tpl_eng_1',
    name: 'Engineering Onboarding',
    description: 'A 6-week technical onboarding for software engineers.',
    durationInWeeks: 6,
    weeks: [
      {
        weekNumber: 1,
        title: 'Setup & Environment',
        components: [
          { id: 'eng_st1', type: ComponentType.STATIC_TEXT, title: 'Welcome Engineer!', content: 'Get your development environment ready and complete the coding challenge.' },
          { id: 'eng_cl1', type: ComponentType.CHECKLIST, title: 'Setup Checklist', items: [{ id: 'eng_cli1', label: 'Clone main repository' }, { id: 'eng_cli2', label: 'Install local dependencies' }, { id: 'eng_cli3', label: 'Run unit tests successfully' }] },
          { id: 'eng_fu1', type: ComponentType.FILE_UPLOAD, title: 'Submit Your "Hello World" App Screenshot' },
        ]
      }
    ]
  },
];

export const WORKBOOKS: WeeklyWorkbook[] = [
  // Neha Gupta (Sales) - Week 1 Completed
  {
    id: 'wb_1',
    userId: 'usr_emp_1',
    templateId: 'tpl_sales_1',
    weekNumber: 1,
    status: WorkbookStatus.COMPLETED,
    answers: [
      { componentId: 'cl1', value: [true, true, true] },
      { componentId: 'ti1', value: 'I hope to understand the product inside-out and shadow a senior sales call.' },
      { componentId: 'ls1', value: 4 },
    ],
    managerFeedback: 'Great start, Neha! Let\'s connect on your 30-day goals next week.'
  },
  // Neha Gupta (Sales) - Week 2 In Progress
  {
    id: 'wb_2',
    userId: 'usr_emp_1',
    templateId: 'tpl_sales_1',
    weekNumber: 2,
    status: WorkbookStatus.IN_PROGRESS,
    answers: [],
  },
  // Vikram Rao (Sales) - Week 1 Awaiting Feedback
  {
    id: 'wb_3',
    userId: 'usr_emp_2',
    templateId: 'tpl_sales_1',
    weekNumber: 1,
    status: WorkbookStatus.AWAITING_FEEDBACK,
    answers: [
      { componentId: 'cl1', value: [true, true, false] },
      { componentId: 'ti1', value: 'My goal is to complete all training modules and build a good rapport with the team.' },
      { componentId: 'ls1', value: 3 },
    ],
  },
  // Sunita Menon (Eng) - Week 1 In Progress
  {
    id: 'wb_4',
    userId: 'usr_emp_3',
    templateId: 'tpl_eng_1',
    weekNumber: 1,
    status: WorkbookStatus.IN_PROGRESS,
    answers: [],
  }
];
