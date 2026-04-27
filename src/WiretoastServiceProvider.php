<?php

namespace EduLazaro\Wiretoast;

use Illuminate\Support\ServiceProvider;
use Illuminate\View\Compilers\BladeCompiler;

class WiretoastServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'wiretoast');

        $this->publishes([
            __DIR__ . '/../resources/views' => resource_path('views/vendor/wiretoast'),
        ], 'wiretoast-views');

        $this->publishes([
            __DIR__ . '/../resources/css' => public_path('vendor/wiretoast/css'),
            __DIR__ . '/../resources/js'  => public_path('vendor/wiretoast/js'),
        ], 'wiretoast-assets');

        $this->publishes([
            __DIR__ . '/../resources/css'   => public_path('vendor/wiretoast/css'),
            __DIR__ . '/../resources/js'    => public_path('vendor/wiretoast/js'),
            __DIR__ . '/../resources/views' => resource_path('views/vendor/wiretoast'),
        ], 'wiretoast');

        $this->callAfterResolving(BladeCompiler::class, function (BladeCompiler $blade) {
            $blade->component('wiretoast::components.wiretoast', 'wiretoast');
        });

        $this->registerLivewireMacro();
    }

    protected function registerLivewireMacro(): void
    {
        if (! class_exists(\Livewire\Component::class)) {
            return;
        }

        \Livewire\Component::macro('notify', function (mixed $message, string $type = 'success', mixed $third = false) {
            $payload = ['type' => $type];

            if (is_array($message)) {
                if (isset($message['title'])) {
                    $payload['title'] = $message['title'];
                }
                $payload['message'] = $message['message'] ?? '';
            } else {
                $payload['message'] = $message;
            }

            if (is_array($third)) {
                foreach (['title', 'group', 'position', 'timeout', 'progress'] as $key) {
                    if (array_key_exists($key, $third)) {
                        $payload[$key] = $third[$key];
                    }
                }
            } elseif (is_bool($third)) {
                $payload['group'] = $third;
            }

            $this->dispatch('notify', ...$payload);
        });
    }
}
