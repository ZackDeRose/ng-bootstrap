![Swampfox Logo](http://swampfoxinc.com/images/logo.gif)
## Building and Developing ivr-admin

**Recommended IDEs**

By Preference:
  + IntelliJ
  + Webstorm



**Getting the Sources**

Check out of the Clearcase repository.



**First Time Set Up**

This document assumes that Maven is properly set up in your environment. For instructions on setting up Maven, please see the provided Maven documents.
 
Official maven site: https://maven.apache.org/

1. Install the “Recommended For Most Users” release of Nodejs (available at https://nodejs.org)
2. Set proxy for npm via: `npm config set proxy http://proxycorp.dteco.com:8080/`
3. Install Angular CLI tool globally via the command: `npm install -g @angular/cli`
4. Install Grunt CLI tool globally via the command: `npm install -g grunt-cli`
5. [For Windows users] Install additional npm global packages: 
    + `npm install -g node-gyp`
    + `npm install -g --production windows-build-tools`



**Building**
1. Open a console/command line and navigate to the project directory [where you stored the source files].
2. Edit the src/assets/config.json to point to the most recent version of the SF_DTE_GUI_Services:

  + src/assets/config.json:
  
        {
          "services-location": "/SF_DTE_GUI_Services-1.3.0/"
        }
      Change the name of the "services-location" field to match the appropriate services release. 
3. Run the command: `mvn clean install`
    + Note that "mvn" command may be different depending on how Maven is set up on your machine.
    + This may take some time (3-5 minutes).
4. You can find your .war file in `[project-directory]/build/dteGUI.war`

The IntelliJ IDE has Maven Plugins that may be helpful for developers wishing to perform local builds.
      
See link: https://www.jetbrains.com/help/idea/maven-projects-tool-window.html



**Developing**
+ After pulling down the source files and performing first-time setup, make sure to run `npm install` to retrieve all development dependencies.
+ To run the GUI in development mode, run the command `npm start` and the webpage should be available at `localhost:4787`


Note that in order to receive responses from the GUI facing serves while running a local development build, you will need to edit the proxy.config.json file that can be found in the top level of the source code.

proxy.config.json:

    {
      "/SF_DTE_GUI_Services-1.3.0": {
        "target": "http://10.91.10.21:7001",
        "secure": false,
        "logLevel": "debug"
      }
    }
You will need to set the "target" field above to the location of your services.
       
Full documentation on creating an Angular Proxy to Backend can be found here: https://github.com/angular/angular-cli/blob/master/docs/documentation/stories/proxy.md
