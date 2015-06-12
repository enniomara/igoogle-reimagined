// Gruntfile with the configuration of grunt-express and grunt-open. No livereload yet!
module.exports = function(grunt) {

  // Load Grunt tasks declared in the package.json file
  require('matchdep').filter('grunt-*').forEach(grunt.loadNpmTasks);

  // Configure Grunt
  grunt.initConfig({

    // grunt-express will serve the files from the folders listed in `bases`
    // on specified `port` and `hostname`
    express: {
      all: {
        options: {
          port: 9000,
          hostname: "0.0.0.0",
          bases: [__dirname], // Replace with the directory you want the files served from
                             // Make sure you don't use `.` or `..` in the path as Express
                             // is likely to return 403 Forbidden responses if you do
                             // http://stackoverflow.com/questions/14594121/express-res-sendfile-throwing-forbidden-error
         livereload: true
        }
      }
    },
    sass: {
			dist: {
				files: {
					'assets/css/style.css' : 'assets/css/style.scss'
				},
        options: {
          style: 'expanded'
        }
			}
		},
    autoprefixer: {
      dist: {
        files: {
          'assets/css/style.css': 'assets/css/style.css'
        }
      }
    },
    watch: {
      all: {
        files: ['*', '!(./node_modules/**)'],
        options: {
          livereload: true
        }
      },
      css: {
        files: ['assets/css/*.scss'],
        tasks: ['sass', 'autoprefixer'],
        livereload: true
      },
    },


    // grunt-open will open your browser at the project's URL
    open: {
      all: {
        // Gets the port from the connect configuration
        path: 'http://localhost:<%= express.all.options.port%>'
      }
    }
  });

  // Creates the `server` task
  grunt.registerTask('server', [
    'express',
    'open',
    'watch'
  ]);
};
