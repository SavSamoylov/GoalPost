"use strict";

var should = require("chai").should();
var allValidation = require("../add.js");

describe("allValidation", function() {

  it("should validate all inputs", function() {
    allValidation().should.equal(" ");
  });

  it("should throw an imput empty error", function() {
  	(function(){
    allValidation(" ");
  	
  	}).should.throw(Error);
  });
    
  });