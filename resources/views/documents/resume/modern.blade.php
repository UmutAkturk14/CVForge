<meta name="cvforge-template" content="resume-modern">
<div data-template="resume-modern"></div>

@php
    $profileName = trim((string) data_get($content, 'profile.first_name').' '.(string) data_get($content, 'profile.last_name'));
@endphp

<div style="border: 1px solid #e5e7eb; border-radius: 16px; padding: 20px; background: #f8fafc;">
    <div style="text-align: center;">
        <div style="font-size: 28px; font-weight: 700; color: #0f172a;">
            {{ $profileName !== '' ? $profileName : 'Your Name' }}
        </div>
        <div style="margin-top: 4px; font-size: 13px; color: #475569;">
            {{ data_get($content, 'profile.headline') ?: 'Role / Headline' }}
        </div>
    </div>
    <div style="margin-top: 12px; display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; font-size: 11px; color: #475569;">
        @if (data_get($content, 'profile.email'))
            <span>{{ data_get($content, 'profile.email') }}</span>
        @endif
        @if (data_get($content, 'profile.phone'))
            <span>{{ data_get($content, 'profile.phone') }}</span>
        @endif
        @if (data_get($content, 'profile.location'))
            <span>{{ data_get($content, 'profile.location') }}</span>
        @endif
        @if (data_get($content, 'profile.website'))
            <span>{{ data_get($content, 'profile.website') }}</span>
        @endif
    </div>

    @if (data_get($content, 'profile.summary_markdown'))
        <div style="margin-top: 16px;">
            <div style="font-size: 12px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.18em;">
                Summary
            </div>
            <div style="margin-top: 6px; font-size: 12px; color: #334155; line-height: 1.6;">
                {!! $applyResumeFormatting(data_get($content, 'profile.summary_markdown')) !!}
            </div>
        </div>
    @endif
</div>

@if (count(data_get($content, 'links', [])))
    <div style="margin-top: 16px; border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px;">
        <div style="font-size: 12px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.18em;">
            Links
        </div>
        <div style="margin-top: 8px; display: flex; flex-wrap: wrap; gap: 8px;">
            @foreach (data_get($content, 'links', []) as $link)
                @php
                    $label = $link['label'] ?? 'Link';
                    $url = $link['url'] ?? null;
                @endphp
                <span style="font-size: 11px; padding: 4px 10px; border-radius: 999px; background: #eef2ff; color: #3730a3;">
                    @if ($url)
                        <a href="{{ $url }}" style="color: #3730a3; text-decoration: underline;">{{ $label }}</a>
                    @else
                        {{ $label }}
                    @endif
                </span>
            @endforeach
        </div>
    </div>
@endif

@if (count(data_get($content, 'experience', [])))
    <div style="margin-top: 16px; border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px;">
        <div style="font-size: 12px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.18em;">
            Experience
        </div>
        <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 14px;">
            @foreach (data_get($content, 'experience', []) as $exp)
                <div>
                    <div style="display: flex; justify-content: space-between; gap: 12px; align-items: baseline;">
                        <div style="font-size: 12px; font-weight: 600; color: #0f172a;">
                            {{ $exp['role'] ?? 'Role' }} · {{ $exp['company'] ?? 'Company' }}
                        </div>
                        <div style="font-size: 11px; color: #64748b;">
                            @php
                                $start = $exp['start_date'] ?? '';
                                $end = ($exp['is_current'] ?? false) ? 'Present' : ($exp['end_date'] ?? '');
                            @endphp
                            {{ $start }} @if($start || $end) - @endif {{ $end }}
                        </div>
                    </div>
                    @if (!empty($exp['location']))
                        <div style="margin-top: 2px; font-size: 11px; color: #64748b;">{{ $exp['location'] }}</div>
                    @endif
                    @if (!empty($exp['description_markdown']))
                        <div style="margin-top: 6px; font-size: 12px; color: #334155; line-height: 1.6;">
                            {!! $applyResumeFormatting($exp['description_markdown']) !!}
                        </div>
                    @endif
                </div>
            @endforeach
        </div>
    </div>
@endif

@if (count(data_get($content, 'education', [])))
    <div style="margin-top: 16px; border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px;">
        <div style="font-size: 12px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.18em;">
            Education
        </div>
        <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 12px;">
            @foreach (data_get($content, 'education', []) as $edu)
                <div>
                    <div style="display: flex; justify-content: space-between; gap: 12px;">
                        <div style="font-size: 12px; font-weight: 600; color: #0f172a;">
                            {{ $edu['degree'] ?? 'Degree' }} · {{ $edu['school'] ?? 'School' }}
                        </div>
                        <div style="font-size: 11px; color: #64748b;">
                            {{ $edu['start_date'] ?? '' }} @if(($edu['start_date'] ?? '') || ($edu['end_date'] ?? '')) - @endif {{ $edu['end_date'] ?? '' }}
                        </div>
                    </div>
                    @if (!empty($edu['field']))
                        <div style="margin-top: 2px; font-size: 11px; color: #64748b;">{{ $edu['field'] }}</div>
                    @endif
                    @if (!empty($edu['description_markdown']))
                        <div style="margin-top: 6px; font-size: 12px; color: #334155; line-height: 1.6;">
                            {!! $applyResumeFormatting($edu['description_markdown']) !!}
                        </div>
                    @endif
                </div>
            @endforeach
        </div>
    </div>
@endif

@if (count(data_get($content, 'skills', [])) || count(data_get($content, 'languages', [])))
    <div style="margin-top: 16px; border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px;">
        <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px;">
            <div>
                <div style="font-size: 12px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.18em;">
                    Skills
                </div>
                <div style="margin-top: 8px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px;">
                    @foreach (data_get($content, 'skills', []) as $group)
                        <div>
                            <div style="font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #475569;">
                                {{ $group['title'] ?? 'Skills' }}
                            </div>
                            <ul style="margin: 6px 0 0; padding: 0; list-style: none; display: grid; gap: 4px;">
                                @foreach ($group['items'] ?? [] as $skill)
                                    <li style="font-size: 11px; color: #334155;">{{ $skill['name'] ?? 'Skill' }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endforeach
                </div>
            </div>
            <div>
                <div style="font-size: 12px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.18em;">
                    Languages
                </div>
                <div style="margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px;">
                    @foreach (data_get($content, 'languages', []) as $lang)
                        <span style="font-size: 11px; padding: 4px 10px; border-radius: 999px; background: #eef2ff; color: #3730a3;">
                            {{ $lang['name'] ?? 'Language' }}@if (!empty($lang['level'])) · {{ $lang['level'] }}@endif
                        </span>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
@endif

@if (count(data_get($content, 'custom_sections', [])))
    <div style="margin-top: 16px; border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px;">
        <div style="font-size: 12px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.18em;">
            Custom Sections
        </div>
        <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 12px;">
            @foreach (data_get($content, 'custom_sections', []) as $section)
                <div>
                    <div style="font-size: 12px; font-weight: 600; color: #0f172a;">{{ $section['title'] ?? 'Section' }}</div>
                    @foreach ($section['items'] ?? [] as $item)
                        <div style="margin-top: 6px;">
                            <div style="font-size: 11px; color: #64748b;">
                                {{ $item['label'] ?? 'Item' }}
                                @if (!empty($item['start_date']) || !empty($item['end_date']))
                                    <span> ({{ $item['start_date'] ?? '' }} - {{ $item['end_date'] ?? '' }})</span>
                                @endif
                            </div>
                            @if (!empty($item['description_markdown']))
                                <div style="margin-top: 4px; font-size: 12px; color: #334155; line-height: 1.6;">
                                    {!! nl2br(e($item['description_markdown'])) !!}
                                </div>
                            @endif
                        </div>
                    @endforeach
                </div>
            @endforeach
        </div>
    </div>
@endif
