<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $document->title ?? 'Document' }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Great+Vibes&family=Imperial+Script&family=Mrs+Saint+Delafield&family=WindSong:wght@400;500&family=Yesteryear&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
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
        .cover-page {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 8mm 18mm 14mm;
            background: #ffffff;
            color: #111111;
            display: flex;
            flex-direction: column;
            gap: 4mm;
        }
        .cover-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 10px;
        }
        .cover-name {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.02em;
        }
        .cover-contact {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            font-size: 14px;
            color: #111111;
        }
        .cover-separator {
            margin-top: 6px;
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: center;
        }
        .cover-separator .line {
            height: 1px;
            width: 100%;
            background: #e5e7eb;
        }
        .cover-meta {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 16px;
        }
        .cover-meta .recipient {
            font-size: 14px;
            line-height: 1.55;
        }
        .cover-meta .subject-label {
            font-size: 13px;
            letter-spacing: 0.18em;
            font-weight: 600;
            text-transform: uppercase;
            color: #4b5563;
            text-align: right;
        }
        .cover-meta .subject {
            margin-top: 4px;
            font-size: 15px;
            font-weight: 700;
            line-height: 1.4;
            text-align: right;
        }
        .cover-body {
            font-size: 15px;
            line-height: 1.75;
            color: #111111;
            text-align: justify;
        }
        .cover-block + .cover-block { margin-top: 14px; }
        .cover-paragraph { margin: 0; }
        .spacing-compact .cover-paragraph + .cover-paragraph { margin-top: 10px; }
        .spacing-normal .cover-paragraph + .cover-paragraph { margin-top: 14px; }
        .spacing-relaxed .cover-paragraph + .cover-paragraph { margin-top: 18px; }
        .cover-custom {
            margin-top: 18px;
            border-top: 1px solid #e5e7eb;
            padding-top: 12px;
            font-size: 14px;
            line-height: 1.65;
        }
        .cover-custom h2 {
            margin: 0 0 6px;
            font-size: 14px;
            font-weight: 700;
        }
        .cover-signature {
            margin-top: auto;
            padding-top: 20px;
            font-size: 14px;
            line-height: 1.6;
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
        @php
            $escapeHtml = static function (string $value): string {
                return str_replace(
                    ['&', '<', '>', '"', "'"],
                    ['&amp;', '&lt;', '&gt;', '&quot;', '&#039;'],
                    $value,
                );
            };
            $applyResumeFormatting = static function (?string $value) use ($escapeHtml): string {
                if ($value === null) {
                    return '';
                }

                $html = $escapeHtml($value);
                $html = preg_replace('/\*\*(.+?)\*\*/s', '<strong>$1</strong>', $html);
                $html = preg_replace('/_(.+?)_/s', '<em>$1</em>', $html);
                $html = preg_replace('/\[(.+?)\]\((.+?)\)/s', '<a href="$2">$1</a>', $html);

                return nl2br($html);
            };
        @endphp

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
    @else
        @php
            $layout = data_get($content, 'layout', []);
            $includeSenderHeader = array_key_exists('include_sender_header', $layout) ? (bool) data_get($layout, 'include_sender_header') : true;
            $includeMetaLine = array_key_exists('include_meta_line', $layout) ? (bool) data_get($layout, 'include_meta_line') : true;
            $spacingClass = match (data_get($layout, 'paragraph_spacing', 'normal')) {
                'compact' => 'spacing-compact',
                'relaxed' => 'spacing-relaxed',
                default => 'spacing-normal',
            };
            $placeholderMap = [
                'company_name' => data_get($content, 'meta.company_name', ''),
                'job_title' => data_get($content, 'meta.job_title', ''),
                'recipient_name' => data_get($content, 'meta.recipient_name', ''),
                'recipient_title' => data_get($content, 'meta.recipient_title', ''),
                'full_name' => data_get($content, 'sender.full_name', ''),
            ];
            $escapeHtml = static function (string $value): string {
                return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
            };
            $resolvePlaceholders = static function (?string $text) use ($placeholderMap): string {
                if ($text === null) {
                    return '';
                }

                return preg_replace_callback('/{{\\s*(.+?)\\s*}}/', static function ($matches) use ($placeholderMap): string {
                    $key = $matches[1] ?? '';

                    return $placeholderMap[$key] ?? '';
                }, $text);
            };
            $applyFormatting = static function (string $value) use ($escapeHtml): string {
                $html = $escapeHtml($value);
                $html = preg_replace('/\*\*(.+?)\*\*/s', '<strong>$1</strong>', $html);
                $html = preg_replace('/_(.+?)_/s', '<em>$1</em>', $html);
                $html = preg_replace('/\[(.+?)\]\((.+?)\)/s', '<a href="$2">$1</a>', $html);

                return nl2br($html);
            };
            $renderParagraphs = static function (?string $text) use ($resolvePlaceholders, $applyFormatting): string {
                $resolved = trim($resolvePlaceholders($text));
                $paragraphs = preg_split("/\n\s*\n/", $resolved) ?: [];
                $html = '';

                foreach ($paragraphs as $paragraph) {
                    if (trim($paragraph) === '') {
                        continue;
                    }

                    $escaped = $applyFormatting(trim($paragraph));
                    $html .= "<p class=\"cover-paragraph\">{$escaped}</p>";
                }

                return $html;
            };
            $blocks = collect(data_get($content, 'blocks', []))
                ->filter(fn ($block) => ! empty($block['enabled']))
                ->map(function ($block) {
                    $value = trim((string) ($block['markdown'] ?? ''));
                    $lower = strtolower($value);
                    $legacyPatterns = [
                        '/^dear\s/i',
                        '/i\s*am\s*writing\s*to\s*apply\s*for\s*the.*role\s+at/i',
                        '/i[’\']m\s*writing\s*to\s*apply\s*for\s*the.*role\s+at/i',
                        '/apply\s*for\s*the.*role\s+at/i',
                        '/thank\s*you\s*for\s*your\s*time\s*and\s*consideration/i',
                        '/^sincerely[,\s]*/i',
                        '/^\*{0,2}\s*\{\{\s*full_name\s*\}\}\s*\*{0,2}\s*$/i',
                        '/^\*{0,2}\s*your name\s*\*{0,2}\s*$/i',
                        '/#position/i',
                        '/#company/i',
                    ];

                    foreach ($legacyPatterns as $pattern) {
                        if (preg_match($pattern, $lower)) {
                            $block['markdown'] = '';
                            break;
                        }
                    }

                    return $block;
                })
                ->values();
            $dateBlock = $blocks->firstWhere('type', 'date');
            $contentBlocks = $blocks->filter(fn ($block) => ($block['type'] ?? '') !== 'date')->values();
            $customSections = collect(data_get($content, 'custom_sections', []))
                ->filter(fn ($section) => ! empty($section['enabled']))
                ->values();
            $jobLineParts = array_filter([
                data_get($content, 'meta.job_title'),
                data_get($content, 'meta.company_name'),
            ]);
            $jobLine = implode(' • ', $jobLineParts);
            $contactParts = array_values(array_filter([
                data_get($content, 'sender.email'),
                data_get($content, 'sender.phone'),
                data_get($content, 'sender.location'),
            ]));
            $fontFamily = $font === 'Times New Roman'
                ? '"Times New Roman", Times, serif'
                : ($font === 'Montserrat'
                    ? '"Montserrat", "Helvetica Neue", Arial, sans-serif'
                    : 'Garamond, "Times New Roman", serif');
            $language = data_get($content, 'language', 'en');
            $coverCopy = [
                'en' => ['to' => 'To', 'subject' => 'Subject'],
                'de' => ['to' => 'An', 'subject' => 'Betreff'],
                'fr' => ['to' => 'À', 'subject' => 'Objet'],
            ];
            $copy = $coverCopy[$language] ?? $coverCopy['en'];
        @endphp

        <div class="cover-page {{ $spacingClass }}" style="font-family: {{ $fontFamily }};">
            @if ($includeSenderHeader)
                <div class="cover-header">
                    <p class="cover-name">{{ data_get($content, 'sender.full_name') ?: 'Your Name' }}</p>

                    @if ($dateBlock && ! empty($dateBlock['value']))
                        <div class="cover-date">
                            {{ $resolvePlaceholders($dateBlock['value'] ?? '') }}
                        </div>
                    @endif

                    @if (count($contactParts))
                        <div class="cover-contact" style="margin-top: 6px;">
                            @foreach ($contactParts as $index => $part)
                                <span>{{ $part }}</span>
                                @if ($index < count($contactParts) - 1)
                                    <span style="color: #d1d5db;">•</span>
                                @endif
                            @endforeach
                        </div>
                    @endif
                    @php
                        $links = array_values(array_filter(data_get($content, 'sender.links', []), function ($link) {
                            return ! empty($link['label']) || ! empty($link['url']);
                        }));
                    @endphp
                    @if (count($links))
                        <div class="cover-contact" style="margin-top: 4px;">
                            @foreach ($links as $index => $link)
                                @php
                                    $label = $link['label'] ?? ($link['url'] ?? 'Link');
                                @endphp
                                @if (! empty($link['url']))
                                    <a
                                        href="{{ $link['url'] }}"
                                        style="text-decoration: underline; color: #111111;"
                                    >
                                        {{ $label }}
                                    </a>
                                @else
                                    <span style="text-decoration: underline;">{{ $label }}</span>
                                @endif
                                @if ($index < count($links) - 1)
                                    <span style="color: #d1d5db; margin: 0 6px;">•</span>
                                @endif
                            @endforeach
                        </div>
                    @endif

                    <div class="cover-separator">
                        <div class="line"></div>
                    </div>
                </div>
            @endif

            <div class="cover-meta">
                <div class="recipient" style="flex: 1;">
                    @if (data_get($content, 'meta.recipient_name') || data_get($content, 'meta.recipient_title') || data_get($content, 'meta.company_name'))
                        <div class="subject-label" style="text-align: left;">{{ $copy['to'] ?? 'To' }}</div>
                        <div style="margin-top: 6px; display: flex; flex-direction: column; gap: 3px;">
                            @if (data_get($content, 'meta.recipient_name'))
                                <div style="font-weight: 700; color: #111111;">
                                    {{ data_get($content, 'meta.recipient_name') }}
                                </div>
                            @endif
                            @if (data_get($content, 'meta.recipient_title'))
                                <div>{{ data_get($content, 'meta.recipient_title') }}</div>
                            @endif
                            @if (data_get($content, 'meta.company_name'))
                                <div style="font-weight: 700; color: #111111;">
                                    {{ data_get($content, 'meta.company_name') }}
                                </div>
                            @endif
                        </div>
                    @endif
                    @if ($includeMetaLine && $jobLine)
                        <div style="margin-top: 12px; font-size: 13px; font-weight: 600; color: #111111; text-align: left;">
                            {{ $copy['subject'] ?? 'Subject' }}:
                            {{ data_get($content, 'meta.job_title') ?: 'Role' }}
                            @if (data_get($content, 'meta.company_name'))
                                — {{ data_get($content, 'meta.company_name') }}
                            @endif
                        </div>
                    @endif
                </div>
            </div>

            <div class="cover-body">
                @foreach ($contentBlocks as $block)
                    @php
                        $isSignature = ($block['type'] ?? '') === 'signature';
                        $font = $isSignature ? (data_get($content, 'signature_font') ?: 'Alex Brush') : null;
                        $style = [];
                        if ($font) {
                            $style[] = 'font-family: "'.$font.'", "Alex Brush", "Great Vibes", "Imperial Script", "Mrs Saint Delafield", "WindSong", "Yesteryear", cursive';
                        }
                        if ($isSignature) {
                            $style[] = 'font-size: 32pt';
                            $style[] = 'line-height: 1.2';
                            $style[] = 'font-weight: 400';
                        }
                        $styleAttr = implode('; ', $style);
                    @endphp
                    <div class="cover-block" style="{{ $isSignature ? 'margin-top: 16px;' : '' }}">
                        <div style="{{ $styleAttr }}">
                            {!! $renderParagraphs(($block['type'] ?? '') === 'date' ? ($block['value'] ?? '') : ($block['markdown'] ?? '')) !!}
                        </div>
                        @if ($isSignature)
                            <div style="margin-top: 8px; font-size: 12pt; font-weight: 600; color: #111111;">
                                {{ data_get($content, 'sender.full_name') ?: 'Your Name' }}
                            </div>
                        @endif
                    </div>
                @endforeach
            </div>

            @if ($customSections->count())
                <div class="cover-custom">
                    @foreach ($customSections as $section)
                        <div class="cover-block">
                            <h2>{{ $section['title'] ?? 'Section' }}</h2>
                            {!! $renderParagraphs($section['markdown'] ?? '') !!}
                        </div>
                    @endforeach
                </div>
            @endif

        </div>
    @endif
</div>
</body>
</html>
