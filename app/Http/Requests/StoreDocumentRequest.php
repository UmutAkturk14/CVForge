<?php

namespace App\Http\Requests;

use App\Models\Document;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'string', Rule::in(Document::types())],
            'title' => ['required', 'string', 'max:255'],
            'status' => ['sometimes', 'string', Rule::in(Document::statuses())],
            'template_key' => ['nullable', 'string', 'max:255'],
            'content' => ['sometimes', 'array'], // allow empty on create if you want
        ];
    }
}
