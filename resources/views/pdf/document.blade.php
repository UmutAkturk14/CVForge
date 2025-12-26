<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $document->title ?? 'Document' }}</title>
    <style>
        :root {
            --muted: #4a4a4a;
            --border: #d9d9d9;
        }
        * {
            box-sizing: border-box;
        }
        body {
            margin: 0;
            padding: 32px 28px;
            font-family: {{ $font === 'Times New Roman' ? '"Times New Roman", Times, serif' : ($font === 'Montserrat' ? '"Montserrat", "Helvetica Neue", Arial, sans-serif' : 'Garamond, "Times New Roman", serif') }};
            background: #ffffff;
            color: #111;
        }
        h1, h2, h3, h4, h5, h6 {
            margin: 0;
            padding: 0;
        }
        .page {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .muted {
            color: var(--muted);
        }
        .section {
            margin-top: 18px;
            padding-top: 14px;
            border-top: 1px solid var(--border);
        }
        .section-heading {
            text-align: center;
            font-size: 13px;
            letter-spacing: 0.18em;
            font-weight: 700;
            margin-bottom: 12px;
        }
        .leader {
            border-bottom: 1px dotted var(--border);
            flex: 1;
            margin: 0 10px;
            height: 12px;
        }
        .row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
        .label {
            font-size: 12px;
            color: #1f1f1f;
        }
        .value {
            font-size: 12px;
            color: #1f1f1f;
        }
        .grid-2 {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px 16px;
        }
        .summary {
            text-align: center;
            font-size: 12px;
            line-height: 1.6;
            color: #2b2b2b;
        }
        .title-lg {
            text-align: center;
            font-size: 26px;
            letter-spacing: 0.05em;
            font-weight: 700;
            margin-bottom: 4px;
        }
        .subtitle {
            text-align: center;
            font-size: 12px;
            letter-spacing: 0.18em;
            font-weight: 700;
            margin-bottom: 6px;
        }
        .meta-line {
            margin-top: 4px;
            text-align: center;
            font-size: 12px;
            color: #2d2d2d;
        }
    </style>
</head>
<body>
<div class="page">
    @if ($document->type === \App\Models\Document::TYPE_RESUME)
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
                    {!! nl2br(e(data_get($content, 'profile.summary_markdown'))) !!}
                </div>
            </div>
        @endif

        @if (count(data_get($content, 'links', [])))
            <div class="section">
                <div class="section-heading">LINKS</div>
                <div class="grid-2">
                    @foreach (data_get($content, 'links', []) as $link)
                        @php
                            $label = $link['label'] ?? 'Link';
                            $url = $link['url'] ?? null;
                        @endphp
                        <div class="row" style="font-size: 12px;">
                            @if ($url)
                                <a href="{{ $url }}" style="color: #1f1f1f; text-decoration: none; font-weight: 600;">
                                    {{ $label }}
                                </a>
                            @else
                                <span class="label">{{ $label }}</span>
                            @endif
                            <span class="leader"></span>
                            <span class="value"></span>
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
                                    {!! nl2br(e($exp['description_markdown'])) !!}
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
                                    {!! nl2br(e($edu['description_markdown'])) !!}
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
    @else
        <div>
            <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 6px;">
                {{ data_get($content, 'sender.full_name') ?? 'Your Name' }}
            </h1>
            <p class="small">
                {{ data_get($content, 'sender.email') }} @if(data_get($content, 'sender.phone')) · {{ data_get($content, 'sender.phone') }} @endif
                @if(data_get($content, 'sender.location')) · {{ data_get($content, 'sender.location') }} @endif
            </p>
        </div>

        @foreach (data_get($content, 'blocks', []) as $block)
            @if (!empty($block['enabled']))
                <div class="block">
                    @if (($block['type'] ?? '') !== 'date')
                        <div class="section-title" style="border-bottom: 1px solid transparent; padding-bottom: 2px;">
                            {{ ucfirst($block['type'] ?? '') }}
                        </div>
                    @endif
                    <div class="muted" style="font-size: 14px;">
                        {!! nl2br(e($block['markdown'] ?? $block['value'] ?? '')) !!}
                    </div>
                </div>
            @endif
        @endforeach

        @foreach (data_get($content, 'custom_sections', []) as $section)
            @if (!empty($section['enabled']))
                <div class="block">
                    <div class="section-title">{{ $section['title'] ?? 'Section' }}</div>
                    <div class="muted" style="font-size: 14px;">
                        {!! nl2br(e($section['markdown'] ?? '')) !!}
                    </div>
                </div>
            @endif
        @endforeach
    @endif
</div>
</body>
</html>
