<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDocumentRequest;
use App\Http\Requests\UpdateDocumentRequest;
use App\Models\Document;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Document::class);

        $docs = Document::query()
            ->where('user_id', $request->user()->id)
            ->latest('updated_at')
            ->paginate(20);

        return response()->json($docs);
    }

    public function store(StoreDocumentRequest $request): JsonResponse
    {
        $this->authorize('create', Document::class);

        $doc = Document::create([
            'user_id' => $request->user()->id,
            'type' => $request->validated('type'),
            'title' => $request->validated('title'),
            'status' => $request->validated('status', Document::STATUS_DRAFT),
            'template_key' => $request->validated('template_key'),
            'content' => $request->validated('content', []),
        ]);

        return response()->json($doc, 201);
    }

    public function show(Document $document): JsonResponse
    {
        $this->authorize('view', $document);

        return response()->json($document);
    }

    public function update(UpdateDocumentRequest $request, Document $document): JsonResponse
    {
        $this->authorize('update', $document);

        $document->update($request->validated());

        return response()->json($document->fresh());
    }

    public function destroy(Document $document): JsonResponse
    {
        $this->authorize('delete', $document);

        $document->delete();

        return response()->json(['deleted' => true]);
    }
}
