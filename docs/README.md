# spooning Website

The [website](https://adamjarret.github.io/spooning) for
[spooning](https://github.com/adamjarret/spooning) is generated with
[jekyll](https://jekyllrb.com/docs/github-pages/).

## Getting Started

Follow these instructions to locally preview the site.
The CWD is assumed to be the **docs** directory.

### Install Prerequisites

* [ruby](https://www.ruby-lang.org) _(version 2.2.5 or later)_
* bundler (`gem install bundler`)

### Install Dependencies

	bundle install

## Development

Start the jekyll server (shortcut for `bundle exec jekyll serve`):

	make
	
Build the jekyll site to **_site** directory (shortcut for `bundle exec jekyll build`):

	make build

Update dependencies:

	bundle update

## Publishing

The site is hosted on GitHub pages, so changes to files in the **docs** directory will be live when pushed to master.

## Built With

* [jekyll](https://jekyllrb.com)
* [github-pages](https://github.com/github/pages-gem)

## Contributing

Fork the repo and submit a pull request.

## Author

[Adam Jarret](https://atj.me)

## License

This project is licensed under the _MIT License_.
See the [LICENSE.txt](https://github.com/adamjarret/spooning/blob/master/LICENSE.txt) file for details.