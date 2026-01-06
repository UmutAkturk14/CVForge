import { ResumeContent, TemplateKey } from '../types';

const escapeHtml = (value: string): string =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

const applyFormatting = (value: string): string => {
    let html = escapeHtml(value);

    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');
    html = html.replace(
        /\[(.+?)\]\((.+?)\)/g,
        '<a href="$2" target="_blank" rel="noreferrer">$1</a>',
    );

    return html;
};

const formatDate = (value: string | null | undefined): string => {
    if (!value) {
        return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString(undefined, {
        month: 'short',
        year: 'numeric',
    });
};

const renderLines = (text?: string) =>
    (text ?? '')
        .split('\n')
        .filter((line) => line.trim() !== '')
        .map((line, index) => (
            <p
                key={`${line}-${index}`}
                className="text-sm leading-relaxed [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80"
                dangerouslySetInnerHTML={{ __html: applyFormatting(line) }}
            />
        ));

type ResumePreviewProps = {
    resume: ResumeContent;
    variant: TemplateKey;
};

export function ResumePreview({ resume, variant }: ResumePreviewProps) {
    const isClassic = variant === 'classic';
    const containerClass = 'w-full max-w-3xl mx-auto';
    const fontFamily =
        resume.font === 'Times New Roman'
            ? '"Times New Roman", Times, serif'
            : resume.font === 'Montserrat'
                ? '"Montserrat", "Helvetica Neue", Arial, sans-serif'
                : 'Garamond, "Times New Roman", serif';

    if (!isClassic) {
        const modernCard =
            'bg-gradient-to-br from-indigo-50 to-white dark:from-neutral-900 dark:to-neutral-950 shadow-sm ring-1 ring-black/5 dark:ring-white/5';
        const sectionWrapperClass = `rounded-xl p-4 ${modernCard}`;
        const headerWrapperClass = `rounded-xl p-6 ${modernCard}`;
        const pillClass =
            'rounded-full bg-indigo-50 px-3 py-1 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-200';
        const mutedTextClass = 'text-sm text-muted-foreground';
        const sectionTitleClass = 'text-sm font-semibold text-foreground';

        return (
            <div className={`flex flex-col gap-6 ${containerClass}`} style={{ fontFamily }}>
                <div className={headerWrapperClass}>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h2 className="text-4xl font-semibold text-neutral-900 dark:text-neutral-50">
                            {`${resume.profile.first_name} ${resume.profile.last_name}`.trim() ||
                                'Your Name'}
                        </h2>
                        <p className={mutedTextClass}>
                            {resume.profile.headline || 'Role / Headline'}
                        </p>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-600 dark:text-neutral-300">
                        {resume.profile.email && <div>{resume.profile.email}</div>}
                        {resume.profile.phone && <div>{resume.profile.phone}</div>}
                        {resume.profile.location && <div>{resume.profile.location}</div>}
                        {resume.profile.website && <div className="truncate">{resume.profile.website}</div>}
                    </div>
                    {resume.profile.summary_markdown && (
                        <div className="mt-4 space-y-2">
                            <h3 className={sectionTitleClass}>Summary</h3>
                            <div className={`space-y-1 text-sm leading-relaxed ${mutedTextClass}`}>
                                {renderLines(resume.profile.summary_markdown)}
                            </div>
                        </div>
                    )}
                </div>

                {resume.links.length > 0 && (
                    <div className={`${sectionWrapperClass} ${containerClass}`}>
                        <h3 className={sectionTitleClass}>Links</h3>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                            {resume.links.map((link, index) => (
                                <a
                                    key={`${link.label}-${index}`}
                                    href={link.url || undefined}
                                    className={`${pillClass} underline underline-offset-2 hover:opacity-80`}
                                    target={link.url ? '_blank' : undefined}
                                    rel={link.url ? 'noreferrer' : undefined}
                                >
                                    {link.label || 'Link'}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {resume.experience.length > 0 && (
                    <div className={`${sectionWrapperClass} ${containerClass}`}>
                        <h3 className={sectionTitleClass}>Experience</h3>
                        <div className="mt-3 space-y-4">
                            {resume.experience.map((exp, index) => (
                                <div key={`${exp.company}-${index}`} className="space-y-1">
                                    <div className="flex flex-wrap justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                                                {exp.role || 'Role'} · {exp.company || 'Company'}
                                            </p>
                                            <p className="text-xs text-neutral-600 dark:text-neutral-300">
                                                {exp.location}
                                            </p>
                                        </div>
                                        <p className="text-xs text-neutral-600 dark:text-neutral-300">
                                            {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                                        </p>
                                    </div>
                                    <div className={`text-sm leading-relaxed ${mutedTextClass}`}>
                                        {renderLines(exp.description_markdown)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {resume.education.length > 0 && (
                    <div className={`${sectionWrapperClass} ${containerClass}`}>
                        <h3 className={sectionTitleClass}>Education</h3>
                        <div className="mt-3 space-y-4">
                            {resume.education.map((edu, index) => (
                                <div key={`${edu.school}-${index}`} className="space-y-1">
                                    <div className="flex flex-wrap justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                                                {edu.degree || 'Degree'} · {edu.school || 'School'}
                                            </p>
                                            <p className="text-xs text-neutral-600 dark:text-neutral-300">
                                                {edu.field}
                                            </p>
                                        </div>
                                        <p className="text-xs text-neutral-600 dark:text-neutral-300">
                                            {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                                        </p>
                                    </div>
                                    <div className={`text-sm leading-relaxed ${mutedTextClass}`}>
                                        {renderLines(edu.description_markdown)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {(resume.skills.length > 0 || resume.languages.length > 0) && (
                    <div className={`${sectionWrapperClass} ${containerClass}`}>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <h3 className={sectionTitleClass}>Skills</h3>
                                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                    {resume.skills.map((skill, index) => (
                                        <span key={`${skill.name}-${index}`} className={pillClass}>
                                            {skill.name || 'Skill'}
                                            {skill.level ? ` · ${skill.level}/5` : ''}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className={sectionTitleClass}>Languages</h3>
                                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                    {resume.languages.map((language, index) => (
                                        <span key={`${language.name}-${index}`} className={pillClass}>
                                            {language.name || 'Language'}
                                            {language.level ? ` · ${language.level}` : ''}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {resume.custom_sections.length > 0 && (
                    <div className={`${sectionWrapperClass} ${containerClass}`}>
                        <h3 className={sectionTitleClass}>Custom Sections</h3>
                        <div className="mt-3 space-y-4">
                            {resume.custom_sections.map((section, index) => (
                                <div key={`${section.title}-${index}`} className="space-y-2">
                                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                                        {section.title || 'Section'}
                                    </p>
                                    {section.items.map((item, itemIndex) => (
                                        <div key={`${section.title}-${itemIndex}`} className="space-y-1">
                                            <p className={`text-sm text-muted-foreground`}>
                                                {item.label || 'Item'}{' '}
                                                {(item.start_date || item.end_date) && (
                                                    <span className="text-xs">
                                                        ({formatDate(item.start_date)} - {formatDate(item.end_date)})
                                                    </span>
                                                )}
                                            </p>
                                            <div className={`text-sm leading-relaxed ${mutedTextClass}`}>
                                                {renderLines(item.description_markdown)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    const mutedTextClass = 'text-sm text-neutral-800 dark:text-neutral-200';
    const sectionTitleClass = 'text-sm font-semibold uppercase tracking-[0.2em] text-neutral-900 dark:text-neutral-50';

    return (
        <div className={`flex flex-col gap-8 ${containerClass}`} style={{ fontFamily }}>
            <div className="space-y-4 border-b border-neutral-300 pb-6 text-center dark:border-neutral-700">
                <h2 className="text-3xl font-semibold tracking-wide text-neutral-900 dark:text-neutral-50">
                    {`${resume.profile.first_name} ${resume.profile.last_name}`.trim() || 'Your Name'}
                </h2>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-800 dark:text-neutral-200">
                    {resume.profile.headline || 'Role / Headline'}
                </p>
                {resume.profile.location && (
                    <p className="text-sm text-neutral-700 dark:text-neutral-200">{resume.profile.location}</p>
                )}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    {resume.profile.phone && <div>{resume.profile.phone}</div>}
                    {resume.profile.email && <div>{resume.profile.email}</div>}
                </div>
                {resume.profile.summary_markdown && (
                    <div className="mt-6 space-y-3">
                        <div className="flex items-center justify-center gap-6">
                            <span className="h-px flex-1 bg-neutral-300 dark:bg-neutral-700" />
                            <span className={sectionTitleClass}>PROFILE</span>
                            <span className="h-px flex-1 bg-neutral-300 dark:bg-neutral-700" />
                        </div>
                        <div className={`space-y-1 text-sm leading-relaxed text-center ${mutedTextClass}`}>
                            {renderLines(resume.profile.summary_markdown)}
                        </div>
                    </div>
                )}
            </div>

            {resume.links.length > 0 && (
                <div className="border-t border-neutral-300 pt-4 dark:border-neutral-700">
                    <div className="flex items-center justify-center gap-6 pb-2">
                        <span className="h-px flex-1 bg-neutral-300 dark:bg-neutral-700" />
                        <span className={sectionTitleClass}>LINKS</span>
                        <span className="h-px flex-1 bg-neutral-300 dark:bg-neutral-700" />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm">
                        {resume.links.map((link, index) => (
                            <a
                                key={`${link.label}-${index}`}
                                href={link.url || undefined}
                                className="text-neutral-800 underline underline-offset-2 hover:opacity-80 dark:text-neutral-200"
                                target={link.url ? '_blank' : undefined}
                                rel={link.url ? 'noreferrer' : undefined}
                            >
                                {link.label || 'Link'}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {resume.experience.length > 0 && (
                <div className="border-t border-neutral-300 pt-4 dark:border-neutral-700">
                    <div className="flex items-center justify-center gap-6 pb-3">
                        <span className="h-px flex-1 bg-neutral-300 dark:bg-neutral-700" />
                        <span className={sectionTitleClass}>EXPERIENCE</span>
                        <span className="h-px flex-1 bg-neutral-300 dark:bg-neutral-700" />
                    </div>
                    <div className="space-y-5">
                        {resume.experience.map((exp, index) => (
                            <div key={`${exp.company}-${index}`} className="space-y-1">
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                                        {exp.role || 'Role'}
                                    </p>
                                    <p className="text-xs uppercase tracking-wide text-neutral-700 dark:text-neutral-300">
                                        {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center justify-between text-sm text-neutral-700 dark:text-neutral-300">
                                    <span>{exp.company || 'Company'}</span>
                                    <span className="flex-1 border-b border-dotted border-neutral-400 px-2 dark:border-neutral-600" />
                                    <span className="text-xs">{exp.location}</span>
                                </div>
                                <div className={`text-sm leading-relaxed ${mutedTextClass}`}>
                                    {renderLines(exp.description_markdown)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {resume.education.length > 0 && (
                <div className="border-t border-neutral-300 pt-4 dark:border-neutral-700">
                    <div className="flex items-center justify-center gap-6 pb-3">
                        <span className="h-px flex-1 bg-neutral-300 dark:bg-neutral-700" />
                        <span className={sectionTitleClass}>EDUCATION</span>
                        <span className="h-px flex-1 bg-neutral-300 dark:bg-neutral-700" />
                    </div>
                    <div className="space-y-4">
                        {resume.education.map((edu, index) => (
                            <div key={`${edu.school}-${index}`} className="space-y-1">
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                                        {edu.degree || 'Degree'}
                                    </p>
                                    <p className="text-xs uppercase tracking-wide text-neutral-700 dark:text-neutral-300">
                                        {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center justify-between text-sm text-neutral-700 dark:text-neutral-300">
                                    <span>{edu.school || 'School'}</span>
                                    <span className="flex-1 border-b border-dotted border-neutral-400 px-2 dark:border-neutral-600" />
                                    <span className="text-xs">{edu.location}</span>
                                </div>
                                <div className={`text-sm leading-relaxed ${mutedTextClass}`}>
                                    {renderLines(edu.description_markdown)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {resume.skills.length > 0 && (
                <div className="border-t border-neutral-300 pt-4 dark:border-neutral-700">
                    <div className="flex items-center justify-center gap-6 pb-3">
                        <span className="h-px flex-1 bg-neutral-300 dark:bg-neutral-700" />
                        <span className={sectionTitleClass}>SKILLS</span>
                        <span className="h-px flex-1 bg-neutral-300 dark:bg-neutral-700" />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                        {resume.skills.map((skill, index) => (
                            <div key={`${skill.name}-${index}`} className="flex items-center text-sm text-neutral-800 dark:text-neutral-200">
                                <span>{skill.name || 'Skill'}</span>
                                <span className="flex-1 border-b border-dotted border-neutral-400 px-2 dark:border-neutral-600" />
                                {skill.level ? (
                                    <span className="text-xs uppercase tracking-wide">{skill.level}/5</span>
                                ) : (
                                    <span className="text-xs">&nbsp;</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {resume.languages.length > 0 && (
                <div className="border-t border-neutral-300 pt-4 dark:border-neutral-700">
                    <div className="flex items-center justify-center gap-6 pb-3">
                        <span className="h-px flex-1 bg-neutral-300 dark:bg-neutral-700" />
                        <span className={sectionTitleClass}>LANGUAGES</span>
                        <span className="h-px flex-1 bg-neutral-300 dark:bg-neutral-700" />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                        {resume.languages.map((language, index) => (
                            <div key={`${language.name}-${index}`} className="flex items-center text-sm text-neutral-800 dark:text-neutral-200">
                                <span>{language.name || 'Language'}</span>
                                <span className="flex-1 border-b border-dotted border-neutral-400 px-2 dark:border-neutral-600" />
                                <span className="text-xs uppercase tracking-wide">{language.level || ''}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {resume.custom_sections.length > 0 && (
                <div className="border-t border-neutral-300 pt-4 dark:border-neutral-700">
                    <div className="flex items-center justify-center gap-6 pb-3">
                        <span className="h-px flex-1 bg-neutral-300 dark:bg-neutral-700" />
                        <span className={sectionTitleClass}>ADDITIONAL</span>
                        <span className="h-px flex-1 bg-neutral-300 dark:bg-neutral-700" />
                    </div>
                    <div className="mt-3 space-y-4">
                        {resume.custom_sections.map((section, index) => (
                            <div key={`${section.title}-${index}`} className="space-y-2">
                                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                                    {section.title || 'Section'}
                                </p>
                                {section.items.map((item, itemIndex) => (
                                    <div key={`${section.title}-${itemIndex}`} className="space-y-1">
                                        <div className="flex flex-wrap items-center justify-between text-sm text-neutral-800 dark:text-neutral-200">
                                            <span>{item.label || 'Item'}</span>
                                            <span className="flex-1 border-b border-dotted border-neutral-400 px-2 dark:border-neutral-600" />
                                            {(item.start_date || item.end_date) && (
                                                <span className="text-xs uppercase tracking-wide">
                                                    {formatDate(item.start_date)} - {formatDate(item.end_date)}
                                                </span>
                                            )}
                                        </div>
                                        <div className={`text-sm leading-relaxed ${mutedTextClass}`}>
                                            {renderLines(item.description_markdown)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
