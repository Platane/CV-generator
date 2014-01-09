'use strict';

module.exports = function (grunt) {

    // define atomic tasks
    grunt.initConfig({

        // compile css file from scss
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: [{
                    expand: true,
                    cwd:'styles/', 
                    src: ['*.sass'],
                    dest: '.tmp/styles/css-unprefixed',
                    ext: '.css',
                }]
            }
        },

        // add vendor prefix, such as -webkit- ...
        autoprefixer: {
            multiple_files: {
                expand: true,
                flatten: true,
                src: '.tmp/styles/css-unprefixed/*.css',
                dest: 'styles/',
                ext: '.css',
            },

        },


        connect: {
          server: {
            options: {},
          }
        },

        watch: {
          options: {
            livereload: 4864
          },
          html: {
            files: ['*.html'],
          },
          js: {
            files: ['scripts/*.js'],
          },
          sass: {
            options: {
              livereload: false
            },
            files: ['styles/*.sass'],
            tasks: ['sass','autoprefixer'],
          },
          css: {
            files: ['styles/*.css'],
            tasks: []
          }
        },

    });

    // load mods

    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-autoprefixer');

    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask('css', [ 
        'sass' ,
        'autoprefixer',
    ]);

    grunt.registerTask('default', ['connect', 'watch']);

};
