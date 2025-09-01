<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
    $accounts = Account::orderByDesc('id')->paginate(11);
        return Inertia::render('Accounts/Index', [
            'accounts' => $accounts,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
    return Inertia::render('Accounts/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|boolean',
            'reff' => 'required|string',
        ]);

        // Create account respecting fillable and set status explicitly if not fillable
        $account = new Account([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'reff' => $validated['reff'] ?? null,
            'user_id' => auth()->id(),
        ]);
        
        $account->status = (bool) $validated['status'];
        $account->save();

        return redirect()->route('accounts.index')->with('success', 'Account created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Account $account)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Account $account)
    {
        return Inertia::render('Accounts/Edit', [
            'account' => $account,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Account $account)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|boolean',
            'reff' => 'required|string',
        ]);

        $account->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'status' => $validated['status'],
            'reff' => $validated['reff'],
        ]);

        return redirect()->route('accounts.index')->with('success', 'Account updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Account $account)
    {
    $account->delete();

    return redirect()->route('accounts.index')->with('success', 'Account deleted successfully.');
    }
}
