<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DocumentControllerTest extends TestCase
{
    use RefreshDatabase;

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
                'template_key' => 'template-123',
                'content' => ['body' => 'Updated'],
            ]);

        $response->assertRedirect(route('documents.show', $document));

        $document->refresh();

        $this->assertSame('Updated Title', $document->title);
        $this->assertSame(Document::STATUS_FINAL, $document->status);
        $this->assertSame('template-123', $document->template_key);
        $this->assertSame(['body' => 'Updated'], $document->content);
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
}
