<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDocumentRequest;
use App\Http\Requests\UpdateDocumentRequest;
use App\Models\Document;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Browsershot\Browsershot;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

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

    /**
     * Export a document as a PDF using the current template and font choices.
     */
    public function export(Document $document): BinaryFileResponse
    {
        $this->authorize('view', $document);

        if (! in_array($document->type, [Document::TYPE_RESUME, Document::TYPE_COVER_LETTER], true)) {
            abort(400, 'Unsupported document type for export.');
        }

        $content = $document->content ?? [];
        $template = $document->template_key ?? 'classic';

        $html = View::make('pdf.document', [
            'document' => $document,
            'content' => $content,
            'template' => $template,
            'font' => $content['font'] ?? 'Garamond',
        ])->render();

        $directory = storage_path('app/tmp');
        if (! is_dir($directory) && ! mkdir($directory, 0755, true) && ! is_dir($directory)) {
            throw new FileNotFoundException('Unable to create export directory.');
        }

        $fileName = Str::slug($document->title ?: 'document').'.pdf';
        $outputPath = $directory.'/'.$fileName;

        Browsershot::html($html)
            ->format('A4')
            ->showBackground()
            ->margins(10, 12, 10, 12)
            ->noSandbox()
            ->save($outputPath);

        return response()->download($outputPath, $fileName)->deleteFileAfterSend();
    }
}
