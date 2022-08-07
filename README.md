# nip

## Norm Integration Plan

`nip` is an integration test framework for web resources. It is a handy tool for
defining 

1. a sequence of testing URLs
1. validation after each call
1. extracting values out from the HTTP response as test variables
1. polling before making the next call.

### Setup

1. install `nodejs`: find an [installer](https://nodejs.org/en/download/).
1. install `yarn`. `npm install --global yarn`
1. check out the source code.
1. `cd nip; yarn install --ignore-engines` 

### Package

run `yarn run package` and then `nip` executable with be created. (for MacOS)

|    command | description                                                 |
| ---------: | ----------------------------------------------------------- |
| `nip list` | to list all the data file.                                   |
|  `nip run` | to execute data file. `nip run --help` for more information. |

The schema for the data file is a [schema.json](./schema.json)
### Development

`ts-node src/cli.ts run -f sample.json`

run unit test `yarn run coverage`.
