import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    CoverLetterContent,
    ResumeContent,
    ResumeCustomSection,
    Section,
} from '../types';

type ResumeSectionsProps = {
    resume: ResumeContent;
    updateResumeField: <Key extends keyof ResumeContent['profile']>(
        field: Key,
        value: ResumeContent['profile'][Key],
    ) => void;
    updateResumeArrayItem: <
        Key extends keyof Pick<
            ResumeContent,
            'links' | 'experience' | 'education' | 'skills' | 'languages'
        >,
    >(
        key: Key,
        index: number,
        value: unknown,
    ) => void;
    addResumeItem: <
        Key extends keyof Pick<
            ResumeContent,
            'links' | 'experience' | 'education' | 'skills' | 'languages'
        >,
    >(
        key: Key,
        blankItem: ResumeContent[Key][number],
    ) => void;
    updateCustomSection: (index: number, value: ResumeCustomSection) => void;
    updateContent: (
        updater: (
            previous: ResumeContent | CoverLetterContent,
        ) => ResumeContent | CoverLetterContent,
    ) => void;
};

export const createResumeSections = ({
    resume,
    updateResumeField,
    updateResumeArrayItem,
    addResumeItem,
    updateCustomSection,
    updateContent,
}: ResumeSectionsProps): Section[] => {
    const renderResumeProfile = () => (
        <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="first_name">First name</Label>
                    <Input
                        id="first_name"
                        value={resume.profile.first_name}
                        onChange={(event) =>
                            updateResumeField('first_name', event.target.value)
                        }
                        autoComplete="given-name"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="last_name">Last name</Label>
                    <Input
                        id="last_name"
                        value={resume.profile.last_name}
                        onChange={(event) =>
                            updateResumeField('last_name', event.target.value)
                        }
                        autoComplete="family-name"
                    />
                </div>
                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="headline">Headline</Label>
                    <Input
                        id="headline"
                        value={resume.profile.headline}
                        onChange={(event) =>
                            updateResumeField('headline', event.target.value)
                        }
                    />
                </div>
                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="summary_markdown">Summary</Label>
                    <textarea
                        id="summary_markdown"
                        value={resume.profile.summary_markdown}
                        onChange={(event) =>
                            updateResumeField(
                                'summary_markdown',
                                event.target.value,
                            )
                        }
                        rows={4}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={resume.profile.email}
                        onChange={(event) =>
                            updateResumeField('email', event.target.value)
                        }
                        autoComplete="email"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        value={resume.profile.phone}
                        onChange={(event) =>
                            updateResumeField('phone', event.target.value)
                        }
                        autoComplete="tel"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        value={resume.profile.location}
                        onChange={(event) =>
                            updateResumeField('location', event.target.value)
                        }
                        autoComplete="address-level2"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                        id="website"
                        value={resume.profile.website}
                        onChange={(event) =>
                            updateResumeField('website', event.target.value)
                        }
                    />
                </div>
            </div>
        </div>
    );

    const renderResumeLinks = () => (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Links</h3>
                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => addResumeItem('links', { label: '', url: '' })}
                >
                    Add link
                </Button>
            </div>
            <div className="space-y-3">
                {resume.links.map((link, index) => (
                    <div
                        key={`link-${index}`}
                        className="rounded-lg border border-sidebar-border/70 p-3 shadow-xs dark:border-sidebar-border"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                                Link {index + 1}
                            </span>
                            {resume.links.length > 1 && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                        updateContent((prev) => {
                                            const current = prev as ResumeContent;
                                            return {
                                                ...current,
                                                links: current.links.filter(
                                                    (_, idx) => idx !== index,
                                                ),
                                            };
                                        })
                                    }
                                >
                                    Delete
                                </Button>
                            )}
                        </div>
                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                            <Input
                                placeholder="Label"
                                value={link.label}
                                onChange={(event) =>
                                    updateResumeArrayItem('links', index, {
                                        ...link,
                                        label: event.target.value,
                                    })
                                }
                            />
                            <Input
                                placeholder="URL"
                                value={link.url}
                                onChange={(event) =>
                                    updateResumeArrayItem('links', index, {
                                        ...link,
                                        url: event.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderResumeExperience = () => (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Experience</h3>
                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                        addResumeItem('experience', {
                            company: '',
                            role: '',
                            location: '',
                            start_date: '',
                            end_date: '',
                            is_current: false,
                            description_markdown: '',
                        })
                    }
                >
                    Add role
                </Button>
            </div>
            <div className="space-y-4">
                {resume.experience.map((exp, index) => (
                    <div
                        key={`exp-${index}`}
                        className="rounded-lg border border-sidebar-border/70 p-3 shadow-xs dark:border-sidebar-border"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                                Experience {index + 1}
                            </span>
                            {resume.experience.length > 1 && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                        updateContent((prev) => {
                                            const current = prev as ResumeContent;
                                            return {
                                                ...current,
                                                experience: current.experience.filter(
                                                    (_, idx) => idx !== index,
                                                ),
                                            };
                                        })
                                    }
                                >
                                    Delete
                                </Button>
                            )}
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                            <Input
                                placeholder="Company"
                                value={exp.company}
                                onChange={(event) =>
                                    updateResumeArrayItem('experience', index, {
                                        ...exp,
                                        company: event.target.value,
                                    })
                                }
                            />
                            <Input
                                placeholder="Role"
                                value={exp.role}
                                onChange={(event) =>
                                    updateResumeArrayItem('experience', index, {
                                        ...exp,
                                        role: event.target.value,
                                    })
                                }
                            />
                            <Input
                                placeholder="Location"
                                value={exp.location}
                                onChange={(event) =>
                                    updateResumeArrayItem('experience', index, {
                                        ...exp,
                                        location: event.target.value,
                                    })
                                }
                            />
                            <div className="flex gap-2">
                                <Input
                                    type="date"
                                    placeholder="Start"
                                    value={exp.start_date}
                                    onChange={(event) =>
                                        updateResumeArrayItem('experience', index, {
                                            ...exp,
                                            start_date: event.target.value,
                                        })
                                    }
                                />
                                <Input
                                    type="date"
                                    placeholder="End"
                                    disabled={exp.is_current}
                                    value={exp.end_date ?? ''}
                                    onChange={(event) =>
                                        updateResumeArrayItem('experience', index, {
                                            ...exp,
                                            end_date: event.target.value,
                                        })
                                    }
                                />
                            </div>
                            <label className="flex items-center gap-2 text-sm sm:col-span-2">
                                <input
                                    type="checkbox"
                                    checked={exp.is_current}
                                    onChange={(event) =>
                                        updateResumeArrayItem('experience', index, {
                                            ...exp,
                                            is_current: event.target.checked,
                                        })
                                    }
                                />
                                Currently working here
                            </label>
                            <textarea
                                placeholder="Description"
                                value={exp.description_markdown}
                                onChange={(event) =>
                                    updateResumeArrayItem('experience', index, {
                                        ...exp,
                                        description_markdown: event.target.value,
                                    })
                                }
                                rows={3}
                                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:col-span-2"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderResumeEducation = () => (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Education</h3>
                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                        addResumeItem('education', {
                            school: '',
                            degree: '',
                            field: '',
                            location: '',
                            start_date: '',
                            end_date: '',
                            description_markdown: '',
                        })
                    }
                >
                    Add school
                </Button>
            </div>
            <div className="space-y-4">
                {resume.education.map((edu, index) => (
                    <div
                        key={`edu-${index}`}
                        className="rounded-lg border border-sidebar-border/70 p-3 shadow-xs dark:border-sidebar-border"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                                Education {index + 1}
                            </span>
                            {resume.education.length > 1 && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                        updateContent((prev) => {
                                            const current = prev as ResumeContent;
                                            return {
                                                ...current,
                                                education: current.education.filter(
                                                    (_, idx) => idx !== index,
                                                ),
                                            };
                                        })
                                    }
                                >
                                    Delete
                                </Button>
                            )}
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                            <Input
                                placeholder="School"
                                value={edu.school}
                                onChange={(event) =>
                                    updateResumeArrayItem('education', index, {
                                        ...edu,
                                        school: event.target.value,
                                    })
                                }
                            />
                            <Input
                                placeholder="Degree"
                                value={edu.degree}
                                onChange={(event) =>
                                    updateResumeArrayItem('education', index, {
                                        ...edu,
                                        degree: event.target.value,
                                    })
                                }
                            />
                            <Input
                                placeholder="Field"
                                value={edu.field}
                                onChange={(event) =>
                                    updateResumeArrayItem('education', index, {
                                        ...edu,
                                        field: event.target.value,
                                    })
                                }
                            />
                            <Input
                                placeholder="Location"
                                value={edu.location}
                                onChange={(event) =>
                                    updateResumeArrayItem('education', index, {
                                        ...edu,
                                        location: event.target.value,
                                    })
                                }
                            />
                            <div className="flex gap-2">
                                <Input
                                    type="date"
                                    placeholder="Start"
                                    value={edu.start_date}
                                    onChange={(event) =>
                                        updateResumeArrayItem('education', index, {
                                            ...edu,
                                            start_date: event.target.value,
                                        })
                                    }
                                />
                                <Input
                                    type="date"
                                    placeholder="End"
                                    value={edu.end_date ?? ''}
                                    onChange={(event) =>
                                        updateResumeArrayItem('education', index, {
                                            ...edu,
                                            end_date: event.target.value,
                                        })
                                    }
                                />
                            </div>
                            <textarea
                                placeholder="Description"
                                value={edu.description_markdown}
                                onChange={(event) =>
                                    updateResumeArrayItem('education', index, {
                                        ...edu,
                                        description_markdown: event.target.value,
                                    })
                                }
                                rows={3}
                                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:col-span-2"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderResumeSkillsLanguages = () => (
        <div className="space-y-4">
            <div className="space-y-3 rounded-lg border border-sidebar-border/70 p-3 shadow-xs dark:border-sidebar-border">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Skills</h3>
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => addResumeItem('skills', { name: '', level: 3 })}
                    >
                        Add skill
                    </Button>
                </div>
                <div className="space-y-3">
                    {resume.skills.map((skill, index) => (
                        <div key={`skill-${index}`} className="flex gap-2">
                            <Input
                                placeholder="Skill"
                                value={skill.name}
                                onChange={(event) =>
                                    updateResumeArrayItem('skills', index, {
                                        ...skill,
                                        name: event.target.value,
                                    })
                                }
                            />
                            <Input
                                type="number"
                                min={1}
                                max={5}
                                placeholder="Level (1-5)"
                                value={skill.level}
                                onChange={(event) =>
                                    updateResumeArrayItem('skills', index, {
                                        ...skill,
                                        level: Number(event.target.value),
                                    })
                                }
                            />
                            {resume.skills.length > 1 && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                        updateContent((prev) => {
                                            const current = prev as ResumeContent;
                                            return {
                                                ...current,
                                                skills: current.skills.filter(
                                                    (_, idx) => idx !== index,
                                                ),
                                            };
                                        })
                                    }
                                >
                                    Delete
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-3 rounded-lg border border-sidebar-border/70 p-3 shadow-xs dark:border-sidebar-border">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Languages</h3>
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                            addResumeItem('languages', { name: '', level: '' })
                        }
                    >
                        Add language
                    </Button>
                </div>
                <div className="space-y-3">
                    {resume.languages.map((language, index) => (
                        <div key={`lang-${index}`} className="flex gap-2">
                            <Input
                                placeholder="Language"
                                value={language.name}
                                onChange={(event) =>
                                    updateResumeArrayItem('languages', index, {
                                        ...language,
                                        name: event.target.value,
                                    })
                                }
                            />
                            <Input
                                placeholder="Level"
                                value={language.level}
                                onChange={(event) =>
                                    updateResumeArrayItem('languages', index, {
                                        ...language,
                                        level: event.target.value,
                                    })
                                }
                            />
                            {resume.languages.length > 1 && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                        updateContent((prev) => {
                                            const current = prev as ResumeContent;
                                            return {
                                                ...current,
                                                languages: current.languages.filter(
                                                    (_, idx) => idx !== index,
                                                ),
                                            };
                                        })
                                    }
                                >
                                    Delete
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderResumeCustomSections = () => (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Custom sections</h3>
                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                        updateContent((prev) => {
                            const current = prev as ResumeContent;
                            return {
                                ...current,
                                custom_sections: [
                                    ...current.custom_sections,
                                    {
                                        title: 'Section',
                                        items: [
                                            {
                                                label: '',
                                                description_markdown: '',
                                                start_date: '',
                                                end_date: '',
                                            },
                                        ],
                                    },
                                ],
                            };
                        })
                    }
                >
                    Add section
                </Button>
            </div>

            <div className="space-y-3">
                {resume.custom_sections.map((section, index) => (
                    <div
                        key={`custom-${index}`}
                        className="rounded-lg border border-sidebar-border/70 p-3 shadow-xs dark:border-sidebar-border"
                    >
                        <div className="flex items-center justify-between">
                            <Input
                                className="mr-3"
                                placeholder="Section title"
                                value={section.title}
                                onChange={(event) =>
                                    updateCustomSection(index, {
                                        ...section,
                                        title: event.target.value,
                                    })
                                }
                            />
                            {resume.custom_sections.length > 1 && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                        updateContent((prev) => {
                                            const current = prev as ResumeContent;
                                            return {
                                                ...current,
                                                custom_sections: current.custom_sections.filter(
                                                    (_, idx) => idx !== index,
                                                ),
                                            };
                                        })
                                    }
                                >
                                    Delete
                                </Button>
                            )}
                        </div>

                        <div className="mt-3 space-y-3">
                            {section.items.map((item, itemIndex) => (
                                <div
                                    key={`item-${itemIndex}`}
                                    className="rounded-md border border-sidebar-border/70 p-3 dark:border-sidebar-border"
                                >
                                    <div className="flex items-center justify-between">
                                        <Input
                                            className="mr-3"
                                            placeholder="Label"
                                            value={item.label}
                                            onChange={(event) =>
                                                updateCustomSection(index, {
                                                    ...section,
                                                    items: section.items.map(
                                                        (existing, idx) =>
                                                            idx === itemIndex
                                                                ? {
                                                                    ...existing,
                                                                    label: event.target.value,
                                                                }
                                                                : existing,
                                                    ),
                                                })
                                            }
                                        />
                                        {section.items.length > 1 && (
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="ghost"
                                                onClick={() =>
                                                    updateCustomSection(index, {
                                                        ...section,
                                                        items: section.items.filter(
                                                            (_, idx) => idx !== itemIndex,
                                                        ),
                                                    })
                                                }
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </div>
                                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                        <Input
                                            type="date"
                                            placeholder="Start"
                                            value={item.start_date}
                                            onChange={(event) =>
                                                updateCustomSection(index, {
                                                    ...section,
                                                    items: section.items.map(
                                                        (existing, idx) =>
                                                            idx === itemIndex
                                                                ? {
                                                                    ...existing,
                                                                    start_date: event.target.value,
                                                                }
                                                                : existing,
                                                    ),
                                                })
                                            }
                                        />
                                        <Input
                                            type="date"
                                            placeholder="End"
                                            value={item.end_date ?? ''}
                                            onChange={(event) =>
                                                updateCustomSection(index, {
                                                    ...section,
                                                    items: section.items.map(
                                                        (existing, idx) =>
                                                            idx === itemIndex
                                                                ? {
                                                                    ...existing,
                                                                    end_date: event.target.value,
                                                                }
                                                                : existing,
                                                    ),
                                                })
                                            }
                                        />
                                    </div>
                                    <textarea
                                        placeholder="Description"
                                        value={item.description_markdown}
                                        onChange={(event) =>
                                            updateCustomSection(index, {
                                                ...section,
                                                items: section.items.map(
                                                    (existing, idx) =>
                                                        idx === itemIndex
                                                            ? {
                                                                ...existing,
                                                                description_markdown:
                                                                    event.target.value,
                                                            }
                                                            : existing,
                                                ),
                                            })
                                        }
                                        rows={3}
                                        className="mt-2 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                    />
                                </div>
                            ))}

                            <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                onClick={() =>
                                    updateCustomSection(index, {
                                        ...section,
                                        items: [
                                            ...section.items,
                                            {
                                                label: '',
                                                description_markdown: '',
                                                start_date: '',
                                                end_date: '',
                                            },
                                        ],
                                    })
                                }
                            >
                                Add item
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return [
        {
            key: 'profile',
            title: 'Profile',
            render: renderResumeProfile,
        },
        {
            key: 'links',
            title: 'Links',
            render: renderResumeLinks,
        },
        {
            key: 'experience',
            title: 'Experience',
            render: renderResumeExperience,
        },
        {
            key: 'education',
            title: 'Education',
            render: renderResumeEducation,
        },
        {
            key: 'skills',
            title: 'Skills & Languages',
            render: renderResumeSkillsLanguages,
        },
        {
            key: 'custom_sections',
            title: 'Custom sections',
            render: renderResumeCustomSections,
        },
    ];
};
