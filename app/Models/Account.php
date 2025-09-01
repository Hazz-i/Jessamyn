<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    protected $table = 'account';
    protected $fillable = [
        'user_id',
        'description',
        'status',
        'reff',
        'name',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function accounting()
    {
        return $this->hasMany(Accounting::class);
    }
}
