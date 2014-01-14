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

        clean: {
            tmp : [ 
                '.tmp' ,
                '.sass-cache',
            ],
            dist : [ 
                'dist',
            ],
        },

        //copy file
        copy: {
          js: {
            files: [
              // copy all the js files raw
              {
                expand: true,
                src:['bower_components/**/*.js','scripts/*.js','cv.json'],
                dest: 'dist/',
                filter: function(path){
                    return !path.match(/(examples|docs|test|test|src|sources)/)
                },
              },
              
            ]
          },
          html:{
            files: [
              // copy the html files
              {
                expand: true,
                src:['gen.html'],
                dest: 'dist'
              },
            ]
          },
          css:{
            files: [
              // copy the html files
              {
                expand: true,
                src:['styles/*.css'],
                dest: 'dist/',
              },
            ]
          },
          fonts: {
            files: [
              // copy font
              {
                expand: true,
                cwd:'font/',
                src:['**/*.eot','**/*.svg','**/*.ttf','**/*.woff'],
                dest: 'dist/font/'
              },
            ]
          }
        },

    });

    // load mods

    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-autoprefixer');

    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('scss', [ 
        'sass' ,
        'autoprefixer',
    ]);

     grunt.registerTask('build', [ 
        'clean',
        'sass' ,
        'autoprefixer',
        'copy'
    ]);

    grunt.registerTask('default', ['connect', 'watch']);

};
