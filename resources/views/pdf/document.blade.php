<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $document->title ?? 'Document' }}</title>
    <style>
        :root {
            --muted: #444;
            --border: #e5e5e5;
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
        .section-title {
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 0.02em;
            padding-bottom: 6px;
            border-bottom: 1px solid var(--border);
            margin-bottom: 10px;
        }
        .muted {
            color: var(--muted);
        }
        .chip {
            display: inline-block;
            margin-right: 10px;
            font-size: 12px;
            color: #222;
        }
        .block {
            margin-bottom: 14px;
        }
        .two-col {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            flex-wrap: wrap;
        }
        .small {
            font-size: 12px;
            color: var(--muted);
        }
        ul {
            margin: 4px 0 0 18px;
            padding: 0;
        }
        p {
            margin: 0 0 4px 0;
            line-height: 1.5;
        }
    </style>
</head>
<body>
<div class="page">
    @if ($document->type === \App\Models\Document::TYPE_RESUME)
        <div>
            <div class="two-col">
                <div>
                    <h1 style="font-size: 26px; font-weight: 700;">
                        {{ data_get($content, 'profile.first_name') }} {{ data_get($content, 'profile.last_name') }}
                    </h1>
                    <p class="muted" style="font-size: 14px; margin-top: 2px;">
                        {{ data_get($content, 'profile.headline') }}
                    </p>
                </div>
                <div class="small" style="text-align: right;">
                    @if (data_get($content, 'profile.email'))<div>{{ data_get($content, 'profile.email') }}</div>@endif
                    @if (data_get($content, 'profile.phone'))<div>{{ data_get($content, 'profile.phone') }}</div>@endif
                    @if (data_get($content, 'profile.location'))<div>{{ data_get($content, 'profile.location') }}</div>@endif
                    @if (data_get($content, 'profile.website'))<div>{{ data_get($content, 'profile.website') }}</div>@endif
                </div>
            </div>
            @if (data_get($content, 'profile.summary_markdown'))
                <div style="margin-top: 10px;">
                    <div class="section-title">Summary</div>
                    {!! nl2br(e(data_get($content, 'profile.summary_markdown'))) !!}
                </div>
            @endif
        </div>

        @if (count(data_get($content, 'links', [])))
            <div>
                <div class="section-title">Links</div>
                <div>
                    @foreach (data_get($content, 'links', []) as $link)
                        <span class="chip">{{ $link['label'] ?? 'Link' }}@if(!empty($link['url'])) · {{ $link['url'] }} @endif</span>
                    @endforeach
                </div>
            </div>
        @endif

        @if (count(data_get($content, 'experience', [])))
            <div>
                <div class="section-title">Experience</div>
                @foreach (data_get($content, 'experience', []) as $exp)
                    <div class="block">
                        <div class="two-col">
                            <div>
                                <p style="font-weight: 600; font-size: 14px;">
                                    {{ $exp['role'] ?? 'Role' }} · {{ $exp['company'] ?? 'Company' }}
                                </p>
                                @if (!empty($exp['location'])) <p class="small">{{ $exp['location'] }}</p> @endif
                            </div>
                            <p class="small">
                                @php
                                    $start = $exp['start_date'] ?? null;
                                    $end = $exp['is_current'] ?? false ? 'Present' : ($exp['end_date'] ?? null);
                                @endphp
                                {{ $start }} @if($start || $end) - @endif {{ $end }}
                            </p>
                        </div>
                        @if (!empty($exp['description_markdown']))
                            <div class="muted" style="font-size: 13px;">
                                {!! nl2br(e($exp['description_markdown'])) !!}
                            </div>
                        @endif
                    </div>
                @endforeach
            </div>
        @endif

        @if (count(data_get($content, 'education', [])))
            <div>
                <div class="section-title">Education</div>
                @foreach (data_get($content, 'education', []) as $edu)
                    <div class="block">
                        <div class="two-col">
                            <div>
                                <p style="font-weight: 600; font-size: 14px;">
                                    {{ $edu['degree'] ?? 'Degree' }} · {{ $edu['school'] ?? 'School' }}
                                </p>
                                @if (!empty($edu['field'])) <p class="small">{{ $edu['field'] }}</p> @endif
                            </div>
                            <p class="small">
                                {{ $edu['start_date'] ?? '' }} @if(($edu['start_date'] ?? null) || ($edu['end_date'] ?? null)) - @endif {{ $edu['end_date'] ?? '' }}
                            </p>
                        </div>
                        @if (!empty($edu['description_markdown']))
                            <div class="muted" style="font-size: 13px;">
                                {!! nl2br(e($edu['description_markdown'])) !!}
                            </div>
                        @endif
                    </div>
                @endforeach
            </div>
        @endif

        @if (count(data_get($content, 'skills', [])) || count(data_get($content, 'languages', [])))
            <div class="two-col" style="align-items: flex-start;">
                <div style="flex:1;">
                    <div class="section-title">Skills</div>
                    <div>
                        @foreach (data_get($content, 'skills', []) as $skill)
                            <span class="chip">{{ $skill['name'] ?? 'Skill' }}@if(isset($skill['level'])) · {{ $skill['level'] }}/5 @endif</span>
                        @endforeach
                    </div>
                </div>
                <div style="flex:1;">
                    <div class="section-title">Languages</div>
                    <div>
                        @foreach (data_get($content, 'languages', []) as $lang)
                            <span class="chip">{{ $lang['name'] ?? 'Language' }}@if(!empty($lang['level'])) · {{ $lang['level'] }} @endif</span>
                        @endforeach
                    </div>
                </div>
            </div>
        @endif

        @if (count(data_get($content, 'custom_sections', [])))
            <div>
                <div class="section-title">Additional</div>
                @foreach (data_get($content, 'custom_sections', []) as $section)
                    <div class="block">
                        <p style="font-weight: 600; font-size: 14px;">{{ $section['title'] ?? 'Section' }}</p>
                        @foreach ($section['items'] ?? [] as $item)
                            <p class="muted" style="font-size: 13px; margin-top:4px;">
                                {{ $item['label'] ?? 'Item' }}
                                @if (!empty($item['start_date']) || !empty($item['end_date']))
                                    ({{ $item['start_date'] ?? '' }} - {{ $item['end_date'] ?? '' }})
                                @endif
                            </p>
                            @if (!empty($item['description_markdown']))
                                <div class="muted" style="font-size: 13px;">
                                    {!! nl2br(e($item['description_markdown'])) !!}
                                </div>
                            @endif
                        @endforeach
                    </div>
                @endforeach
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
