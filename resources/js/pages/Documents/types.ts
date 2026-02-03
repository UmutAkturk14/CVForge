export type DocumentType = 'resume' | 'cover_letter';
export type DocumentStatus = 'draft' | 'final' | 'archived';
export type TemplateKey = 'classic' | 'modern';

export type Document = {
    id: number;
    title: string;
    type: DocumentType;
    status: DocumentStatus;
    template_key: string | null;
    content: Record<string, unknown> | null;
    updated_at: string;
};

export type ExtraField = { label: string; value: string };
export type ResumeProfile = {
    first_name: string;
    last_name: string;
    headline: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    summary_markdown: string;
    extra_fields: ExtraField[];
};

export type ResumeLink = { label: string; url: string };
export type ResumeExperience = {
    company: string;
    role: string;
    location: string;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    description_markdown: string;
};
export type ResumeEducation = {
    school: string;
    degree: string;
    field: string;
    location: string;
    start_date: string;
    end_date: string;
    description_markdown: string;
};
export type ResumeSkill = { name: string };
export type ResumeSkillGroup = { title: string; items: ResumeSkill[] };
export type ResumeLanguage = { name: string; level: string };
export type ResumeCustomItem = {
    label: string;
    description_markdown: string;
    start_date: string;
    end_date: string | null;
};
export type ResumeCustomSection = { title: string; items: ResumeCustomItem[] };
export type ResumeContent = {
    schema_version?: number;
    font?: string;
    language?: string;
    profile: ResumeProfile;
    links: ResumeLink[];
    experience: ResumeExperience[];
    education: ResumeEducation[];
    skills: ResumeSkillGroup[];
    languages: ResumeLanguage[];
    custom_sections: ResumeCustomSection[];
    layout: { section_order: string[] };
};

export type CoverLetterMeta = {
    company_name: string;
    job_title: string;
    recipient_name: string;
    recipient_title: string;
};
export type CoverLetterSender = {
    full_name: string;
    email: string;
    phone: string;
    location: string;
    links: ResumeLink[];
    extra_fields: ExtraField[];
};
export type CoverLetterSettings = {
    tone: string;
    length: string;
};
export type CoverLetterBlock = {
    type: string;
    enabled: boolean;
    value?: string;
    markdown?: string;
};
export type CoverLetterCustomSection = {
    title: string;
    enabled: boolean;
    markdown: string;
};
export type CoverLetterContent = {
    schema_version?: number;
    font?: string;
    language?: string;
    meta: CoverLetterMeta;
    sender: CoverLetterSender;
    settings: CoverLetterSettings;
    blocks: CoverLetterBlock[];
    custom_sections: CoverLetterCustomSection[];
    signature_font?: string;
    layout: {
        include_sender_header: boolean;
        include_meta_line: boolean;
        paragraph_spacing: string;
    };
};

export type EditProps = {
    document: Document;
};

export type Section = {
    key: string;
    title: string;
    render: () => JSX.Element;
};

export const defaultResumeContent = (): ResumeContent => ({
    schema_version: 1,
    font: 'Garamond',
    language: 'en',
    profile: {
        first_name: '',
        last_name: '',
        headline: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        summary_markdown: '',
        extra_fields: [{ label: 'Citizenship', value: '' }],
    },
    links: [
        { label: 'LinkedIn', url: '' },
        { label: 'GitHub', url: '' },
    ],
    experience: [
        {
            company: '',
            role: '',
            location: '',
            start_date: '',
            end_date: '',
            is_current: true,
            description_markdown: '',
        },
    ],
    education: [
        {
            school: '',
            degree: '',
            field: '',
            location: '',
            start_date: '',
            end_date: '',
            description_markdown: '',
        },
    ],
    skills: [
        {
            title: 'Core skills',
            items: [{ name: '' }],
        },
    ],
    languages: [{ name: '', level: '' }],
    custom_sections: [
        {
            title: 'Projects',
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
    layout: {
        section_order: [
            'profile',
            'links',
            'experience',
            'education',
            'skills',
            'languages',
            'custom_sections',
        ],
    },
});

export const defaultCoverLetterContent = (): CoverLetterContent => ({
    schema_version: 1,
    font: 'Garamond',
    language: 'en',
    meta: {
        company_name: '',
        job_title: '',
        recipient_name: '',
        recipient_title: '',
    },
    sender: {
        full_name: '',
        email: '',
        phone: '',
        location: '',
        links: [
            { label: 'Portfolio', url: '' },
            { label: 'LinkedIn', url: '' },
        ],
        extra_fields: [{ label: 'Availability', value: '' }],
    },
    settings: {
        tone: 'professional',
        length: 'medium',
    },
    blocks: [
        {
            type: 'body',
            enabled: true,
            markdown: '',
        },
        {
            type: 'signature',
            enabled: true,
            markdown: '',
        },
    ],
    custom_sections: [],
    signature_font: 'Alex Brush',
    layout: {
        include_sender_header: true,
        include_meta_line: true,
        paragraph_spacing: 'normal',
    },
});
