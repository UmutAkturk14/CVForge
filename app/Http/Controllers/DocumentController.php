<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDocumentRequest;
use App\Http\Requests\UpdateDocumentRequest;
use App\Models\Document;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DocumentController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Document::class);

        $filters = $request->only(['type', 'status']);

        $docs = Document::query()
            ->where('user_id', $request->user()->id)
            ->when($filters['type'] ?? null, fn ($query, string $type) => $query->where('type', $type))
            ->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->latest('updated_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Documents/Index', [
            'documents' => $docs,
            'filters' => array_filter($filters),
        ]);
    }

    public function store(StoreDocumentRequest $request): RedirectResponse
    {
        $this->authorize('create', Document::class);

        $document = Document::create([
            'user_id' => $request->user()->id,
            'type' => $request->validated('type'),
            'title' => $request->validated('title'),
            'status' => $request->validated('status', Document::STATUS_DRAFT),
            'template_key' => $request->validated('template_key'),
            'content' => $request->validated('content', []),
        ]);

        return redirect()
            ->route('documents.show', $document)
            ->with('success', 'Document created.');
    }

    public function show(Document $document): Response
    {
        $this->authorize('view', $document);

        return Inertia::render('Documents/Edit', [
            'document' => $document,
        ]);
    }

    public function update(UpdateDocumentRequest $request, Document $document): RedirectResponse
    {
        $this->authorize('update', $document);

        $document->update($request->validated());

        return redirect()
            ->back()
            ->with('success', 'Document updated.');
    }

    public function destroy(Document $document): RedirectResponse
    {
        $this->authorize('delete', $document);

        $document->delete();

        return redirect()
            ->route('documents.index')
            ->with('success', 'Document deleted.');
    }
}
