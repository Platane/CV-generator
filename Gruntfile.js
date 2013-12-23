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
                    src: ['styles/*.sass'], 
                    dest: 'styles/style.css', 
                }]
            }
        },

        // add vendor prefix, such as -webkit- ...
        autoprefixer: {
                multiple_files: {
                  expand: true,
                  flatten: true,
                  src: 'styles/style.css',
                  dest: 'styles',
                },
        },


        connect: {
          server: {
            options: {},
          }
        },

        watch: {
          options: {
            livereload: true,
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
