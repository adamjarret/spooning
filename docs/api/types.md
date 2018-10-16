---
title: Types
section: API
description: See examples of object shapes used by spooning.
type: jsNamespace
---

# TapStyle

    {
        Plan: '',   // "N..N" text
        Ok: '',     // "ok" text
        NotOk: '',  // "not ok" text
        Idx: '',    // test number (determined by order finished)
        Name: '',   // test name
        Log: '',    // diagnostic messages
        Reset: ''   // reset formatting
    }


# RunStartInfo

    {
        count: 1  // number of tests that have been enqueued
    }

# RunEndInfo

    {
        total: 1,   // number of tests that ran
        passed: 1,  // number of tests that passed
        exitCode: 0 // appropriate process exit code (0 or 1)
    }

# TestResultInfo

    {
        idx: 1,                       // test number (determined by order finished)
        name: 'Should do the thing',  // test name 
        error: null,                  // Error if failed or falsy if passed
        diagnosticMessage: ''         // diagnostic message that may be provided by the test
    }
