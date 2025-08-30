<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;
    protected $table = 'product';
    
    protected $fillable = [
        'name',
        'image',
        'sub_image',
        'category',
        'description',
        'is_active',
        'user_id',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function productVariants()
    {
        return $this->hasMany(ProductVariant::class);
    }
}
