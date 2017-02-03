import Jasmine from 'jasmine';

const jasmine = new Jasmine();

/* eslint-disable camelcase */
jasmine.loadConfig({
    spec_dir: 'tests/node',
    spec_files: [
        '*.spec.node.js'
    ]
});

/* eslint-enable camelcase */

jasmine.execute();
