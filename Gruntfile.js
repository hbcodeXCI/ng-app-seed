module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({

        app_dir: './app',
        lib_dir: './lib',
        dist_dir: grunt.option('dist_dir') || './dist',

        clean: {
            options: {
                force: true
            },
            pre: {
                src: ['<%= dist_dir %>']
            },
            post: {
                src: ['<%= dist_dir %>/app-templates.js']
            }
        },

        jshint: {
            app: {
                options: {
                    globals: {
                        angular: false,
                        ol: false,
                        proj4: false,
                        moment: false
                    },
                    bitwise: true,
                    browser: true,
                    curly: true,
                    devel: true,
                    eqnull: true,
                    eqeqeq: true,
                    forin: true,
                    freeze: true,
                    immed: true,
                    jquery: true,
                    loopfunc: true,
                    noarg: true,
                    noempty: true,
                    nonew: true,
                    undef: true
                },
                src: ['<%= app_dir %>/**/*.js']
            }
        },

        copy: {
            app: {
                files: [
                    {
                        src: ['index.html', 'config.json', '*.ico'],
                        cwd: '<%= app_dir %>',
                        dest: '<%= dist_dir %>',
                        expand: true
                    },
                    {
                        src: ['**'],
                        cwd: '<%= app_dir %>/assets',
                        dest: '<%= dist_dir %>',
                        expand: true
                    }
                ]
            },
            lib: {
                files: [
                    {
                        src: ['<%= lib_dir %>/*/js/*.js'],
                        dest: '<%= dist_dir %>/js',
                        expand: true,
                        flatten: true
                    },
                    {
                        src: ['<%= lib_dir %>/*/css/*.css'],
                        dest: '<%= dist_dir %>/css',
                        expand: true,
                        flatten: true
                    },
                    {
                        src: ['<%= lib_dir %>/*/fonts/*'],
                        dest: '<%= dist_dir %>/fonts',
                        expand: true,
                        flatten: true
                    },
                    {
                        src: ['<%= lib_dir %>/*/img/*'],
                        dest: '<%= dist_dir %>/img',
                        expand: true,
                        flatten: true
                    }
                ]
            }
        },

        less: {
            app: {
                options: {
                    compress: true,
                    cleancss: true
                },
                files: {
                    '<%= dist_dir %>/css/app.css': '<%= app_dir %>/app.less'
                }
            }
        },

        html2js: {
            app: {
                options: {
                    base: '<%= app_dir %>',
                    module: 'app.templates',
                    singleModule: true,
                    htmlmin: {
                        removeComments: true,
                        collapseWhitespace: true
                    }
                },
                files: {
                    '<%= dist_dir %>/app-templates.js': '<%= app_dir %>/components/**/*.html'
                }
            }
        },

        concat: {
            app: {
                options: {
                    banner: '(function(window, angular){\'use strict\';',
                    footer: '})(window, window.angular);'
                },
                files: {
                    '<%= dist_dir %>/js/app.js': [
                        '<%= app_dir %>/app.js',
                        '<%= app_dir %>/shared/**/*.js',
                        '<%= app_dir %>/components/**/*.js',
                        '<%= dist_dir %>/app-templates.js'
                    ]
                }
            }
        },

        ngAnnotate: {
            app: {
                files: {
                    '<%= dist_dir %>/js/app.js': '<%= dist_dir %>/js/app.js'
                }
            }
        },

        uglify: {
            app: {
                files: {
                    '<%= dist_dir %>/js/app.js': '<%= dist_dir %>/js/app.js'
                }
            }
        },

        connect: {
            options: {
                port: 9000,
                base: '<%= dist_dir %>'
            },
            default: {
                options: {
                    keepalive: false
                }
            },
            keepalive: {
                options: {
                    keepalive: true
                }
            }
        },

        watch: {
            app: {
                options: {
                    spawn: false
                },
                tasks: ['update'],
                files: ['<%= app_dir %>/**']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-ng-annotate');

    grunt.registerTask('build', ['clean:pre', 'jshint', 'copy', 'less', 'html2js', 'concat', 'ngAnnotate', 'uglify', 'clean:post']);
    grunt.registerTask('serve', ['connect:keepalive']);
    grunt.registerTask('dev', ['clean:pre', 'jshint', 'copy', 'less', 'html2js', 'concat', 'clean:post', 'connect:default', 'watch']);
    grunt.registerTask('update', ['jshint:app', 'copy:app', 'less:app', 'html2js:app', 'concat:app', 'clean:post']);
};