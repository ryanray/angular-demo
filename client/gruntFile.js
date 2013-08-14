module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint','concat','recess']);

  // Project configuration.
  grunt.initConfig({
    src: {
      js: ['vendor/**/*.js', 'src/main.js', 'src/**/*.js'],
      less: ['less/bootstrap.less']
    },
    targetdir: '../public',
    concat: {
      siteJS: {
        src: ['<%= src.js %>'],
        dest: '<%= targetdir %>/js/app.js'
      }
    },
    recess: {
      min: {
        files: {
          '<%= targetdir %>/css/bootstrap.min.css': ['<%= src.less %>'] },
        options: {
          compress: true
        }
      }
    },
    watch: {
      scripts: {
        files: ['<%= src.js %>'],
        tasks: 'concat'
      }
    },
    jshint:{
      files:['gruntFile.js', 'src/**/*.js'],
      options:{
        globals:{}
      }
    }
  });

};
