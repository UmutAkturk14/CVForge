<meta name="cvforge-template" content="coverletter-modern">
<div data-template="coverletter-modern"></div>

<div class="cover-page {{ $coverSpacingClass }}" style="font-family: {{ $coverFontFamily }}; padding: 12mm 20mm 16mm;">
    <div style="border: 1px solid #e2e8f0; border-radius: 18px; padding: 18px; background: #f8fafc;">
        <div style="display: flex; justify-content: space-between; gap: 16px; align-items: flex-start;">
            <div style="flex: 1;">
                <div style="font-size: 26px; font-weight: 700; color: #0f172a;">
                    {{ data_get($content, 'sender.full_name') ?: 'Your Name' }}
                </div>
                @if (count($coverContactParts))
                    <div style="margin-top: 6px; display: flex; flex-wrap: wrap; gap: 10px; font-size: 12px; color: #475569;">
                        @foreach ($coverContactParts as $part)
                            <span>{{ $part }}</span>
                        @endforeach
                    </div>
                @endif
                @if (count($coverLinks))
                    <div style="margin-top: 6px; display: flex; flex-wrap: wrap; gap: 8px; font-size: 12px;">
                        @foreach ($coverLinks as $link)
                            @php
                                $label = $link['label'] ?? ($link['url'] ?? 'Link');
                            @endphp
                            @if (! empty($link['url']))
                                <a href="{{ $link['url'] }}" style="color: #1d4ed8; text-decoration: underline;">
                                    {{ $label }}
                                </a>
                            @else
                                <span style="color: #1d4ed8; text-decoration: underline;">{{ $label }}</span>
                            @endif
                        @endforeach
                    </div>
                @endif
            </div>
            <div style="min-width: 160px; text-align: right;">
                @if ($coverDateBlock && ! empty($coverDateBlock['value']))
                    <div style="font-size: 11px; letter-spacing: 0.2em; font-weight: 700; color: #64748b; text-transform: uppercase;">
                        Date
                    </div>
                    <div style="margin-top: 4px; font-size: 12px; color: #0f172a;">
                        {{ $coverResolvePlaceholders($coverDateBlock['value'] ?? '') }}
                    </div>
                @endif
                @if ($coverIncludeMetaLine && $coverJobLine)
                    <div style="margin-top: 10px; font-size: 12px; font-weight: 600; color: #0f172a;">
                        {{ $coverCopy['subject'] ?? 'Subject' }}:
                        {{ data_get($content, 'meta.job_title') ?: 'Role' }}
                        @if (data_get($content, 'meta.company_name'))
                            — {{ data_get($content, 'meta.company_name') }}
                        @endif
                    </div>
                @endif
            </div>
        </div>
    </div>

    <div style="margin-top: 18px; display: grid; grid-template-columns: 1fr 1.2fr; gap: 24px;">
        <div>
            <div style="font-size: 11px; letter-spacing: 0.2em; font-weight: 700; color: #64748b; text-transform: uppercase;">
                {{ $coverCopy['to'] ?? 'To' }}
            </div>
            <div style="margin-top: 6px; font-size: 12px; color: #0f172a; line-height: 1.6;">
                @if (data_get($content, 'meta.recipient_name'))
                    <div style="font-weight: 700;">{{ data_get($content, 'meta.recipient_name') }}</div>
                @endif
                @if (data_get($content, 'meta.recipient_title'))
                    <div>{{ data_get($content, 'meta.recipient_title') }}</div>
                @endif
                @if (data_get($content, 'meta.company_name'))
                    <div style="font-weight: 700;">{{ data_get($content, 'meta.company_name') }}</div>
                @endif
            </div>
            @if ($coverIncludeMetaLine && ! $coverJobLine)
                <div style="margin-top: 10px; font-size: 12px; font-weight: 600; color: #0f172a;">
                    {{ $coverCopy['subject'] ?? 'Subject' }}: {{ data_get($content, 'meta.job_title') ?: 'Role' }}
                </div>
            @endif
        </div>
        <div style="border-left: 2px solid #e2e8f0; padding-left: 18px;">
            <div class="cover-body" style="font-size: 12.5px; line-height: 1.75; color: #0f172a;">
                @foreach ($coverContentBlocks as $block)
                    @php
                        $isSignature = ($block['type'] ?? '') === 'signature';
                        $font = $isSignature ? (data_get($content, 'signature_font') ?: 'Alex Brush') : null;
                        $style = [];
                        if ($font) {
                            $style[] = 'font-family: "'.$font.'", "Alex Brush", "Great Vibes", "Imperial Script", "Mrs Saint Delafield", "WindSong", "Yesteryear", cursive';
                        }
                        if ($isSignature) {
                            $style[] = 'font-size: 30pt';
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
                <div class="cover-custom" style="margin-top: 16px; border-top: 1px solid #e2e8f0; padding-top: 12px;">
                    @foreach ($coverCustomSections as $section)
                        <div class="cover-block" style="margin-top: 10px;">
                            <h2 style="margin: 0 0 6px; font-size: 12px; font-weight: 700; color: #0f172a;">
                                {{ $section['title'] ?? 'Section' }}
                            </h2>
                            {!! $coverRenderParagraphs($section['markdown'] ?? '') !!}
                        </div>
                    @endforeach
                </div>
            @endif
        </div>
    </div>
</div>
