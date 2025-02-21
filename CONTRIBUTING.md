# Contributing to cipherguard

## Introduction

Thank you for your interest in cipherguard. We welcome contributions from everyone, this guide is here to help you get started!

### How can you help?

There are several ways you can help out:

* Create an [issue](https://github.com/cipherguard/cipherguard/issues) on GitHub, if you have found a bug or want to propose a new feature or a change request.
* Review [enhancement or new feature requests](https://github.com/cipherguard/cipherguard/issues) and contribute to the functional or technical specifications in the issues.
* Write patches for open bug/feature issues, preferably with test cases included
* Contribute to the [documentation](https://cipherguard.com/help).
* Help design the proposed changes by editing the [styleguide](https://github.com/cipherguard/cipherguard_styleguide) or by submitting changes in the [wireframes](https://github.com/cipherguard/cipherguard_wireframes).
* Write unit test cases to help increase [test coverage](https://coveralls.io/github/cipherguard/cipherguard).
* Extend the [selenium test suite](https://github.com/cipherguard/cipherguard_selenium) for any open bug or change requests

If you have any suggestions or want to get involved in other ways feel free to get in touch with us at [contact@cipherguard.com](mailto:contact@cipherguard.com)!

### Code of Conduct

First things first, please read our [Code of Conduct](https://www.cipherguard.com/code_of_conduct).
Help us keep Cipherguard open and inclusive!

## High level guidelines

There are a few guidelines that we need contributors to follow so that we have a chance of keeping on top of things.

### Reporting a security Issue

If you've found a security related issue in Cipherguard, please don't open an issue in GitHub.
Instead contact us at security@cipherguard.com. In the spirit of responsible disclosure we ask that the reporter keep the
issue confidential until we announce it.

The cipherguard team will take the following actions:
- Try to first reproduce the issue and confirm the vulnerability.
- Acknowledge to the reporter that we’ve received the issue and are working on a fix.
- Get a fix/patch prepared and create associated automated tests.
- Prepare a post describing the vulnerability, and the possible exploits.
- Release new versions of all affected major versions.
- Prominently feature the problem in the release announcement.
- Provide credits in the release announcement to the reporter if they so desire.

### Reporting regular issues

* Make sure you have a [GitHub account](https://github.com/signup/free).
* If you are planning to start a new functionality or create a major change request, write down the functional and technical specifications first.
  * Create a document that is viewable by everyone
  * Define the problem you are trying to solve, who is impacted, why it is important, etc.
  * Present a solution. Explaining your approach gives an opportunity for other people to contribute and avoid frictions down the line.
* Submit an [issue](https://github.com/cipherguard/cipherguard/issues)
  * Check first that a similar issue does not already exist.
  * Make sure you fill in the earliest version that you know has the issue if it is a bug.
  * Clearly describe the issue including steps to reproduce when it is a bug and/or a link to the specification document
  * If applicable, allow people to visualize your proposed changes via changes to the [styleguide](https://github.com/cipherguard/cipherguard_styleguide)

### Making code changes

#### Which branch to base the work?

* Bugfix branches will be based on master.
* New features that are backwards compatible will be based on next minor release branch.
* New features or other non backwards compatible changes will go in the next major release branch.

#### Make changes locally first
* Fork the repository on GitHub.
* Create a feature branch from where you want to base your work.
  * This is usually the master branch.
  * Only target release branches if you are certain your fix must be on that
    branch.
  * To quickly create a feature branch based on master; `git branch
    feature/ID_feature_description master` then checkout the new branch with `git
    checkout feature/ID_feature_description`. Better avoid working directly on the
    `master` branch, to avoid conflicts if you pull in updates from origin.
* Make commits of logical units.

#### Before submiting changes
* Check for unnecessary whitespace with `git diff --check` before committing.
* Use descriptive commit messages and reference the #issue number.
* PHP unit test cases should continue to pass. You can run tests locally or enable [travis-ci](https://travis-ci.org/) for your fork, so all tests and codesniffs will be executed (see faq bellow).
* Selenium tests should continue to pass. See [cipherguard selenium test suite](https://github.com/cipherguard/cipherguard_selenium) (see faq bellow).
* Your work should apply the [CakePHP coding standards](http://book.cakephp.org/2.0/en/contributing/cakephp-coding-conventions.html) (see faq bellow).


#### Submitting Changes

* Push your changes to a topic branch in your fork of the repository.
* Submit a pull request to the official cipherguard repository, with the correct target branch.



# Tools & Workflow FAQ

If you are a programmer and wish to contribute / extend cipherguard, here is what you need to know.

## Prerequisite

You will need to install cipherguard locally. You can find guide on how to do this at [on the website](https://www.cipherguard.com/help/tech/install).

For testing, code styling and coverage you will also need:
- Composer https://getcomposer.org/
- Phpunit 3.7 https://phpunit.de/
- Curl http://php.net/manual/en/curl.installation.php
- PhpCS https://pear.php.net/manual/en/package.php.php-codesniffer.php
- XDebug http://xdebug.org/

## Frequently Asked Questions

### How do I check the code standards?

To run the sniffs for CakePHP coding standards, first you need to install the dev-dependencies with composer. Make sure you use the 1.* branch of the cakephp sniffs otherwise the new Cakephp3/PSR2 standards will apply. It depends on phpcs version 1.* as well and not the latest releases.
```
composer require --dev "cakephp/cakephp-codesniffer=1.*"
```

Then let phpcs where to find the cakephp sniffs
```
vendor/bin/phpcs --config-set installed_paths vendor/cakephp/cakephp-codesniffer
```

The you can run it like follow:
```
vendor/bin/phpcs --standard=CakePHP app/path/to/something
```

See also. [CakePHP coding standards](http://book.cakephp.org/2.0/en/contributing/cakephp-coding-conventions.html)

### How do I run the unit tests?

To execute the test suite, you will need to install phpunit.
The simplest way is to do it through composer.
```
composer install
```

Make sure Debug is set to at least 1 in Config/app.php
You can then go to test.php and run the tests from there.
For example: ﻿http://localhost/cipherguard/test.php


### How do I run the selenium tests?

Cipherguard is provided with a suite of selenium tests.
The selenium test suite is available in a separate project :
https://github.com/cipherguard/cipherguard_selenium


### How to regenerate the fixtures?

The fixtures are generated from the Data shell and plugins tasks. It is better you change the unit tests data tasks,
install the data set and rexport the content as fixtures.
```
./app/Console/cake install --data=unittests
./app/Console/cake data export
```

Note that the tests are tightly coupled with the data. If you change it you may need to change the tests. You can add more record safely of course.

### How to update the PHP libraries

To update the PHP libraries, go to /app, and
```
	composer install --no-dev
```
Then execute all the unit tests and selenium tests, and if everything passes it can be commited and pushed on the git repo.

### How to update the Javascript libraries
```
	npm install && npm update
	grunt lib-deploy
```
Then execute all the selenium tests, and if everything passes it can be commited and pushed on the git repo.

### How do I recompile the Javascript build?

Install grunt if it hasn't yet been installed:
```
npm install -g grunt-cli
```

Install the needed modules defined in the grunt config:
```
npm install
```

Prepare the production release:
```
grunt
```

### How to edit the CSS files?

All the less and css files of cipherguard are managed through a styleguide.
https://github.com/cipherguard/cipherguard_styleguide

You can also develop an alternative stylesheet and include it manually if you only want some styling changes for your own instance. If you want your changes to be included in an official release, you will have to submit the changes in the official styleguide.

### How to update the styleguide?

The styelguide version number is located in package.json. To deploy a new version of the styleguide, first you need to install grunt:
```
npm install -g grunt-cli
```

Install the needed modules defined in package.json
```
npm install
```

Install the styleguide
```
grunt styleguide-update
```


# Additional Resources

* [Existing issues](https://github.com/cipherguard/cipherguard/issues)
* [Development Roadmaps](https://www.cipherguard.com/roadmap)
* [General GitHub documentation](https://help.github.com/)
* [GitHub pull request documentation](https://help.github.com/send-pull-requests/)
