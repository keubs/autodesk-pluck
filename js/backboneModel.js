$(function(){

    var Review = Backbone.Model.extend({

        // Default attributes for the review item.
        defaults: function() {
            return {
                username      : 'default username',
                title         : 'default title',
                body          : 'default body',
                createDate    : 'default date',
                reviewKey     : 'default key',
                userScore     : 'default current user score',
                positiveCount : 'default positive count',
                absoluteScore : 'default absolute score',
                photoKey      : 'default photo key',
                imageId       : 'default image id',
                thumbnail     : false,
                done          : false,
                replies       : 'default replies',
                order         : ReviewList.nextOrder()
            };
        },

        // model functions.
        getImageId : function(photoKey){
            var request = new PluckSDK.PhotoRequest();
            var newKey = new PluckSDK.PhotoKey();

            newKey.Key = photoKey;
            request.PhotoKey = newKey;

            PluckSDK.SendRequests([request], imgCallback);
        },

        getThumbnail : function(imageId){
            var request = new PluckSDK.ImageRequest();
            request.ImageId = photoKey;

            console.log(request);
            PluckSDK.SendRequests([request], imgCallback);
        }

    });


    // The collection of reviews is backed by *localStorage* instead of a remote
    // server.
    var ReviewList = Backbone.Collection.extend({

        url: 'default.json',
        // Reference to this collection's model.
        model: Review,

        // Save all of the todo items under the `"reviews-backbone"` namespace.
        //localStorage: new Backbone.LocalStorage("reviews-backbone"),

        // Filter down the list of all todo items that are finished.
        done: function() {
            return this.where({done: true});
        },

        // Filter down the list to only todo items that are still not finished.
        remaining: function() {
            return this.where({done: false});
        },

        // Filter down the list to only todo items that are still not finished.
        hasImages: function() {
            return this.where({thumbnail: true});
        },

        // We keep the Reviews in sequential order.  This generates the next order number for new items.
        nextOrder: function() {
            if (!this.length) return 1;
            return this.last().get('order') + 1;
        },

        // Todos are sorted by their original insertion order.
        comparator: 'order'

    });

    //Create the collection of reviews
    var Reviews = new ReviewList;


    // The DOM element for a review item...
    var ReviewView = Backbone.View.extend({

        //... is a list tag.
        tagName:  "li",

        // Cache the template function for a single item.
        template: _.template($('#review-template').html()),

        // The DOM events specific to an item.
        events: {
            "click .toggle"   : "toggleDone"
//            "dblclick .view"  : "edit",
//            "click a.destroy" : "clear",
//            "keypress .edit"  : "updateOnEnter",
//            "blur .edit"      : "close"
        },

        // The ReviewView listens for changes to its model, re-rendering. Since there's
        // a one-to-one correspondence between a **Review** and a **ReviewView** in this
        // app, we set a direct reference on the model for convenience.
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        // Re-render the titles of the review item.
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('done', this.model.get('done'));
            this.input = this.$('.edit');
            return this;
        },

        // Toggle the `"done"` state of the model.
        toggleDone: function() {
            this.model.toggle();
        },

        // Switch this view into `"commenting"` mode, displaying the input field.
        comment: function() {
            this.$el.addClass("editing");
            this.input.focus();
        },

        // Close the `"editing"` mode, saving changes to the review.
        close: function() {
            var value = this.input.val();
            if (!value) {
                this.clear();
            } else {
                this.model.save({title: value});
                this.$el.removeClass("editing");
            }
        },

        // If you hit `enter`, we're through editing the item.
        updateOnEnter: function(e) {
            if (e.keyCode == 13) this.close();
        },

        // Remove the item, destroy the model.
        clear: function() {
            this.model.destroy();
        }

    });

    // The Application
    // ---------------

    // Our overall **AppView** is the top-level piece of UI.
    var AppView = Backbone.View.extend({

        // Instead of generating a new element, bind to the existing skeleton of
        // the App already present in the HTML.
        el: $("#review-list"),

        // Our template for the line of statistics at the bottom of the app.
        //statsTemplate: _.template($('#stats-template').html()),

        // Delegated events for creating new items, and clearing completed ones.
        events: {
            "keypress #new-todo":  "createOnEnter"
//            "click #clear-completed": "clearCompleted",
//            "click #toggle-all": "toggleAllComplete"
        },

        // At initialization we bind to the relevant events on the `Reviews`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved in *localStorage*.
        initialize: function() {

            this.input = this.$("#new-todo");
            this.allCheckbox = this.$("#toggle-all")[0];

            this.listenTo(Reviews, 'add', this.addOne);
            this.listenTo(Reviews, 'reset', this.addAll);
            this.listenTo(Reviews, 'all', this.render);

            this.footer = this.$('footer');
            this.main = $('#main');

            Reviews.fetch();
        },

        // Re-rendering the App just means refreshing the statistics -- the rest
        // of the app doesn't change.
        render: function() {
            var done = Reviews.done().length;
            var remaining = Reviews.remaining().length;

            if (Reviews.length) {
                this.main.show();
                this.footer.show();
                this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
            } else {
                this.main.hide();
                this.footer.hide();
            }

            //this.allCheckbox.checked = !remaining;
        },

        // Add a single review item to the list by creating a view for it, and
        // appending its element to the `<ul>`.
        addOne: function(todo) {
            var view = new ReviewView({model: review});
            this.$("#review-list").append(view.render().el);
        },

        // Add all items in the **Todos** collection at once.
        addAll: function() {
            Reviews.each(this.addOne, this);
        },

//        // If you hit return in the main input field, create new **Todo** model,
//        // persisting it to *localStorage*.
//        createOnEnter: function(e) {
//            if (e.keyCode != 13) return;
//            if (!this.input.val()) return;
//
//            Todos.create({title: this.input.val()});
//            this.input.val('');
//        },

        // Clear all done todo items, destroying their models.
        clearCompleted: function() {
            _.invoke(Todos.done(), 'destroy');
            return false;
        }

//        toggleAllComplete: function () {
//            var done = this.allCheckbox.checked;
//            Todos.each(function (todo) { todo.save({'done': done}); });
//        }

    });

    // Finally, we kick things off by creating the **App**.
    var App = new AppView;


});





