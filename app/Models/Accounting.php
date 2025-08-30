<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Accounting extends Model
{
    protected $table = 'accounting';
    protected $fillable = [
        'user_id',
        'account_id',
        'transaction_id',
        'description',
        'debit',
        'credit',
        'image'
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
