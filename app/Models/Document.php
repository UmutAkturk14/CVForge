<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use HasFactory, SoftDeletes;

    public const TYPE_RESUME = 'resume';

    public const TYPE_COVER_LETTER = 'cover_letter';

    public const TEMPLATE_CLASSIC = 'classic';

    public const TEMPLATE_MODERN = 'modern';

    public const STATUS_DRAFT = 'draft';

    public const STATUS_FINAL = 'final';

    public const STATUS_ARCHIVED = 'archived';

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'status',
        'template_key',
        'content',
    ];

    protected $casts = [
        'content' => 'array',
    ];

    public static function types(): array
    {
        return [self::TYPE_RESUME, self::TYPE_COVER_LETTER];
    }

    public static function statuses(): array
    {
        return [self::STATUS_DRAFT, self::STATUS_FINAL, self::STATUS_ARCHIVED];
    }

    public static function templates(): array
    {
        return [self::TEMPLATE_CLASSIC, self::TEMPLATE_MODERN];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
