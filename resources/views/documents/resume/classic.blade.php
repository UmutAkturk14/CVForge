<meta name="cvforge-template" content="resume-classic">
<div data-template="resume-classic"></div>
<div class="title-lg">
    {{ data_get($content, 'profile.first_name') }} {{ data_get($content, 'profile.last_name') }}
</div>
<div class="subtitle">
    {{ data_get($content, 'profile.headline') }}
</div>
@if (data_get($content, 'profile.location'))
    <div class="meta-line">{{ data_get($content, 'profile.location') }}</div>
@endif
<div class="meta-line" style="display: flex; justify-content: space-between; gap: 16px; font-weight: 600;">
    <span>{{ data_get($content, 'profile.phone') }}</span>
    <span>{{ data_get($content, 'profile.email') }}</span>
</div>

@if (data_get($content, 'profile.summary_markdown'))
    <div class="section">
        <div class="section-heading">PROFILE</div>
        <div class="summary">
            {!! $applyResumeFormatting(data_get($content, 'profile.summary_markdown')) !!}
        </div>
    </div>
@endif

@if (count(data_get($content, 'links', [])))
    <div class="section">
        <div class="section-heading">LINKS</div>
        <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; text-align: center;">
            @foreach (data_get($content, 'links', []) as $link)
                @php
                    $label = $link['label'] ?? 'Link';
                    $url = $link['url'] ?? null;
                @endphp
                <div style="font-size: 12px;">
                    @if ($url)
                        <a href="{{ $url }}" style="color: #1f1f1f; text-decoration: underline; font-weight: 600;">
                            {{ $label }}
                        </a>
                    @else
                        <span class="label">{{ $label }}</span>
                    @endif
                </div>
            @endforeach
        </div>
    </div>
@endif

@if (count(data_get($content, 'experience', [])))
    <div class="section">
        <div class="section-heading">EXPERIENCE</div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
            @foreach (data_get($content, 'experience', []) as $exp)
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <div class="row">
                        <span class="label" style="font-weight: 700; font-size: 13px;">
                            {{ $exp['role'] ?? 'Role' }}
                        </span>
                        <span class="value" style="font-size: 11px; letter-spacing: 0.05em;">
                            @php
                                $start = $exp['start_date'] ?? '';
                                $end = ($exp['is_current'] ?? false) ? 'Present' : ($exp['end_date'] ?? '');
                            @endphp
                            {{ $start }} @if($start || $end) - @endif {{ $end }}
                        </span>
                    </div>
                    <div class="row">
                        <span class="label">{{ $exp['company'] ?? 'Company' }}</span>
                        <span class="leader"></span>
                        <span class="value" style="font-size: 11px;">{{ $exp['location'] ?? '' }}</span>
                    </div>
                    @if (!empty($exp['description_markdown']))
                        <div class="muted" style="font-size: 12px; line-height: 1.6;">
                            {!! $applyResumeFormatting($exp['description_markdown']) !!}
                        </div>
                    @endif
                </div>
            @endforeach
        </div>
    </div>
@endif

@if (count(data_get($content, 'education', [])))
    <div class="section">
        <div class="section-heading">EDUCATION</div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
            @foreach (data_get($content, 'education', []) as $edu)
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <div class="row">
                        <span class="label" style="font-weight: 700; font-size: 13px;">
                            {{ $edu['degree'] ?? 'Degree' }}
                        </span>
                        <span class="value" style="font-size: 11px; letter-spacing: 0.05em;">
                            {{ $edu['start_date'] ?? '' }} @if(($edu['start_date'] ?? '') || ($edu['end_date'] ?? '')) - @endif {{ $edu['end_date'] ?? '' }}
                        </span>
                    </div>
                    <div class="row">
                        <span class="label">{{ $edu['school'] ?? 'School' }}</span>
                        <span class="leader"></span>
                        <span class="value" style="font-size: 11px;">{{ $edu['location'] ?? '' }}</span>
                    </div>
                    @if (!empty($edu['description_markdown']))
                        <div class="muted" style="font-size: 12px; line-height: 1.6;">
                            {!! $applyResumeFormatting($edu['description_markdown']) !!}
                        </div>
                    @endif
                </div>
            @endforeach
        </div>
    </div>
@endif

@if (count(data_get($content, 'skills', [])))
    <div class="section">
        <div class="section-heading">SKILLS</div>
        <div class="grid-2">
            @foreach (data_get($content, 'skills', []) as $skill)
                <div class="row" style="font-size: 12px;">
                    <span class="label">{{ $skill['name'] ?? 'Skill' }}</span>
                    <span class="leader"></span>
                    <span class="value">{{ $skill['level'] ?? '' }}</span>
                </div>
            @endforeach
        </div>
    </div>
@endif

@if (count(data_get($content, 'languages', [])))
    <div class="section">
        <div class="section-heading">LANGUAGES</div>
        <div class="grid-2">
            @foreach (data_get($content, 'languages', []) as $lang)
                <div class="row" style="font-size: 12px;">
                    <span class="label">{{ $lang['name'] ?? 'Language' }}</span>
                    <span class="leader"></span>
                    <span class="value">{{ $lang['level'] ?? '' }}</span>
                </div>
            @endforeach
        </div>
    </div>
@endif

@if (count(data_get($content, 'custom_sections', [])))
    <div class="section">
        <div class="section-heading">ADDITIONAL</div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
            @foreach (data_get($content, 'custom_sections', []) as $section)
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <p style="font-weight: 700; font-size: 13px; margin: 0;">{{ $section['title'] ?? 'Section' }}</p>
                    @foreach ($section['items'] ?? [] as $item)
                        <div class="row" style="font-size: 12px;">
                            <span class="label">{{ $item['label'] ?? 'Item' }}</span>
                            <span class="leader"></span>
                            @if (!empty($item['start_date']) || !empty($item['end_date']))
                                <span class="value" style="font-size: 11px; letter-spacing: 0.05em;">
                                    {{ $item['start_date'] ?? '' }} - {{ $item['end_date'] ?? '' }}
                                </span>
                            @else
                                <span class="value"></span>
                            @endif
                        </div>
                        @if (!empty($item['description_markdown']))
                            <div class="muted" style="font-size: 12px; line-height: 1.6;">
                                {!! nl2br(e($item['description_markdown'])) !!}
                            </div>
                        @endif
                    @endforeach
                </div>
            @endforeach
        </div>
    </div>
@endif
