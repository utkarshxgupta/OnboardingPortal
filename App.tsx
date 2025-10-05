import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { USERS, TEMPLATES, WORKBOOKS } from './data';
import { User, UserRole, OnboardingTemplate, WeeklyWorkbook, WorkbookStatus, ComponentType, TemplateComponent, OnboardingWeek, ChecklistItem } from './types';
import { BuildingIcon, CheckCircleIcon, HourglassIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloudIcon, ChevronDownIcon, EyeIcon, TextFieldsIcon, SubjectIcon, ChecklistIcon, TableChartIcon, LinearScaleIcon, ArrowDropDownCircleIcon, MenuIcon } from './components/Icons';

// --- HELPER COMPONENTS (Themed) ---

const AppHeader: React.FC<{ user: User | null; onLogout: () => void; onBack: () => void; showBack: boolean }> = ({ user, onLogout, onBack, showBack }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-surface/80 backdrop-blur-lg border-b border-outlineVariant sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        {showBack && (
                            <button onClick={onBack} className="mr-2 md:mr-4 text-secondary hover:text-primary transition-colors p-2 rounded-full hover:bg-secondary/10">
                                <span className="material-symbols-rounded align-middle">arrow_back</span>
                            </button>
                        )}
                        <BuildingIcon className="h-8 w-8 text-secondary" />
                        <span className="ml-3 text-lg md:text-xl font-bold text-onSurface">Onboarding Portal</span>
                    </div>
                    {user && (
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={() => setIsDropdownOpen(prev => !prev)} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-black/5 transition-colors">
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-onSurface">{user.name}</p>
                                    <p className="text-xs text-onSurfaceVariant hidden sm:block">{user.role}</p>
                                </div>
                                <ChevronDownIcon className={`h-5 w-5 text-onSurfaceVariant transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-surface/80 backdrop-blur-xl border border-white/20 rounded-lg shadow-e4 origin-top-right animate-in fade-in-0 zoom-in-95">
                                    <div className="p-1">
                                        <button
                                            onClick={() => { onLogout(); setIsDropdownOpen(false); }}
                                            className="w-full text-left flex items-center px-3 py-2 text-sm text-onSurface rounded-md hover:bg-secondary/10 hover:text-secondary transition-colors"
                                        >
                                           <span className="material-symbols-rounded mr-2 text-base">logout</span>
                                           Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
    <button
        {...props}
        className={`inline-flex items-center justify-center px-4 py-2 md:px-6 md:py-2.5 text-sm font-semibold text-onPrimary bg-primary rounded-lg shadow-e1 hover:shadow-e2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:bg-disabled disabled:text-onDisabled disabled:shadow-none ${props.className}`}
    >
        {children}
    </button>
);

const SecondaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
    <button
        {...props}
        className={`inline-flex items-center justify-center px-4 py-2 md:px-6 md:py-2.5 text-sm font-semibold text-onSecondary bg-secondary rounded-lg shadow-e1 hover:shadow-e2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-disabled disabled:text-onDisabled disabled:shadow-none ${props.className}`}
    >
        {children}
    </button>
);

const OutlineButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
    <button
        {...props}
        className={`inline-flex items-center justify-center px-4 py-2 md:px-6 md:py-2.5 text-sm font-semibold text-secondary bg-transparent border border-outline rounded-lg shadow-sm hover:bg-secondary/10 hover:shadow-e1 transition-all duration-200 disabled:bg-transparent disabled:text-onDisabled disabled:border-outlineVariant disabled:shadow-none ${props.className}`}
    >
        {children}
    </button>
);

const StatusBadge: React.FC<{ status: WorkbookStatus }> = ({ status }) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-pill inline-flex items-center";
    const statusMap = {
        [WorkbookStatus.IN_PROGRESS]: { icon: <PencilIcon className="h-4 w-4 mr-1.5" />, text: 'In Progress', classes: "bg-yellow-100 text-yellow-800 border border-yellow-200" },
        [WorkbookStatus.AWAITING_FEEDBACK]: { icon: <HourglassIcon className="h-4 w-4 mr-1.5" />, text: 'Awaiting Feedback', classes: "bg-blue-100 text-blue-800 border border-blue-200" },
        [WorkbookStatus.COMPLETED]: { icon: <CheckCircleIcon className="h-4 w-4 mr-1.5" />, text: 'Completed', classes: "bg-green-100 text-green-800 border border-green-200" },
    };
    const { icon, text, classes } = statusMap[status];
    return <span className={`${baseClasses} ${classes}`}>{icon}{text}</span>;
};

const SwitchToggle: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void; }> = ({ enabled, onChange }) => (
    <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`${enabled ? 'bg-secondary' : 'bg-outline'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
        role="switch"
        aria-checked={enabled}
    >
        <span
            aria-hidden="true"
            className={`${enabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
    </button>
);


// --- VIEW COMPONENTS (Themed) ---

const LoginView: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] p-4">
        <div className="w-full max-w-md p-6 md:p-8 space-y-8 bg-surface/70 backdrop-blur-xl rounded-xl shadow-e4 border border-white/20">
            <div>
                <h2 className="text-center text-2xl md:text-3xl font-bold text-onSurface">Select Your Role</h2>
                <p className="mt-2 text-center text-sm text-onSurfaceVariant">Choose a user to log in and view the portal.</p>
            </div>
            <div className="space-y-4">
                {USERS.map(user => (
                    <button
                        key={user.id}
                        onClick={() => onLogin(user)}
                        className="w-full flex items-center p-4 text-left bg-surface border border-outlineVariant rounded-lg shadow-e1 hover:border-secondary hover:shadow-e2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primaryContainer flex items-center justify-center text-onPrimaryContainer font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                            <p className="text-md font-semibold text-onSurface">{user.name}</p>
                            <p className="text-sm text-onSurfaceVariant">{user.role} - {user.designation}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    </div>
);


const Dashboard: React.FC<{
    currentUser: User;
    users: User[];
    workbooks: WeeklyWorkbook[];
    templates: OnboardingTemplate[];
    onSelectWorkbook: (id: string) => void;
    onSelectTemplate: (id: string) => void;
    onCreateTemplate: () => void;
    onDeleteTemplate: (id: string) => void;
}> = ({ currentUser, users, workbooks, templates, onSelectWorkbook, onSelectTemplate, onCreateTemplate, onDeleteTemplate }) => {
    switch (currentUser.role) {
        case UserRole.EMPLOYEE:
            const myWorkbooks = workbooks.filter(wb => wb.userId === currentUser.id).sort((a,b) => a.weekNumber - b.weekNumber);
            return (
                <div>
                    <h1 className="text-3xl md:text-headline font-bold text-onBackground">My Onboarding Journey</h1>
                    <div className="mt-6 grid gap-4 md:gap-6">
                        {myWorkbooks.map(wb => {
                            const template = templates.find(t => t.id === wb.templateId);
                            const week = template?.weeks.find(w => w.weekNumber === wb.weekNumber);
                            return (
                                <div key={wb.id} onClick={() => onSelectWorkbook(wb.id)} className="bg-surface p-4 md:p-6 rounded-lg shadow-e2 hover:shadow-e3 transition-shadow cursor-pointer border border-outlineVariant/50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-lg md:text-title font-semibold text-secondary">Week {wb.weekNumber}: {week?.title}</h2>
                                            <p className="text-sm text-onSurfaceVariant mt-1">{template?.name}</p>
                                        </div>
                                        <div className="flex-shrink-0 ml-2">
                                            <StatusBadge status={wb.status} />
                                        </div>
                                    </div>
                                    {wb.status === WorkbookStatus.COMPLETED && wb.managerFeedback && (
                                         <div className="mt-4 p-4 bg-surface/80 border border-success/30 rounded-xl shadow-e1 flex items-start space-x-3">
                                            <CheckCircleIcon className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-semibold text-onSurface">Manager Feedback:</p>
                                                <p className="text-sm text-onSurface/80 italic mt-1">"{wb.managerFeedback}"</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        case UserRole.MANAGER:
        case UserRole.ER_MANAGER:
            const managedUserIds = currentUser.role === UserRole.MANAGER ? currentUser.directReportIds : currentUser.erManagedIds;
            const managedWorkbooks = workbooks.filter(wb => managedUserIds?.includes(wb.userId));
            const columns: WorkbookStatus[] = [WorkbookStatus.AWAITING_FEEDBACK, WorkbookStatus.IN_PROGRESS, WorkbookStatus.COMPLETED];
            
            return (
                 <div>
                    <h1 className="text-3xl md:text-headline font-bold text-onBackground">{currentUser.role === UserRole.MANAGER ? "My Team's Progress" : "Portfolio Progress"}</h1>
                    {/* Mobile: Horizontal Scroll */}
                    <div className="md:hidden mt-4">
                        <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide -mx-4 px-4">
                             {columns.map(status => (
                                <div key={status} className="flex-shrink-0 w-4/5 bg-surfaceVariant/50 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                                    <h2 className="font-bold text-onSurfaceVariant mb-3 text-center text-sm">{status}</h2>
                                    <div className="space-y-3 min-h-[100px]">
                                        {managedWorkbooks.filter(wb => wb.status === status).map(wb => {
                                            const user = users.find(u => u.id === wb.userId);
                                            const template = templates.find(t => t.id === wb.templateId);
                                            return (
                                                <div key={wb.id} onClick={() => onSelectWorkbook(wb.id)} className="bg-surface p-3 rounded-md shadow-e1 hover:shadow-e2 transition-shadow cursor-pointer border border-outlineVariant/30">
                                                    <p className="font-semibold text-onSurface text-sm">{user?.name}</p>
                                                    <p className="text-xs text-onSurfaceVariant">Week {wb.weekNumber} - {template?.name}</p>
                                                </div>
                                            )
                                        })}
                                        {managedWorkbooks.filter(wb => wb.status === status).length === 0 && (
                                            <div className="text-center text-xs text-onSurfaceVariant p-3 bg-surface/30 rounded-md">No workbooks.</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Desktop: Grid */}
                    <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 items-start mt-6">
                        {columns.map(status => (
                            <div key={status} className="bg-surfaceVariant/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                                <h2 className="font-bold text-onSurfaceVariant mb-4 text-center">{status}</h2>
                                <div className="space-y-4 min-h-[100px]">
                                    {managedWorkbooks.filter(wb => wb.status === status).map(wb => {
                                         const user = users.find(u => u.id === wb.userId);
                                         const template = templates.find(t => t.id === wb.templateId);
                                         return (
                                             <div key={wb.id} onClick={() => onSelectWorkbook(wb.id)} className="bg-surface p-4 rounded-md shadow-e1 hover:shadow-e2 transition-shadow cursor-pointer border border-outlineVariant/30">
                                                 <p className="font-semibold text-onSurface">{user?.name}</p>
                                                 <p className="text-sm text-onSurfaceVariant">Week {wb.weekNumber} - {template?.name}</p>
                                             </div>
                                         )
                                    })}
                                    {managedWorkbooks.filter(wb => wb.status === status).length === 0 && (
                                        <div className="text-center text-sm text-onSurfaceVariant p-4 bg-surface/30 rounded-md">No workbooks in this stage.</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        case UserRole.HR_ADMIN:
            return (
                <div>
                     <div className="flex justify-between items-center">
                        <h1 className="text-2xl md:text-headline font-bold text-onBackground">Onboarding Templates</h1>
                        <PrimaryButton onClick={onCreateTemplate}><PlusIcon className="h-5 w-5 mr-1 md:mr-2 inline-block"/><span className="hidden sm:inline">Create New</span></PrimaryButton>
                    </div>
                    {/* Desktop Table */}
                     <div className="mt-6 hidden md:block bg-surface rounded-xl shadow-e2 overflow-hidden border border-outlineVariant/50">
                        <table className="min-w-full divide-y divide-outlineVariant">
                            <thead className="bg-surfaceVariant/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-onSurfaceVariant uppercase tracking-wider">Template Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-onSurfaceVariant uppercase tracking-wider">Description</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-onSurfaceVariant uppercase tracking-wider">Duration</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                             <tbody className="bg-surface divide-y divide-outlineVariant">
                                {templates.map(template => (
                                    <tr key={template.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-onSurface">{template.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-onSurfaceVariant">{template.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-onSurfaceVariant">{template.durationInWeeks} weeks</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button onClick={() => onSelectTemplate(template.id)} className="text-secondary hover:text-primary p-2 rounded-full hover:bg-secondaryContainer"><PencilIcon className="h-5 w-5"/></button>
                                            <button onClick={() => onDeleteTemplate(template.id)} className="text-brandRed hover:text-red-700 p-2 rounded-full hover:bg-red-100"><TrashIcon className="h-5 w-5"/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Mobile Card List */}
                    <div className="md:hidden mt-4 space-y-4">
                        {templates.map(template => (
                             <div key={template.id} className="bg-surface rounded-lg shadow-e2 border border-outlineVariant/50 p-4">
                                <div>
                                    <h3 className="font-bold text-onSurface">{template.name}</h3>
                                    <p className="text-sm text-onSurfaceVariant mt-1">{template.description}</p>
                                    <p className="text-xs text-onSurfaceVariant mt-2">{template.durationInWeeks} weeks</p>
                                </div>
                                <div className="mt-3 pt-3 border-t border-outlineVariant flex justify-end space-x-2">
                                     <button onClick={() => onSelectTemplate(template.id)} className="text-secondary hover:text-primary p-2 rounded-full hover:bg-secondaryContainer"><PencilIcon className="h-5 w-5"/></button>
                                     <button onClick={() => onDeleteTemplate(template.id)} className="text-brandRed hover:text-red-700 p-2 rounded-full hover:bg-red-100"><TrashIcon className="h-5 w-5"/></button>
                                </div>
                             </div>
                        ))}
                    </div>
                </div>
            );
        default:
            return null;
    }
};

const WorkbookComponentRenderer: React.FC<{
    component: TemplateComponent;
    answer: any;
    isReadOnly: boolean;
    onAnswerChange: (componentId: string, value: any) => void;
}> = ({ component, answer, isReadOnly, onAnswerChange }) => {
    
    const readOnlyClasses = "bg-outlineVariant/20 text-onSurfaceVariant cursor-not-allowed";
    const editableClasses = "bg-surface text-onSurface focus:ring-secondary focus:border-secondary";
    const baseInputClasses = "w-full p-3 border border-outline rounded-md transition duration-200 placeholder:text-onSurfaceVariant/70";

    switch (component.type) {
        case ComponentType.STATIC_TEXT:
            return <div className="prose prose-sm max-w-none text-onSurface" dangerouslySetInnerHTML={{ __html: component.content.replace(/\n/g, '<br />') }} />;
        case ComponentType.CHECKLIST:
            return <div className="space-y-3">
                {(component.items).map((item, index) => {
                    const isChecked = answer?.[index] ?? false;
                    return (
                        <label key={item.id} className={`flex items-center space-x-4 p-3 rounded-lg transition-colors border ${isReadOnly ? 'cursor-default' : 'cursor-pointer hover:bg-secondary/5'} ${isChecked ? 'bg-secondary/10 border-secondary/30' : 'border-transparent'}`}>
                            <input
                                type="checkbox"
                                className="sr-only"
                                disabled={isReadOnly}
                                checked={isChecked}
                                onChange={e => {
                                    const newValues = [...(answer || Array(component.items.length).fill(false))];
                                    newValues[index] = e.target.checked;
                                    onAnswerChange(component.id, newValues);
                                }}
                            />
                            <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${isChecked ? 'bg-secondary border-secondary' : 'bg-transparent border-outline'}`}>
                                {isChecked && <span className="material-symbols-rounded text-onSecondary text-[16px]">check</span>}
                            </div>
                            <span className={`text-onSurface ${isReadOnly && !isChecked ? 'text-onSurfaceVariant' : ''} ${isChecked ? 'line-through text-onSurfaceVariant' : ''}`}>{item.label}</span>
                        </label>
                    );
                })}
            </div>;
        case ComponentType.TEXT_INPUT:
            return component.isLongText ? (
                <textarea 
                    className={`${baseInputClasses} ${isReadOnly ? readOnlyClasses : editableClasses}`}
                    rows={5} 
                    placeholder={component.placeholder} 
                    readOnly={isReadOnly}
                    value={answer ?? ''}
                    onChange={e => onAnswerChange(component.id, e.target.value)}
                />
            ) : (
                <input 
                    type="text" 
                    className={`${baseInputClasses} ${isReadOnly ? readOnlyClasses : editableClasses}`}
                    placeholder={component.placeholder} 
                    readOnly={isReadOnly}
                    value={answer ?? ''}
                    onChange={e => onAnswerChange(component.id, e.target.value)}
                />
            );
        case ComponentType.FILE_UPLOAD:
            return (
                 <div className={`mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-outline border-dashed rounded-lg ${isReadOnly ? 'bg-outlineVariant/20' : 'hover:border-secondary'}`}>
                    <div className="space-y-1 text-center">
                        <UploadCloudIcon className="mx-auto h-12 w-12 text-onSurfaceVariant" />
                        <div className="flex text-sm text-onSurfaceVariant">
                            <label htmlFor="file-upload" className={`relative cursor-pointer bg-transparent rounded-md font-medium text-secondary hover:text-primary focus-within:outline-none ${isReadOnly ? 'cursor-not-allowed text-onDisabled hover:text-onDisabled' : ''}`}>
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" disabled={isReadOnly} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-onSurfaceVariant">PNG, JPG, PDF up to 10MB</p>
                    </div>
                </div>
            )
        case ComponentType.TABLE_INPUT:
             const tableRows = answer || [{}];
             return (
                <div className="overflow-x-auto border border-outlineVariant rounded-lg">
                     <table className="min-w-full">
                        <thead className="bg-surfaceVariant/50">
                            <tr>
                                {component.columns.map(col => <th key={col} className="px-4 py-3 text-left text-xs font-bold text-onSurfaceVariant uppercase">{col}</th>)}
                                {!isReadOnly && <th className="w-12"></th>}
                            </tr>
                        </thead>
                         <tbody className="bg-surface divide-y divide-outlineVariant">
                            {tableRows.map((row: any, rowIndex: number) => (
                                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-surface' : 'bg-surfaceVariant/20'}>
                                    {component.columns.map(col => (
                                        <td key={col} className="p-1 align-top">
                                            <input type="text" readOnly={isReadOnly} value={row[col] || ''} onChange={e => {
                                                const newRows = [...tableRows];
                                                newRows[rowIndex] = {...newRows[rowIndex], [col]: e.target.value};
                                                onAnswerChange(component.id, newRows);
                                            }} className={`w-full p-2 border-transparent focus:border-secondary focus:ring-0 rounded-sm ${isReadOnly ? 'bg-transparent text-onSurfaceVariant cursor-not-allowed' : 'bg-transparent text-onSurface focus:bg-white'}`} />
                                        </td>
                                    ))}
                                    {!isReadOnly && (
                                        <td className="text-center p-1 align-top">
                                            <button onClick={() => {
                                                const newRows = tableRows.filter((_: any, i: number) => i !== rowIndex);
                                                onAnswerChange(component.id, newRows.length > 0 ? newRows : [{}]);
                                            }} className="text-outline hover:text-brandRed p-1 mt-1.5"><TrashIcon className="h-4 w-4"/></button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!isReadOnly && (
                        <div className="p-2 bg-surfaceVariant/30">
                            <button onClick={() => onAnswerChange(component.id, [...tableRows, {}])} className="text-sm text-secondary font-semibold hover:text-primary flex items-center p-2">
                                <PlusIcon className="h-4 w-4 mr-1"/>Add Row
                            </button>
                        </div>
                    )}
                </div>
             )
        case ComponentType.LIKERT_SCALE: {
            const sliderRef = useRef<HTMLInputElement>(null);
            const value = answer || 3; // Default to neutral if no answer

            useEffect(() => {
                if (sliderRef.current) {
                    const min = 1;
                    const max = 5;
                    const percent = ((value - min) / (max - min)) * 100;
                    sliderRef.current.style.setProperty('--fill-percent', `${percent}%`);
                }
            }, [value]);

            return (
                <div className="w-full pt-2">
                    <input
                        ref={sliderRef}
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={value}
                        disabled={isReadOnly}
                        onChange={(e) => onAnswerChange(component.id, parseInt(e.target.value, 10))}
                        className={`likert-slider ${isReadOnly ? 'cursor-not-allowed' : ''}`}
                    />
                    <div className="flex justify-between mt-2">
                        {component.labels.map((label, index) => (
                            <label
                                key={index}
                                className={`text-xs text-center flex-1 px-1 transition-all duration-200 ${
                                    isReadOnly ? 'text-onDisabled' : 'text-onSurfaceVariant'
                                } ${
                                    value === index + 1 ? 'font-bold text-secondary scale-105' : ''
                                }`}
                            >
                                {label}
                            </label>
                        ))}
                    </div>
                </div>
            );
        }
         case ComponentType.DROPDOWN:
             return (
                 <div className="relative">
                    <select
                        value={answer || ''}
                        onChange={e => onAnswerChange(component.id, e.target.value)}
                        disabled={isReadOnly}
                        className={`${baseInputClasses} appearance-none pr-8 ${isReadOnly ? readOnlyClasses : editableClasses}`}
                    >
                        <option value="" disabled>Select an option...</option>
                        {component.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                     <ChevronDownIcon className="h-5 w-5 text-outline absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none"/>
                 </div>
             )
        default:
            {
                const _: never = component;
                return <div className="p-4 bg-gray-100 rounded text-sm text-gray-500">Component type not implemented.</div>;
            }
    }
};

const WorkbookView: React.FC<{
    workbook: WeeklyWorkbook,
    template: OnboardingTemplate,
    currentUser: User,
    onUpdate: (workbook: WeeklyWorkbook) => void
}> = ({ workbook, template, currentUser, onUpdate }) => {
    const [answers, setAnswers] = useState(workbook.answers);
    const [feedback, setFeedback] = useState('');
    const week = template.weeks.find(w => w.weekNumber === workbook.weekNumber);
    const isEmployee = currentUser.role === UserRole.EMPLOYEE;
    const isManager = currentUser.role === UserRole.MANAGER;
    const isReadOnly = workbook.status !== WorkbookStatus.IN_PROGRESS || !isEmployee;

    const handleAnswerChange = (componentId: string, value: any) => {
        setAnswers(prev => {
            const existing = prev.find(a => a.componentId === componentId);
            if (existing) {
                return prev.map(a => a.componentId === componentId ? { ...a, value } : a);
            }
            return [...prev, { componentId, value }];
        });
    };
    
    const handleSubmitForReview = () => {
        onUpdate({ ...workbook, status: WorkbookStatus.AWAITING_FEEDBACK, answers });
    };

    const handleSubmitFeedback = () => {
        onUpdate({ ...workbook, status: WorkbookStatus.COMPLETED, managerFeedback: feedback });
    };

    if (!week) return <div>Week not found.</div>;
    
    return (
        <div>
            <div className="p-4 md:p-8 rounded-t-xl" style={{background: 'linear-gradient(135deg, #FFE7C2 0%, #CBE9F1 100%)'}}>
                <h1 className="text-2xl md:text-headline font-bold text-onBackground">Week {week.weekNumber}: {week.title}</h1>
                <p className="mt-1 text-onSurfaceVariant">{template.name}</p>
                 <div className="mt-4"><StatusBadge status={workbook.status} /></div>
            </div>
            <div className="p-4 md:p-8 bg-surface/80 backdrop-blur-lg rounded-b-xl border border-t-0 border-outlineVariant/30 shadow-e3">
                <div className="space-y-6">
                    {week.components.map(comp => (
                        <div key={comp.id} className="bg-surface rounded-lg shadow-e1 border border-outlineVariant/30 p-4 md:p-6">
                            <h3 className="text-md md:text-lg font-semibold text-onSurface mb-4">{comp.title}</h3>
                            <WorkbookComponentRenderer 
                                component={comp}
                                answer={answers.find(a => a.componentId === comp.id)?.value}
                                isReadOnly={isReadOnly}
                                onAnswerChange={handleAnswerChange}
                            />
                        </div>
                    ))}

                    {isManager && workbook.status === WorkbookStatus.AWAITING_FEEDBACK && (
                         <div className="bg-surface rounded-lg shadow-e1 border border-outlineVariant/30 p-4 md:p-6">
                            <h3 className="text-md md:text-lg font-semibold text-onSurface mb-3">Your Feedback</h3>
                            <textarea 
                                className="w-full p-3 border border-outline rounded-md focus:ring-secondary focus:border-secondary transition" 
                                rows={5} 
                                placeholder="Provide constructive feedback for your new hire..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                            />
                        </div>
                    )}

                    {workbook.status === WorkbookStatus.COMPLETED && workbook.managerFeedback && (
                        <div className="p-4 bg-surface/80 border border-success/30 rounded-xl shadow-e1 flex items-start space-x-3">
                            <CheckCircleIcon className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-onSurface">Manager Feedback:</p>
                                <p className="text-sm text-onSurface/80 italic mt-1">"{workbook.managerFeedback}"</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-6 border-t border-outlineVariant flex justify-end space-x-2 md:space-x-4">
                    {isEmployee && workbook.status === WorkbookStatus.IN_PROGRESS && (
                        <>
                            <OutlineButton>Save Draft</OutlineButton>
                            <SecondaryButton onClick={handleSubmitForReview}>Submit</SecondaryButton>
                        </>
                    )}
                    {isManager && workbook.status === WorkbookStatus.AWAITING_FEEDBACK && (
                        <SecondaryButton onClick={handleSubmitFeedback} disabled={!feedback}>Submit Feedback</SecondaryButton>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- TEMPLATE EDITOR COMPONENTS (Themed) ---

const ComponentEditor: React.FC<{ component: TemplateComponent, onUpdate: (id: string, comp: TemplateComponent) => void }> = ({ component, onUpdate }) => {
    const inputClasses = "w-full p-2 border border-outline rounded-md focus:ring-1 focus:ring-secondary focus:border-secondary bg-surface text-onSurface placeholder:text-onSurfaceVariant/70";
    const draggedCol = useRef<number | null>(null);
    const draggedOverCol = useRef<number | null>(null);

    switch (component.type) {
        case ComponentType.STATIC_TEXT:
            return <textarea value={component.content} onChange={e => onUpdate(component.id, { ...component, content: e.target.value })} className={inputClasses} rows={4} placeholder="Enter static content..."/>;
        case ComponentType.CHECKLIST:
            return <div className="space-y-2">
                {component.items.map((item, index) => (
                    <div key={item.id} className="flex items-center space-x-2">
                        <input type="text" value={item.label} onChange={e => {
                            const newItems = [...component.items];
                            newItems[index] = {...newItems[index], label: e.target.value};
                            onUpdate(component.id, { ...component, items: newItems });
                        }} className={`flex-grow ${inputClasses}`}/>
                        <button onClick={() => onUpdate(component.id, { ...component, items: component.items.filter(i => i.id !== item.id)})} className="text-outline hover:text-brandRed p-1 rounded-full hover:bg-red-100"><TrashIcon className="h-4 w-4"/></button>
                    </div>
                ))}
                <button onClick={() => onUpdate(component.id, { ...component, items: [...component.items, {id: `item_${Date.now()}`, label: 'New item'}]})} className="text-sm text-secondary font-semibold hover:text-primary flex items-center"><PlusIcon className="h-4 w-4 mr-1"/>Add Item</button>
            </div>;
        case ComponentType.TEXT_INPUT:
            return <div className="space-y-3">
                 <input type="text" value={component.placeholder} onChange={e => onUpdate(component.id, { ...component, placeholder: e.target.value })} className={inputClasses} placeholder="Placeholder text"/>
                 <div className="flex items-center justify-between py-1">
                    <label className="text-sm font-medium text-onSurfaceVariant">Use long text (textarea)</label>
                    <SwitchToggle 
                        enabled={component.isLongText} 
                        onChange={isEnabled => onUpdate(component.id, { ...component, isLongText: isEnabled })}
                    />
                </div>
            </div>;
        case ComponentType.DROPDOWN:
             return <div className="space-y-2">
                <textarea 
                    value={component.options.join('\n')}
                    onChange={e => onUpdate(component.id, { ...component, options: e.target.value.split('\n') })}
                    className={inputClasses}
                    rows={4}
                    placeholder="Enter one option per line..."
                />
            </div>;
        case ComponentType.TABLE_INPUT:
            const handleColumnSort = () => {
                if (draggedCol.current === null || draggedOverCol.current === null) return;
                const newColumns = [...component.columns];
                const draggedItemContent = newColumns.splice(draggedCol.current, 1)[0];
                newColumns.splice(draggedOverCol.current, 0, draggedItemContent);
                draggedCol.current = null;
                draggedOverCol.current = null;
                onUpdate(component.id, { ...component, columns: newColumns });
            };

            return <div className="space-y-2">
                {component.columns.map((col, index) => (
                    <div 
                        key={index} 
                        className="flex items-center space-x-2 group p-1"
                        draggable
                        onDragStart={(e) => { e.stopPropagation(); draggedCol.current = index; }}
                        onDragEnter={() => (draggedOverCol.current = index)}
                        onDragEnd={handleColumnSort}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <span className="material-symbols-rounded text-outline cursor-grab group-hover:text-onSurfaceVariant" title="Drag to reorder">drag_indicator</span>
                        <input
                            type="text"
                            value={col}
                            placeholder={`Column ${index + 1}`}
                            onChange={e => {
                                const newColumns = [...component.columns];
                                newColumns[index] = e.target.value;
                                onUpdate(component.id, { ...component, columns: newColumns });
                            }}
                            className={`flex-grow ${inputClasses}`}
                        />
                         <button onClick={() => onUpdate(component.id, { ...component, columns: component.columns.filter((_, i) => i !== index)})} className="text-outline hover:text-brandRed p-1 rounded-full hover:bg-red-100"><TrashIcon className="h-4 w-4"/></button>
                    </div>
                ))}
                <button onClick={() => onUpdate(component.id, { ...component, columns: [...component.columns, `Column ${component.columns.length + 1}`]})} className="text-sm text-secondary font-semibold hover:text-primary flex items-center"><PlusIcon className="h-4 w-4 mr-1"/>Add Column</button>
            </div>;
        case ComponentType.LIKERT_SCALE:
             return <div className="space-y-2">
                <p className="text-sm text-onSurfaceVariant mb-2">Define the 5 scale point labels:</p>
                {component.labels.map((label, index) => (
                    <div key={index} className="flex items-center">
                        <span className="text-sm text-onSurfaceVariant w-8 text-center">{index + 1}</span>
                        <input 
                            type="text"
                            value={label}
                            onChange={e => {
                                const newLabels = [...component.labels];
                                newLabels[index] = e.target.value;
                                onUpdate(component.id, { ...component, labels: newLabels as [string, string, string, string, string] });
                            }}
                            className={inputClasses}
                            placeholder={`Label for point ${index + 1}`}
                        />
                    </div>
                ))}
            </div>;
        default:
            return <p className="text-sm text-onSurfaceVariant italic">No additional configuration for this component.</p>;
    }
};

const TemplatePreviewModal: React.FC<{
    template: OnboardingTemplate;
    week: OnboardingWeek;
    onClose: () => void;
}> = ({ template, week, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-surface/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-e5 max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-outlineVariant flex justify-between items-center bg-surface/50">
                    <h3 className="text-lg md:text-xl font-bold text-onSurface">Template Preview</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10">
                        <span className="material-symbols-rounded">close</span>
                    </button>
                </div>
                <div className="overflow-y-auto">
                    <div className="p-4 md:p-8" style={{background: 'linear-gradient(135deg, #FFE7C2 0%, #CBE9F1 100%)'}}>
                        <h1 className="text-2xl md:text-headline font-bold text-onBackground">Week {week.weekNumber}: {week.title}</h1>
                        <p className="mt-1 text-onSurfaceVariant">{template.name}</p>
                    </div>
                    <div className="p-4 md:p-8 bg-surface space-y-6">
                        {week.components.map(comp => (
                           <div key={comp.id} className="bg-surface rounded-lg shadow-e1 border border-outlineVariant/30 p-4 md:p-6">
                                <h3 className="text-md md:text-lg font-semibold text-onSurface mb-4">{comp.title}</h3>
                                <WorkbookComponentRenderer 
                                    component={comp}
                                    answer={null}
                                    isReadOnly={true}
                                    onAnswerChange={() => {}}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const TemplateEditorView: React.FC<{ template: OnboardingTemplate, onUpdate: (template: OnboardingTemplate) => void }> = ({ template, onUpdate }) => {
    const [editableTemplate, setEditableTemplate] = useState<OnboardingTemplate>(JSON.parse(JSON.stringify(template)));
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const draggedItem = useRef<number | null>(null);
    const draggedOverItem = useRef<number | null>(null);
    const [dropPlaceholderIndex, setDropPlaceholderIndex] = useState<number | null>(null);

    const updateTemplateField = <K extends keyof OnboardingTemplate>(field: K, value: OnboardingTemplate[K]) => {
        setEditableTemplate((prev) => ({ ...prev, [field]: value }));
    };

    const updateWeekField = <K extends keyof OnboardingWeek>(weekNumber: number, field: K, value: OnboardingWeek[K]) => {
        setEditableTemplate((prev) => ({
            ...prev,
            weeks: prev.weeks.map(w => w.weekNumber === weekNumber ? { ...w, [field]: value } : w)
        }));
    };
    
    const addWeek = () => {
        setEditableTemplate((prev) => {
            const newWeekNumber = prev.weeks.length + 1;
            const newWeek: OnboardingWeek = { weekNumber: newWeekNumber, title: `Week ${newWeekNumber}`, components: [] };
            const updatedTemplate = { ...prev, weeks: [...prev.weeks, newWeek], durationInWeeks: newWeekNumber };
            setSelectedWeek(newWeekNumber);
            return updatedTemplate;
        });
    };
    
    const updateComponent = (componentId: string, updatedComponent: TemplateComponent) => {
        const week = editableTemplate.weeks.find(w => w.weekNumber === selectedWeek);
        if (!week) return;
        const updatedComponents = week.components.map(c => c.id === componentId ? updatedComponent : c);
        updateWeekField(selectedWeek, 'components', updatedComponents);
    };

    const addComponent = (type: ComponentType) => {
        const week = editableTemplate.weeks.find(w => w.weekNumber === selectedWeek);
        if (!week) return;

        let newComponent: TemplateComponent;
        const id = `comp_${Date.now()}`;
        const title = `New ${type}`;

        switch (type) {
            case ComponentType.STATIC_TEXT:
                newComponent = { id, title, type, content: 'This is some instructional text for the new hire.' }; break;
            case ComponentType.CHECKLIST:
                newComponent = { id, title, type, items: [{id: `item_${Date.now()}`, label: 'First item'}] }; break;
            case ComponentType.TEXT_INPUT:
                newComponent = { id, title, type, isLongText: false, placeholder: 'Enter a short answer' }; break;
            case ComponentType.TABLE_INPUT:
                newComponent = { id, title, type, columns: ['Column 1', 'Column 2', 'Column 3'] }; break;
            case ComponentType.LIKERT_SCALE:
                newComponent = { id, title, type, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] }; break;
            case ComponentType.DROPDOWN:
                newComponent = { id, title, type, options: ['Option A', 'Option B'] }; break;
            case ComponentType.FILE_UPLOAD:
                newComponent = { id, title, type }; break;
            default:
                const _exhaustiveCheck: never = type; return _exhaustiveCheck;
        }
        updateWeekField(selectedWeek, 'components', [...week.components, newComponent]);
    };
    
    const removeComponent = (componentId: string) => {
        const week = editableTemplate.weeks.find(w => w.weekNumber === selectedWeek);
        if (!week) return;
        updateWeekField(selectedWeek, 'components', week.components.filter(c => c.id !== componentId));
    };

    const handleSort = () => {
        if (draggedItem.current === null || draggedOverItem.current === null) return;
        const week = editableTemplate.weeks.find(w => w.weekNumber === selectedWeek);
        if (!week) return;
        
        let components = [...week.components];
        const draggedItemContent = components.splice(draggedItem.current, 1)[0];
        components.splice(draggedOverItem.current, 0, draggedItemContent);
        
        draggedItem.current = null;
        draggedOverItem.current = null;
        setDropPlaceholderIndex(null);
        updateWeekField(selectedWeek, 'components', components);
    };

    const currentWeekData = editableTemplate.weeks.find(w => w.weekNumber === selectedWeek);
    const componentTypes = Object.values(ComponentType);

    const componentIconMap: Record<ComponentType, React.ReactNode> = {
        [ComponentType.STATIC_TEXT]: <SubjectIcon className="text-2xl" />,
        [ComponentType.CHECKLIST]: <ChecklistIcon className="text-2xl" />,
        [ComponentType.TEXT_INPUT]: <TextFieldsIcon className="text-2xl" />,
        [ComponentType.TABLE_INPUT]: <TableChartIcon className="text-2xl" />,
        [ComponentType.LIKERT_SCALE]: <LinearScaleIcon className="text-2xl" />,
        [ComponentType.DROPDOWN]: <ArrowDropDownCircleIcon className="text-2xl" />,
        [ComponentType.FILE_UPLOAD]: <UploadCloudIcon className="h-6 w-6" />,
    };

    return (
        <div className="bg-surface rounded-xl shadow-e3 border border-outlineVariant/30 relative">
            <div className="p-4 border-b border-outlineVariant flex justify-between items-center">
                <div className="flex items-center">
                    <button className="md:hidden mr-2 p-2 rounded-full hover:bg-black/5" onClick={() => setIsSidebarOpen(true)}>
                        <MenuIcon className="h-6 w-6 text-onSurface" />
                    </button>
                    <h2 className="text-xl md:text-2xl font-bold text-onSurface">Template Editor</h2>
                </div>
                <div className="flex items-center space-x-2">
                    <OutlineButton onClick={() => setIsPreviewing(true)}><EyeIcon className="h-5 w-5 md:mr-2"/><span className="hidden md:inline">Preview</span></OutlineButton>
                    <SecondaryButton onClick={() => onUpdate(editableTemplate)}><span className="hidden md:inline">Save and </span>Close</SecondaryButton>
                </div>
            </div>
            <div className="flex min-h-[600px] relative">
                {/* Overlay for mobile */}
                {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
                {/* Left Sidebar */}
                <aside className={`fixed inset-y-0 left-0 w-3/4 max-w-xs md:w-1/4 bg-surfaceVariant/50 backdrop-blur-lg border-r border-outlineVariant p-4 transform transition-transform duration-300 ease-in-out z-40 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-e5' : '-translate-x-full'}`}>
                    <h3 className="font-bold text-onSurfaceVariant mb-4">Weeks</h3>
                    <ul>
                        {editableTemplate.weeks.map(week => (
                            <li key={week.weekNumber}>
                                <button
                                    onClick={() => {setSelectedWeek(week.weekNumber); setIsSidebarOpen(false);}}
                                    className={`w-full text-left p-3 rounded-md text-sm transition-colors ${selectedWeek === week.weekNumber ? 'bg-secondaryContainer text-onSecondaryContainer font-semibold' : 'text-onSurfaceVariant hover:bg-black/5'}`}
                                >
                                    Week {week.weekNumber}: {week.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={addWeek} className="mt-4 w-full text-sm font-semibold text-secondary hover:text-primary flex items-center justify-center p-2 border-2 border-dashed border-outline rounded-lg hover:border-solid transition-all">
                        <PlusIcon className="h-4 w-4 mr-1"/> Add Week
                    </button>
                </aside>

                {/* Right Canvas */}
                <main className="w-full md:w-3/4 p-4 md:p-8 space-y-8 overflow-y-auto">
                    {/* Template Details */}
                    <div className="space-y-4 p-4 border border-outlineVariant/50 rounded-lg bg-surfaceVariant/20">
                        <div>
                            <label className="text-sm font-semibold text-onSurfaceVariant">Template Name</label>
                            <input type="text" value={editableTemplate.name} onChange={e => updateTemplateField('name', e.target.value)} className="w-full mt-1 p-2 border border-outline rounded-md text-lg font-semibold bg-surface text-onSurface" />
                        </div>
                        <div>
                             <label className="text-sm font-semibold text-onSurfaceVariant">Template Description</label>
                            <textarea value={editableTemplate.description} onChange={e => updateTemplateField('description', e.target.value)} rows={2} className="w-full mt-1 p-2 border border-outline rounded-md text-sm bg-surface text-onSurface" />
                        </div>
                    </div>
                    
                    {currentWeekData && (
                        <div className="space-y-6">
                             <div>
                                <label className="text-sm font-semibold text-onSurfaceVariant">Week Title</label>
                                <input type="text" value={currentWeekData.title} onChange={e => updateWeekField(selectedWeek, 'title', e.target.value)} className="w-full mt-1 p-2 border border-outline rounded-md text-lg md:text-xl font-bold bg-surface text-onSurface" />
                            </div>
                            
                            <div className="space-y-4">
                                {currentWeekData.components.map((comp, index) => (
                                    <React.Fragment key={comp.id}>
                                    {dropPlaceholderIndex === index && <div className="h-12 bg-secondaryContainer/50 border-2 border-dashed border-secondary rounded-lg transition-all" />}
                                    <div 
                                        className={`border border-outlineVariant rounded-lg bg-surface shadow-sm transition-all duration-300 transform-gpu ${draggedItem.current === index ? 'opacity-50 shadow-xl scale-105' : ''}`}
                                    >
                                        <div 
                                            draggable
                                            onDragStart={(e) => { e.stopPropagation(); draggedItem.current = index; }}
                                            onDragEnter={() => {draggedOverItem.current = index; setDropPlaceholderIndex(index);}}
                                            onDragEnd={handleSort}
                                            onDragOver={(e) => e.preventDefault()}
                                            className="flex items-center p-3 bg-surfaceVariant/30 border-b border-outlineVariant rounded-t-lg cursor-grab"
                                        >
                                            <span className="material-symbols-rounded text-onSurfaceVariant mr-2">drag_indicator</span>
                                            <input type="text" value={comp.title} onChange={(e) => updateComponent(comp.id, { ...comp, title: e.target.value })} className="font-semibold text-onSurface bg-transparent flex-grow focus:outline-none focus:ring-1 focus:ring-secondary rounded-sm px-1" />
                                            <span className="text-xs text-onSurfaceVariant mr-2 md:mr-4 bg-surfaceVariant px-2 py-0.5 rounded-full hidden sm:inline">{comp.type}</span>
                                            <button onClick={() => removeComponent(comp.id)} className="text-brandRed hover:text-red-700 p-1 rounded-full hover:bg-red-100"><TrashIcon className="h-5 w-5"/></button>
                                        </div>
                                        <div className="p-4 bg-surface">
                                            <ComponentEditor component={comp} onUpdate={updateComponent} />
                                        </div>
                                    </div>
                                    </React.Fragment>
                                ))}
                                 {dropPlaceholderIndex === currentWeekData.components.length && <div className="h-12 bg-secondaryContainer/50 border-2 border-dashed border-secondary rounded-lg transition-all" />}
                                {currentWeekData.components.length === 0 && (
                                    <div className="text-center p-8 border-2 border-dashed border-outlineVariant rounded-lg">
                                        <p className="text-onSurfaceVariant">This week has no components.</p>
                                        <p className="text-sm text-onSurfaceVariant">Add one from the library below.</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-surfaceVariant/30 rounded-lg">
                                <h4 className="font-semibold text-onSurfaceVariant mb-3">Add a new component</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {componentTypes.map(type => (
                                        <button key={type} onClick={() => addComponent(type)} className="p-3 bg-surface border border-outline hover:border-secondary hover:bg-secondaryContainer hover:shadow-md rounded-lg text-sm font-semibold text-secondary transition-all flex flex-col items-center justify-center space-y-2 h-24">
                                            {componentIconMap[type]}
                                            <span className="text-center leading-tight">{type}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
            {isPreviewing && currentWeekData && <TemplatePreviewModal template={editableTemplate} week={currentWeekData} onClose={() => setIsPreviewing(false)} />}
        </div>
    );
};


// --- MAIN APP COMPONENT ---

export default function App() {
    // --- STATE MANAGEMENT ---
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentView, setCurrentView] = useState<'LOGIN' | 'DASHBOARD' | 'WORKBOOK' | 'EDITOR'>('LOGIN');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    
    const [users, setUsers] = useState<User[]>(USERS);
    const [templates, setTemplates] = useState<OnboardingTemplate[]>(TEMPLATES);
    const [workbooks, setWorkbooks] = useState<WeeklyWorkbook[]>(WORKBOOKS);

    // --- HANDLERS ---
    const handleLogin = useCallback((user: User) => {
        setCurrentUser(user);
        setCurrentView('DASHBOARD');
    }, []);

    const handleLogout = useCallback(() => {
        setCurrentUser(null);
        setCurrentView('LOGIN');
        setSelectedId(null);
    }, []);

    const handleBackToDashboard = useCallback(() => {
        setCurrentView('DASHBOARD');
        setSelectedId(null);
    }, []);

    const handleSelectWorkbook = useCallback((workbookId: string) => {
        setSelectedId(workbookId);
        setCurrentView('WORKBOOK');
    }, []);

    const handleSelectTemplate = useCallback((templateId: string) => {
        setSelectedId(templateId);
        setCurrentView('EDITOR');
    }, []);
    
    const handleWorkbookUpdate = useCallback((updatedWorkbook: WeeklyWorkbook) => {
        setWorkbooks(prev => prev.map(wb => wb.id === updatedWorkbook.id ? updatedWorkbook : wb));
        handleBackToDashboard();
    }, [handleBackToDashboard]);

    const handleCreateTemplate = useCallback(() => {
        const newTemplate: OnboardingTemplate = {
            id: `tpl_new_${Date.now()}`,
            name: 'New Onboarding Template',
            description: 'A brief description of this template.',
            durationInWeeks: 1,
            weeks: [{ weekNumber: 1, title: 'Week 1: Welcome!', components: [] }]
        };
        setTemplates(prev => [...prev, newTemplate]);
        setSelectedId(newTemplate.id);
        setCurrentView('EDITOR');
    }, []);
    
    const handleUpdateTemplate = useCallback((updatedTemplate: OnboardingTemplate) => {
        setTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
        handleBackToDashboard();
    }, [handleBackToDashboard]);

    const handleDeleteTemplate = useCallback((templateId: string) => {
        if (window.confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
            setTemplates(prev => prev.filter(t => t.id !== templateId));
        }
    }, []);

    // --- DERIVED DATA ---
    const selectedWorkbook = useMemo(() => workbooks.find(wb => wb.id === selectedId), [workbooks, selectedId]);
    const selectedTemplateForView = useMemo(() => {
        if (currentView === 'WORKBOOK') return templates.find(t => t.id === selectedWorkbook?.templateId);
        if (currentView === 'EDITOR') return templates.find(t => t.id === selectedId);
        return null;
    }, [templates, selectedWorkbook, selectedId, currentView]);

    const MainContent = () => {
        switch (currentView) {
            case 'LOGIN':
                return <LoginView onLogin={handleLogin} />;
            case 'DASHBOARD':
                return <Dashboard 
                    currentUser={currentUser!} 
                    users={users} 
                    workbooks={workbooks} 
                    templates={templates} 
                    onSelectWorkbook={handleSelectWorkbook}
                    onSelectTemplate={handleSelectTemplate}
                    onCreateTemplate={handleCreateTemplate}
                    onDeleteTemplate={handleDeleteTemplate}
                />;
            case 'WORKBOOK':
                if (!selectedWorkbook || !selectedTemplateForView) return <div>Loading...</div>;
                return <WorkbookView 
                    key={selectedWorkbook.id}
                    workbook={selectedWorkbook} 
                    template={selectedTemplateForView} 
                    currentUser={currentUser!}
                    onUpdate={handleWorkbookUpdate}
                 />;
            case 'EDITOR':
                 if (!selectedTemplateForView) return <div>Loading...</div>
                 return <TemplateEditorView 
                    key={selectedTemplateForView.id}
                    template={selectedTemplateForView}
                    onUpdate={handleUpdateTemplate}
                 />;
            default:
                return <LoginView onLogin={handleLogin} />;
        }
    };

    return (
        <div className="min-h-screen">
            <AppHeader user={currentUser} onLogout={handleLogout} onBack={handleBackToDashboard} showBack={currentView !== 'LOGIN' && currentView !== 'DASHBOARD'} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
                {MainContent()}
            </main>
        </div>
    );
}