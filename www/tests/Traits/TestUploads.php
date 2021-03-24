<?php

namespace Tests\Traits;

use Illuminate\Http\UploadedFile;

trait TestUploads
{
    protected function assertInvalidationFile(
        $field,
        $extension,
        $maxSize,
        $rule,
        $ruleParams = []
    )
    {
        $routes = [
            [
                'method' => 'POST',
                'route' => $this->routeStore()
            ],
            [
                'method' => 'PUT',
                'route' => $this->routeUpdate()
            ],
        ];

        foreach ($routes as $route) {
            
            if ($rule == 'image') {
                $file = UploadedFile::fake()->image("$field.$extension");
            } else {
                $file = UploadedFile::fake()
                    ->create("$field.$extension")
                    ->mimeType("video/avi");
            }

            $response = $this->json($route['method'], $route['route'], [
               $field => $file
            ]);

            $this->assertInvalidationFields($response, [$field], $rule, $ruleParams);

            $file = UploadedFile::fake()
                ->create("$field.$extension")
                ->size($maxSize + 1);

            $response = $this->json($route['method'], $route['route'], [
                $field => $file
            ]);

            $this->assertInvalidationFields(
                $response,
                [$field],
                'max.file',
                ['max' => $maxSize]
            );
        }
    }
}
