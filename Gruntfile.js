module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            options: {
                livereload: true
            },
            files: ['public/**', 'views/**', 'models/**', 'routes/**'],
            tasks: []
        },
        express: {
            all: {
                options: {
                    port: 9000,
                    server: 'app.js',
                    hostname: 'localhost',
                    bases: ['./public'],
                    livereload: true
                }
            }
        },
        uglify: {
            options: {
                preserveComments: 'some'
            },
            build: {
                files: [{
                    expand: true,
                    src: 'public/javascripts/*.js',
                    dest: '',
                    ext: '.min.js'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express');
    grunt.registerTask('server', ['express', 'watch', 'uglify']);
};
