---
title: Laravel 13 Core Features & Eloquent Attributes
tags: [laravel, php, eloquent, attributes]
created: 2026-07-13
---

# Laravel 13 Core Features & Eloquent Attributes

## TL;DR

Laravel 13 (released March 2026) shifts Eloquent configuration to native PHP Attributes (`#[Fillable]`, `#[Hidden]`), mandates PHP 8.3+, and integrates Laravel PAO for AI-optimized terminal outputs.

## Core Concept

Laravel 13 introduces a declarative, attribute-first architecture. Instead of defining configuration variables (like `$fillable`, `$hidden`) within the Eloquent model class body, developers define them as class-level attributes. Key components:

- **PHP Attributes on Eloquent Models**: Native PHP 8.3 attributes (`#[Fillable]`, `#[Hidden]`, `#[Table]`, etc.) are used for cleaner configuration.
- **PHP 8.3 Minimum**: Standardizes on modern PHP 8.3 features like typed constants.
- **Laravel PAO (PHP Agent-Optimized Output)**: A zero-config package (`laravel/pao`) that reformats commands and test outputs into compact JSON formats when run in AI agent environments.

## Concrete Examples

### Eloquent Model using Attributes

Instead of the traditional protected properties:

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Foundation\Auth\User as Authenticatable;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    // Class body is cleaner, focusing only on behavior
}
```

## Related Notes

- [[000_Online_Store_MOC]]
