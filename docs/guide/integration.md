---
title: Integration
section: User Guide
description: Generate test coverage reports with [nyc]({{ site.data.urls.nyc }}) and perform continuous integration with [Travis CI]({{ site.data.urls.travis }}).
order: D
---

# {{ page.title }}

spooning supports a modern toolchain by playing nicely with [nyc][nyc] and [Travis CI][travis].

## Required Configuration

Ensure that the "test" script is defined in your __package.json__ file.

If you've been following the convention set forth in [Running Tests][RunningTests], it should look like this:

    "scripts": {
        "test": "node test/run.js"
    }

or if using [spooning-cli][cli]:

    "scripts": {
        "test": "spoon 'test/**/*.test.js'"
    }
    
At this point you should be able to run your tests with the following command:

    npm test


<div class="note" markdown="1">
However you run your tests, the process should __exit with a non-zero code__ if any tests
failed (or if other errors were encountered).
If you are using [spooning-cli]({{ site.data.urls.cli }})
or your `run.js` script uses the provided `exit` callback, there is nothing else you have to do.
</div>

  
## Test Coverage Reports

Install [nyc][nyc] as a dev dependency to generate coverage reports for your tests:

    npm install -D nyc
    
Define a "cover" script in your __package.json__ file:

    "scripts": {
        "cover": "nyc npm test"
    }

At this point you should be able to generate a test coverage report with the following command:

    npm run cover
    

## Continuous Integration

[Travis CI][travis] calls `npm test` by default for node projects and only requires that the command exits with a non-zero code
to indicate one or more tests failed so spooning is supported with no additional configuration.

## Next Chapter

Continue to [Customization][Customization] for examples of how to customize the output and implement custom
[`Reporter`][Reporter] objects.



[Customization]: {{ site.data.urls.Customization }}

[Reporter]: {{ site.data.urls.Reporter }}

[RunningTests]: {{ site.data.urls.RunningTests }}

[api]: {{ site.data.urls.api }}

[cli]: {{ site.data.urls.cli }}

[travis]: {{ site.data.urls.travis }}

[nyc]: {{ site.data.urls.nyc }}