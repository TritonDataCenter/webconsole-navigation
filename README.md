# webconsole-navigation

[![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0) [![Build Status](https://secure.travis-ci.org/joyent/webconsole-navigation.svg)](http://travis-ci.org/joyent/webconsole-navigation)


## Table of Contents

* [Setup](#setup)
* [Usage](#Usage)

## Setup

Run `./setup.sh` to generate the local `.env` file for use with docker.

Update the `categories.js` and `datacenters.js` in the data folder to reflect the correct list of available services.


## Usage

The service can be installed and started on Triton using:

`triton-compose up -d`

or locally with

`docker-compose -f local-compose.yml up -d`
