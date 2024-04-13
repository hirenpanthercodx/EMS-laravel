<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Calendar extends Model
{
    use HasFactory;
    protected $table = 'calendar';

    protected $fillable = [
        'employee_id',
        'reason',
        'start',
        'end'
    ];
}
