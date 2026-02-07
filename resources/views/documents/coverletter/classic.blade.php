<meta name="cvforge-template" content="coverletter-classic">
<div data-template="coverletter-classic"></div>

<div class="cover-page {{ $coverSpacingClass }}" style="font-family: {{ $coverFontFamily }};">
    @if ($coverIncludeSenderHeader)
        <div class="cover-header">
            <p class="cover-name">{{ data_get($content, 'sender.full_name') ?: 'Your Name' }}</p>

            @if ($coverDateBlock && ! empty($coverDateBlock['value']))
                <div class="cover-date">
                    {{ $coverResolvePlaceholders($coverDateBlock['value'] ?? '') }}
                </div>
            @endif

            @if (count($coverContactParts))
                <div class="cover-contact" style="margin-top: 6px;">
                    @foreach ($coverContactParts as $index => $part)
                        <span>{{ $part }}</span>
                        @if ($index < count($coverContactParts) - 1)
                            <span style="color: #d1d5db;">•</span>
                        @endif
                    @endforeach
                </div>
            @endif

            @if (count($coverLinks))
                <div class="cover-contact" style="margin-top: 4px;">
                    @foreach ($coverLinks as $index => $link)
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
                        @if ($index < count($coverLinks) - 1)
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
                <div class="subject-label" style="text-align: left;">{{ $coverCopy['to'] ?? 'To' }}</div>
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
            @if ($coverIncludeMetaLine && $coverJobLine)
                <div style="margin-top: 12px; font-size: 13px; font-weight: 600; color: #111111; text-align: left;">
                    {{ $coverCopy['subject'] ?? 'Subject' }}:
                    {{ data_get($content, 'meta.job_title') ?: 'Role' }}
                    @if (data_get($content, 'meta.company_name'))
                        — {{ data_get($content, 'meta.company_name') }}
                    @endif
                </div>
            @endif
        </div>
    </div>

    <div class="cover-body">
        @foreach ($coverContentBlocks as $block)
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
                    {!! $coverRenderParagraphs(($block['type'] ?? '') === 'date' ? ($block['value'] ?? '') : ($block['markdown'] ?? '')) !!}
                </div>
                @if ($isSignature)
                    <div style="margin-top: 8px; font-size: 12pt; font-weight: 600; color: #111111;">
                        {{ data_get($content, 'sender.full_name') ?: 'Your Name' }}
                    </div>
                @endif
            </div>
        @endforeach
    </div>

    @if ($coverCustomSections->count())
        <div class="cover-custom">
            @foreach ($coverCustomSections as $section)
                <div class="cover-block">
                    <h2>{{ $section['title'] ?? 'Section' }}</h2>
                    {!! $coverRenderParagraphs($section['markdown'] ?? '') !!}
                </div>
            @endforeach
        </div>
    @endif
</div>
