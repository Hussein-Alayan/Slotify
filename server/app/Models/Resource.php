<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Resource extends Model
{
    use HasFactory;
    protected $fillable = [
        'business_id',
        'type',
        'name',
        'role',
        'special_skills',
        'availability',
        'is_absent',
        'absence_reason',
        'absence_start',
        'absence_end',
    ];

    protected $casts = [
        'availability' => 'array',
        'is_absent' => 'boolean',
        'absence_start' => 'datetime',
        'absence_end' => 'datetime',
    ];

    // Absence tracking methods
    public function markAbsent(string $reason = null, $startTime = null, $endTime = null): void
    {
        $this->update([
            'is_absent' => true,
            'absence_reason' => $reason,
            'absence_start' => $startTime ?? now(),
            'absence_end' => $endTime,
        ]);
    }

    public function markPresent(): void
    {
        $this->update([
            'is_absent' => false,
            'absence_reason' => null,
            'absence_start' => null,
            'absence_end' => null,
        ]);
    }

    public function isAbsent(): bool
    {
        return $this->is_absent;
    }

    public function isAbsentDuring($startTime, $endTime): bool
    {
        if (!$this->is_absent) {
            return false;
        }

        $absenceStart = $this->absence_start;
        $absenceEnd = $this->absence_end;

        // If no end time specified, staff is absent indefinitely
        if (!$absenceEnd) {
            return $absenceStart <= $endTime;
        }

        // Check if the given time range overlaps with absence period
        return $absenceStart < $endTime && $absenceEnd > $startTime;
    }

    // Query scopes
    public function scopeAbsent($query)
    {
        return $query->where('is_absent', true);
    }

    public function scopePresent($query)
    {
        return $query->where('is_absent', false);
    }

    public function scopeAvailableStaff($query)
    {
        return $query->where('type', 'staff')->where('is_absent', false);
    }

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
    
    public function services()
    {
        return $this->belongsToMany(Service::class);
    }
}
