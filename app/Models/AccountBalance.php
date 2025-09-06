<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AccountBalance extends Model
{
    use HasFactory;

    protected $fillable = [
        'period_month',
        'opening_equity',
        'owner_contribution',
        'owner_draw',
        'net_income',
        'closing_equity',
        'user_id'
    ];
}
