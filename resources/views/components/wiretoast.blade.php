@props([
    'theme' => null,
    'mode' => null,
    'defaultPosition' => 'top-right',
    'assets' => false,
])

@once
    @if($assets)
        <link rel="stylesheet" href="{{ asset('vendor/wiretoast/css/wiretoast.css') }}">
        <script src="{{ asset('vendor/wiretoast/js/wiretoast.js') }}" defer></script>
    @endif
@endonce

<div id="wt-root"
    @if($theme) data-wt-theme="{{ $theme }}" @endif
    @if($mode) data-wt-theme-mode="{{ $mode }}" @endif
    data-wt-default-position="{{ $defaultPosition }}">
    @foreach (['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right', 'center'] as $pos)
        <div class="wt-container" data-wt-position="{{ $pos }}"></div>
    @endforeach
</div>
