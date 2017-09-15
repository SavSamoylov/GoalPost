const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const exphbs  = require('express-handlebars');
const flash = require('connect-flash');
const path = require("path");
const morgan = require("morgan");
const expressValidator = require('express-validator')

let XPS = function(){

  this.app =  function(){return express();}

  this.go = function(app, obj){

    console.log("=========================================")
    console.log("   XPS Middleware and Set-up Functions")
    console.log("=========================================")

    //==================================================================================================
    // Set the Static file routes.
    //==================================================================================================

    if(obj.staticView && obj.staticView !== ""){
      let xps_Dir = obj.staticView;
      let xps_DirType = typeof xps_Dir;

      if (xps_DirType === "string"){

        f_xpsStatic(xps_Dir);

      } else if (xps_DirType === "object"){

        for (var i = 0; i < xps_Dir.length; i++) {

          f_xpsStatic(xps_Dir[i].toString())
        }

      } else {
        console.log("ERROR: The staticView property only takes a string or an array of strings value.");
        return
      }


    }

    //==================================================================================================
    // Set View Engine - Just express-handlebars for now.
    //==================================================================================================

    if(obj.viewEngine){
      let xps_ViewEngine = obj.viewEngine.toLowerCase().trim();
      let xps_ViewEngineType = typeof xps_ViewEngine;

      if(xps_ViewEngineType === "string"){

        if(xps_ViewEngine === "express-handlebars"){
          app.engine('handlebars', exphbs({defaultLayout: 'main'}));
          app.set('view engine', 'handlebars');
          console.log("++ View Engine: ", xps_ViewEngine)
        }

      }

    }

    //==================================================================================================
    // Set Body Parser Options
    //==================================================================================================

    if(obj.bodyParse){

      let xps_BP = obj.bodyParse;
      let xps_BPType = typeof xps_BP;


      if(xps_BP === true){
        // parse various different custom JSON types as JSON
        app.use(bodyParser.json({ type: 'application/*+json' }))

        // parse application/x-www-form-urlencoded
        app.use(bodyParser.urlencoded({ extended: false }))

        // parse some custom thing into a Buffer
        app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))

        // parse an HTML body into a string
        app.use(bodyParser.text({ type: 'text/html' }))
        console.log("++ Body-Parser: json, urlencoded, text, raw")

      } else if (xps_BPType === "object"){

        for (var i = 0; i < xps_BP.length; i++) {

          if (xps_BP[i].toLowerCase().trim() === "json"){
            app.use(bodyParser.json({ type: 'application/*+json' }))
            console.log("++ Body-Parser: json")
          }
          if (xps_BP[i].toLowerCase().trim() === "urlencoded"){
            app.use(bodyParser.urlencoded({ extended: false }))
            console.log("++ Body-Parser: urlencoded")
          }
          if (xps_BP[i].toLowerCase().trim() === "raw"){
            app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
            console.log("++ Body-Parser: raw")
          }
          if (xps_BP[i].toLowerCase().trim() === "text"){
            app.use(bodyParser.text({ type: 'text/html' }))
            console.log("++ Body-Parser: text")
          }

        }

      }

    }

    //==================================================================================================
    // Set Cookie Parser
    //==================================================================================================

    if (obj.cookieParse){

      let xps_CP = obj.cookieParse;

      if (xps_CP === true){
        app.use(cookieParser());
        console.log("++ Cookie-Parser: TRUE")
      }
    }


    //==================================================================================================
    // Set PORT
    //==================================================================================================

    if(obj.port) {

      let PORT = process.env.PORT || obj.port;
      let PORT_Type = typeof PORT;

      if (PORT_Type === "string" || PORT_Type === "number"){
        if (isNaN(PORT)) {
          PORT = parseInt(PORT)
          app.listen(PORT, ()=>{
          })
        } else {
          app.listen(PORT, ()=>{
          })
        }
      } else {
        console.log("ERROR: The port property only takes a string or an integer value. Example ('3000' or 3000)")
        return;
      }
      console.log("++ Server started on PORT: %s", PORT)

    }


    //==================================================================================================
    // Set Method-Override
    //==================================================================================================

    if(obj.methodOverride){
      app.use(methodOverride('_method'));
      console.log("++ method-override: TRUE")
    }



    //==================================================================================================
    // Set Connect-Flash
    //==================================================================================================

    if (obj.flash){

      let xps_Flash = obj.flash;

      if (xps_Flash === true){
        app.use(flash());
        console.log("++ Connect Flash: TRUE")
      }

    }

    //==================================================================================================
    // Set Express-Validator
    //==================================================================================================


    if (obj.validator){

      let xps_Validator = obj.validator;

      if (xps_Validator === true){

        app.use(expressValidator({
          errorFormatter: function(param, msg, value) {
            var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

            while(namespace.length) {
              formParam += '[' + namespace.shift() + ']';
            }
            return {
              param : formParam,
              msg   : msg,
              value : value
            };
          }
        }));

        console.log("++ Express Validator: TRUE")

      }

    }


    //==================================================================================================
    // Set Morgan Command Line Logger
    //==================================================================================================

    if(obj.httpLogger){
      let xps_HttpLogger = obj.httpLogger.toLowerCase().trim();
      if (xps_HttpLogger === "morgan"){
        app.use(morgan("dev"))
      }
      console.log("++ HTTP Logger: ",xps_HttpLogger)
    }

    //==================================================================================================
    // XPS Helper Functions
    //==================================================================================================


    // -------- SET STATIC DIRECTORIES

    function f_xpsStatic(directoryName){
      app.use(express.static(directoryName.trim().replace(/\s/g,'')));
      console.log("++ Static View Directory: ", directoryName)
    }



  } // -------- End of xps.go

}

let xps = new XPS();

module.exports = xps;
