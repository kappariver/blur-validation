/**
 * @license blur-validation v1.0.1
 * (c) 2018 kappariver
 * License: MIT
 */

 /*
 * Model
 */

function Model(element) {
    this.val = '';
    this.element = element;

    this.listeners = {
        valid: [],
        invalid: []
    };

    this.attributes = {
        required: '',
        maxlength: 8,
        minlength: 4
    };

    this.messages = {
        required: 'Input is required.',
        maxlength: 'Enter below ' + this.attributes.maxlength + ' characters.',
        minlength: 'Enter above ' + this.attributes.minlength + ' characters.'
    };
};

Model.prototype.set = function(val){
    this.val = val;
    this.validate();
};

Model.prototype.validate = function() {
    this.errors = [];
 
    for(var key in this.attributes) {
        var val = this.attributes[key];
        if(this[key](val)) return;
    }
 
    this.trigger(this.errors.length === 0 ? 'valid' : 'invalid');
};

Model.prototype.required = function(rule) {
    var key = 'required';
    if(this.element.hasClass(key)){
        if(this.val === rule){
            this.errors.push(key);
        }
    }
};

Model.prototype.maxlength = function(rule) {
    var key = 'maxlength';
    if(this.element.hasClass(key)) {
        if(this.val.length > rule) {
            this.errors.push(key);
        }
    }
};

Model.prototype.minlength = function(rule) {
    var key = 'minlength';
    if(this.element.hasClass(key)) {
        if(rule > this.val.length) {
            this.errors.push(key);
        }
    }
};

Model.prototype.on = function(event, func) {
    this.listeners[event].push(func);
};

Model.prototype.trigger = function(event) {
    $.each(this.listeners[event], function() {
        this();
    });
};

/*
 * View
 */

function View(element) {
    this.initialize(element);
    this.handleEvents();
};

View.prototype.initialize = function(element) {
    this.$element = $(element);
    this.$parent = this.$element.parent();
    this.model = new Model(this.$element);
};

View.prototype.handleEvents = function() {
    var self = this;

    this.$element.on('blur', function(e) {
        self.onBlur(e);
        console.log(self);
    });
 
    this.model.on('valid', function() {
        self.onValid();
    });
 
    this.model.on('invalid', function() {
        self.onInvalid();
    });
};

View.prototype.onBlur = function(e) {
    var $target = $(e.currentTarget);
    this.model.set($target.val());
};

View.prototype.onValid = function() {
    this.$element.removeClass('error');

    this.$parent.find('.errText').remove();
};
 
View.prototype.onInvalid = function() {
    this.$element.addClass('error');

    this.$parent.find('.errText').remove();

    var self = this;
    self.messages = this.model.messages;
    $.each(this.model.errors, function(index, val) {
        var text = self.messages[val];
        self.$parent.append('<p class="errText">' + text + '</p>');
    });
};

$('.js-validate').each(function() {
    new View(this);
});
