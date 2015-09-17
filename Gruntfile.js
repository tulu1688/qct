module.exports = function(grunt){
    grunt.initConfig({
        pkg:grunt.file.readJSON('package.json'),

        watch:{
            options:{livereload:true},
            files:['public/**','views/**','models/**','routes/**'],
            tasks:[]
        },
        express:{
            all:{
                options:{
		    port: 3001,
                    server:'app.js',
                    hostname:'localhost',
                    bases:['./public'],
                    livereload:true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express');
    grunt.registerTask('server',['express','watch']);
};
