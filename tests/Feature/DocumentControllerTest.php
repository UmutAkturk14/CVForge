<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia as Assert;
use Mockery;
use Tests\TestCase;

class DocumentControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Mockery::close();

        parent::tearDown();
    }

    protected function extractFileNameFromResponse(TestResponse $response): string
    {
        $disposition = $response->headers->get('content-disposition') ?? '';

        if (preg_match('/filename="?([^"]+)"?/', $disposition, $matches) !== 1) {
            return '';
        }

        return $matches[1];
    }

    public function test_index_displays_only_authenticated_users_documents(): void
    {
        $user = User::factory()->create();
        $ownDocument = Document::query()->create([
            'user_id' => $user->id,
            'type' => Document::TYPE_RESUME,
            'title' => 'My Resume',
            'status' => Document::STATUS_DRAFT,
            'content' => ['summary' => 'Hello'],
        ]);
        Document::query()->create([
            'user_id' => User::factory()->create()->id,
            'type' => Document::TYPE_COVER_LETTER,
            'title' => 'Other',
            'status' => Document::STATUS_DRAFT,
            'content' => [],
        ]);

        $response = $this
            ->actingAs($user)
            ->get(route('documents.index'));

        $response->assertOk();

        $response->assertInertia(function (Assert $page) use ($ownDocument): void {
            $page
                ->component('Documents/Index')
                ->has('documents.data', 1, function (Assert $document) use ($ownDocument): void {
                    $document
                        ->where('id', $ownDocument->id)
                        ->where('title', $ownDocument->title)
                        ->where('type', $ownDocument->type)
                        ->where('status', $ownDocument->status)
                        ->etc();
                });
        });
    }

    public function test_resumes_index_filters_by_resume_type(): void
    {
        $user = User::factory()->create();
        $resume = Document::query()->create([
            'user_id' => $user->id,
            'type' => Document::TYPE_RESUME,
            'title' => 'Resume Draft',
            'status' => Document::STATUS_DRAFT,
            'content' => [],
        ]);
        Document::query()->create([
            'user_id' => $user->id,
            'type' => Document::TYPE_COVER_LETTER,
            'title' => 'Cover Letter',
            'status' => Document::STATUS_DRAFT,
            'content' => [],
        ]);

        $response = $this
            ->actingAs($user)
            ->get(route('resumes.index'));

        $response->assertOk();

        $response->assertInertia(function (Assert $page) use ($resume): void {
            $page
                ->component('Resumes/Index')
                ->where('filters.type', Document::TYPE_RESUME)
                ->has('documents.data', 1, function (Assert $document) use ($resume): void {
                    $document
                        ->where('id', $resume->id)
                        ->where('type', Document::TYPE_RESUME)
                        ->etc();
                });
        });
    }

    public function test_cover_letters_index_filters_by_cover_letter_type(): void
    {
        $user = User::factory()->create();
        Document::query()->create([
            'user_id' => $user->id,
            'type' => Document::TYPE_RESUME,
            'title' => 'Resume Draft',
            'status' => Document::STATUS_DRAFT,
            'content' => [],
        ]);
        $coverLetter = Document::query()->create([
            'user_id' => $user->id,
            'type' => Document::TYPE_COVER_LETTER,
            'title' => 'Cover Letter',
            'status' => Document::STATUS_DRAFT,
            'content' => [],
        ]);

        $response = $this
            ->actingAs($user)
            ->get(route('coverletters.index'));

        $response->assertOk();

        $response->assertInertia(function (Assert $page) use ($coverLetter): void {
            $page
                ->component('CoverLetters/Index')
                ->where('filters.type', Document::TYPE_COVER_LETTER)
                ->has('documents.data', 1, function (Assert $document) use ($coverLetter): void {
                    $document
                        ->where('id', $coverLetter->id)
                        ->where('type', Document::TYPE_COVER_LETTER)
                        ->etc();
                });
        });
    }

    public function test_store_creates_document_and_redirects_to_show(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post(route('documents.store'), [
                'type' => Document::TYPE_RESUME,
                'title' => 'New Resume',
            ]);

        $document = Document::query()->where('user_id', $user->id)->first();

        $this->assertNotNull($document);

        $response->assertRedirect(route('documents.show', $document));
        $this->assertSame(Document::STATUS_DRAFT, $document->status);
    }

    public function test_store_can_import_existing_document_content(): void
    {
        $user = User::factory()->create();
        $source = Document::query()->create([
            'user_id' => $user->id,
            'type' => Document::TYPE_RESUME,
            'title' => 'Source',
            'status' => Document::STATUS_DRAFT,
            'template_key' => 'classic',
            'content' => ['body' => 'Hello'],
        ]);

        $response = $this
            ->actingAs($user)
            ->post(route('documents.store'), [
                'type' => Document::TYPE_RESUME,
                'title' => 'Imported',
                'import_from' => $source->id,
            ]);

        $created = Document::query()
            ->where('user_id', $user->id)
            ->where('title', 'Imported')
            ->first();

        $this->assertNotNull($created);
        $this->assertSame(['body' => 'Hello'], $created->content);
        $this->assertSame('classic', $created->template_key);
        $response->assertRedirect(route('documents.show', $created));
    }

    public function test_store_rejects_invalid_template_key(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post(route('documents.store'), [
                'type' => Document::TYPE_RESUME,
                'title' => 'New Resume',
                'template_key' => 'unsupported-template',
            ]);

        $response->assertSessionHasErrors('template_key');
    }

    public function test_update_applies_changes_and_redirects_back(): void
    {
        $user = User::factory()->create();
        $document = Document::query()->create([
            'user_id' => $user->id,
            'type' => Document::TYPE_RESUME,
            'title' => 'Original',
            'status' => Document::STATUS_DRAFT,
            'content' => [],
        ]);

        $response = $this
            ->from(route('documents.show', $document))
            ->actingAs($user)
            ->patch(route('documents.update', $document), [
                'title' => 'Updated Title',
                'status' => Document::STATUS_FINAL,
                'template_key' => Document::TEMPLATE_CLASSIC,
                'content' => ['body' => 'Updated'],
            ]);

        $response->assertRedirect(route('documents.show', $document));

        $document->refresh();

        $this->assertSame('Updated Title', $document->title);
        $this->assertSame(Document::STATUS_FINAL, $document->status);
        $this->assertSame(Document::TEMPLATE_CLASSIC, $document->template_key);
        $this->assertSame(['body' => 'Updated'], $document->content);
    }

    public function test_update_rejects_invalid_template_key(): void
    {
        $user = User::factory()->create();
        $document = Document::query()->create([
            'user_id' => $user->id,
            'type' => Document::TYPE_RESUME,
            'title' => 'Original',
            'status' => Document::STATUS_DRAFT,
            'content' => [],
        ]);

        $response = $this
            ->from(route('documents.show', $document))
            ->actingAs($user)
            ->patch(route('documents.update', $document), [
                'template_key' => 'unsupported-template',
            ]);

        $response->assertSessionHasErrors('template_key');
    }

    public function test_destroy_soft_deletes_document_and_redirects(): void
    {
        $user = User::factory()->create();
        $document = Document::query()->create([
            'user_id' => $user->id,
            'type' => Document::TYPE_COVER_LETTER,
            'title' => 'To Remove',
            'status' => Document::STATUS_DRAFT,
            'content' => [],
        ]);

        $response = $this
            ->actingAs($user)
            ->delete(route('documents.destroy', $document));

        $response->assertRedirect(route('documents.index'));
        $this->assertSoftDeleted($document);
    }

    public function test_export_generates_cover_letter_pdf(): void
    {
        $user = User::factory()->create();
        $document = Document::query()->create([
            'user_id' => $user->id,
            'type' => Document::TYPE_COVER_LETTER,
            'title' => 'Cover Letter',
            'status' => Document::STATUS_DRAFT,
            'template_key' => 'classic',
            'content' => [
                'meta' => [
                    'company_name' => 'ACME',
                    'job_title' => 'Engineer',
                ],
                'sender' => [
                    'full_name' => 'Ada Lovelace',
                    'email' => 'ada@example.com',
                    'phone' => '123',
                    'location' => 'Earth',
                ],
                'layout' => [
                    'include_sender_header' => true,
                    'include_meta_line' => true,
                    'paragraph_spacing' => 'normal',
                ],
                'blocks' => [
                    ['type' => 'date', 'enabled' => true, 'value' => 'Jan 1, 2025'],
                    ['type' => 'opening', 'enabled' => true, 'markdown' => 'Hello {{company_name}}'],
                ],
                'custom_sections' => [],
            ],
        ]);

        $mock = Mockery::mock('alias:Spatie\\Browsershot\\Browsershot');
        $mock->shouldReceive('html')->twice()->with(Mockery::type('string'))->andReturnSelf();
        $mock->shouldReceive('evaluate')->once()->with(Mockery::type('string'))->andReturn('210x297');
        $mock->shouldReceive('showBackground')->once()->andReturnSelf();
        $mock->shouldReceive('margins')->once()->with(10, 12, 10, 12)->andReturnSelf();
        $mock->shouldReceive('noSandbox')->twice()->andReturnSelf();
        $mock->shouldReceive('paperSize')->once()->with(210.0, 297.0, 'px')->andReturnSelf();
        $mock->shouldReceive('save')->once()->with(Mockery::type('string'))->andReturnUsing(
            static function (string $path): void {
                file_put_contents($path, 'pdf');
            },
        );

        $response = $this
            ->actingAs($user)
            ->get(route('documents.export', $document));

        $response->assertOk();

        $fileName = $this->extractFileNameFromResponse($response);
        $outputPath = storage_path('app/tmp/'.$fileName);

        $this->assertNotSame('', $fileName);
        $this->assertFileExists($outputPath);
        $this->assertStringContainsString($fileName, $response->headers->get('content-disposition') ?? '');

        @unlink($outputPath);
    }

    public function test_export_generates_resume_pdf_with_formatting(): void
    {
        $user = User::factory()->create();
        $document = Document::query()->create([
            'user_id' => $user->id,
            'type' => Document::TYPE_RESUME,
            'title' => 'Resume',
            'status' => Document::STATUS_DRAFT,
            'template_key' => 'classic',
            'content' => [
                'profile' => [
                    'first_name' => 'Ada',
                    'last_name' => 'Lovelace',
                    'summary_markdown' => '**Bold** and _italic_ and [Link](https://example.com)',
                ],
                'links' => [
                    [
                        'label' => 'Portfolio',
                        'url' => 'https://example.com',
                    ],
                ],
                'experience' => [
                    [
                        'company' => 'ACME',
                        'role' => 'Engineer',
                        'description_markdown' => 'Did **work** and _iterate_.',
                    ],
                ],
                'education' => [
                    [
                        'school' => 'University',
                        'degree' => 'BSc',
                        'description_markdown' => 'Studied _math_ and **science**.',
                    ],
                ],
            ],
        ]);

        $mock = Mockery::mock('alias:Spatie\\Browsershot\\Browsershot');
        $mock->shouldReceive('html')->once()->with(Mockery::on(
            static function (string $html): bool {
                return str_contains($html, '<strong>Bold</strong>')
                    && str_contains($html, '<em>italic</em>')
                    && str_contains($html, '<a href="https://example.com">Link</a>')
                    && str_contains($html, 'href="https://example.com"')
                    && str_contains($html, 'Portfolio')
                    && str_contains($html, 'text-decoration: underline')
                    && str_contains($html, '<strong>work</strong>')
                    && str_contains($html, '<em>iterate</em>')
                    && str_contains($html, '<em>math</em>')
                    && str_contains($html, '<strong>science</strong>');
            },
        ))->andReturnSelf();
        $mock->shouldReceive('html')->once()->with(Mockery::type('string'))->andReturnSelf();
        $mock->shouldReceive('evaluate')->once()->with(Mockery::type('string'))->andReturn('980');
        $mock->shouldReceive('format')->once()->with('A4')->andReturnSelf();
        $mock->shouldReceive('setOption')->once()->with('scale', Mockery::type('float'))->andReturnSelf();
        $mock->shouldReceive('showBackground')->once()->andReturnSelf();
        $mock->shouldReceive('margins')->once()->with(10, 12, 10, 12)->andReturnSelf();
        $mock->shouldReceive('noSandbox')->twice()->andReturnSelf();
        $mock->shouldReceive('save')->once()->with(Mockery::type('string'))->andReturnUsing(
            static function (string $path): void {
                file_put_contents($path, 'pdf');
            },
        );

        $response = $this
            ->actingAs($user)
            ->get(route('documents.export', $document));

        $response->assertOk();

        $fileName = $this->extractFileNameFromResponse($response);
        $outputPath = storage_path('app/tmp/'.$fileName);

        $this->assertNotSame('', $fileName);
        $this->assertFileExists($outputPath);
        $this->assertStringContainsString($fileName, $response->headers->get('content-disposition') ?? '');

        @unlink($outputPath);
    }
}
