'use strict';

var GitHub = require('./github');
var config = {
   username: 'mohkan1',
   password: 'mohkan11399', // Either your password or an authentication token if two-factor authentication is enabled
   auth: 'basic',
   repository: 'projects',
   branchName: 'master'
};
var gitHub = new GitHub(config);

/**
 * Reads the content of the file provided. Returns a promise whose resolved value is an object literal containing the
 * name (<code>filename</code> property) and the content (<code>content</code> property) of the file.
 *
 * @param {File} file The file to read
 *
 * @returns {Promise}
 */
function readFile(file) {
   return new Promise(function (resolve, reject) {
      var fileReader = new FileReader();

      fileReader.addEventListener('load', function (event) {
         var content = event.target.result;

         // Strip out the information about the mime type of the file and the encoding
         // at the beginning of the file (e.g. data:image/gif;base64,).
         content = atob(content.replace(/^(.+,)/, ''));

         resolve({
            filename: file.name,
            content: content
         });
      });

      fileReader.addEventListener('error', function (error) {
         reject(error);
      });

      fileReader.readAsDataURL(file);
   });
}

/**
 * Save the files provided on the repository with the commit title specified. Each file will be saved with
 * a different commit.
 *
 * @param {FileList} files The files to save
 * @param {string} commitTitle The commit title
 *
 * @returns {Promise}
 */
function uploadFiles(fileName, content, commitTitle) {

      return gitHub.saveFile({
         repository: gitHub.repository,
         branchName: config.branchName,
         filename: fileName,
         content: content,
         commitTitle: commitTitle
      });

}

document.querySelector('form').addEventListener('submit', function (event) {
   event.preventDefault();
   var num = 0;
   var commitTitle = document.getElementById('commit-title').value;
   var fileName = document.getElementById('fileName').value;

   var procent = ["20%", "40%", "60%", "80%", "100%"];

   var myVar = setInterval(upload, 2000);

   function upload() {

      if (num >= 5) {
        num = 0;
        alert("https://mohkan1.github.io/projects/" + fileName);
        alert("It may take 30 s to see the website");
        clearInterval(myVar);

      }else{
        uploadFiles(fileName, editor.getValue(), commitTitle)
           .then(function() {
             alert(procent[num] + " has been uploaded to the server");
              num++;

           })
           .catch(function(err) {
              console.error(err);
              alert('Something went wrong. Please, try again.');
              num++;

           });
      }

   }

});
