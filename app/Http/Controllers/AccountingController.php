<?php

namespace App\Http\Controllers;

use App\Models\Accounting;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AccountingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Load related account so the frontend can display the account name
        $accountings = Accounting::with(['account:id,name'])->latest()->get();
        $accounts = Account::select('id', 'name')->orderBy('name')->get();
        return inertia('Reporting/Index', [
            'accountings' => $accountings,
            'accounts' => $accounts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
    
    }

    /**
     * Display the specified resource.
     */
    public function show(Accounting $accounting)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Accounting $accounting)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Accounting $accounting)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Accounting $accounting)
    {
        //
    }
}
