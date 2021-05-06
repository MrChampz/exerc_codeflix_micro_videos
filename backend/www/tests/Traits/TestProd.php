<?php

namespace Tests\Traits;

trait TestProd
{
    protected function skipTestIfNotProd($message = '')
    {
        if (!$this->isTestingProd()) {
            $msg = $message !== '' ? $message : 'Teste de produção';
            $this->markTestSkipped($msg);
        }
    }

    protected function isTestingProd()
    {
        return env('TESTING_PROD') !== false;
    }
}