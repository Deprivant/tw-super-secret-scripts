module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        less: {
            production: {
                options: {
                    compress: true,
                },
                /*  files: {
                    'tmp/twseb.min.css': 'src/TW-SEB/src/css/style.less', // destination file and source file
                }, */

                files: [
                    {
                        src: [
                            'src/TW-SEB/src/css/style.less',
                            'src/TW-MS/src/css/style.less',
                            'src/TW-JEI/src/css/style.less',
                            'src/TW-GB/src/css/style.less',
                            'src/css/style.less',
                        ],
                        dest: 'tmp/styles.min.css',
                    },
                ],
            },
            goldenJobsBug: {
                options: {
                    compress: true,
                },
                files: {
                    'tmp/tw-febb.min.css': 'src/TW-FEBB/css/style.less',
                },
            },
        },

        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: [
                    'src/TW-SEB/src/script.js',
                    'src/TW-SV/src/script.js',
                    'src/TW-MS/src/script.js',
                    'src/TW-FEBB/src/script.js',
                    'src/TW-JEI/src/script.js',
                    'src/TW-GB/src/script.js',
                    'src/index.js',
                ],
                dest: 'tmp/index.js',
            },
        },

        replace: {
            dist: {
                options: {
                    patterns: [
                        {
                            match: 'styles',
                            replacement:
                                '<%= grunt.file.read("tmp/styles.min.css") %>',
                        },
                        {
                            match: 'scriptVersion',
                            replacement: '<%= pkg.version %>',
                        },
                        {
                            match: 'homepage',
                            replacement: '<%= pkg.homepage %>',
                        },
                        {
                            match: 'svgMaskIcon',
                            replacement:
                                '<%= grunt.file.read("src/images/mask.svg") %>',
                        },

                        // TW MARKET SCANNER

                        {
                            match: 'beepSound',
                            replacement:
                                '<%= grunt.file.read("src/TW-MS/src/sound/beep") %>',
                        },
                        {
                            match: 'svgRadarIcon',
                            replacement:
                                '<%= grunt.file.read("src/TW-MS/src/images/radar.svg") %>',
                        },

                        // FIX EXPORT BUTTON BUG (Gold Jobs Finder)
                        {
                            match: 'twfebbStyles',
                            replacement:
                                '<%= grunt.file.read("tmp/tw-febb.min.css") %>',
                        },

                        // TW Gift Bomber

                        {
                            match: 'twgbStyles',
                            replacement:
                                '<%= grunt.file.read("tmp/tw-febb.min.css") %>',
                        },
                    ],
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['tmp/index.js'],
                        dest: 'tmp/',
                    },
                ],
            },
        },

        removelogging: {
            dist: {
                src: 'tmp/index.js',
                dest: 'tmp/index-clean.js',

                options: {
                    // see below for options. this is optional.
                },
            },
        },

        uglify: {
            my_target: {
                options: {
                    compress: false,
                    mangle: false,
                    beautify: true,
                    banner:
                        '/**\n' +
                        ' * Name: <%= pkg.name %>\n' +
                        ' * Version: <%= pkg.version %>\n' +
                        ' * Desription: <%= pkg.description %>\n' +
                        ' * Author: <%= pkg.author %>\n' +
                        ' * Build: <%= grunt.template.today("dd-mm-yyyy") %>\n' +
                        ' * Homepage: <%= pkg.homepage %>\n' +
                        ' */\n',
                },
                files: {
                    'dist/<%= pkg.name %>.js': ['tmp/index.js'],
                },
            },
            my_advanced_target: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= pkg.version %>, Author: <%= pkg.author %> <%= grunt.template.today("yyyy/mm/dd") %>  <%= pkg.homepage %> */ \n',
                    mangle: true,
                },
                files: {
                    'dist/<%= pkg.name %>.min.js': ['tmp/index-clean.js'],
                },
            },
        },

        clean: { build: ['tmp/*', 'tmp'] },
    });
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-remove-logging');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', [
        'less',
        'concat',
        'replace',
        'removelogging',
        'uglify',
        'clean',
    ]);
};
