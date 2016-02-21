app = {
	models: {},
	views: {},
	collections: {},
	routers: {},
	
	init: function() {
		var jobInit = new app.views.SearchJobList(dataJobs)
	}
};

app.models.Job = Backbone.Model.extend({
	
});

app.models.Worker = Backbone.Model.extend({
	
});

app.collections.Jobs = Backbone.Collection.extend({
	model: app.models.Job
});

app.collections.Workers = Backbone.Collection.extend({
	model: app.models.Worker,
	url: '/list_tweeter_users_occupations.php'
	//url: 'http://158.85.177.252/list_tweeter_users_occupations.php'
});

app.views.SearchJobItem = Backbone.View.extend({
	tagName: 'li',
	
	template: _.template($('#template-search-job-item').html()),
	
	events: {
		'click .job-item': 'findJobWorkers'
	},
	
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
	
	findJobWorkers: function(e) {
		//var fetchWorkers = new app.collections.Workers;collection.fetch({ data: $.param({ page: 1}) });
		var fetchWorkers = new app.collections.Workers,
			fetchWorkers = fetchWorkers.fetch({ data: $.param({ occupation: 'chef'}) })
		var foundWorkers = new app.views.WorkerList({
			collection: fetchWorkers
		});
	}
});

app.views.SearchJobList = Backbone.View.extend({
	el: '#main-search-job',
	
	initialize: function(data) {
		this.collection = new app.collections.Jobs(data);
		//this.render();
		
		this.on('change:searchJob', this.filterJob, this);
		this.collection.on('reset', this.render, this);
	},
	
	events: {
		'keypress #search-job': 'searchJob',
		'blur #search-job': 'searchJobCleanse'
	},
	
	render: function() {
		var self = this;
		$('#search-job-list').empty();
		
		_.each(this.collection.models, function(job) {
			self.addJob(job);
		}, this);
	},
	
	addJob: function(job) {
		var li = new app.views.SearchJobItem({
			model: job
		});
		$('#search-job-list').append(li.render().el);
	},
	
	searchJob: function(e) {
		this.searchJob = e.target.value;
		this.trigger('change:searchJob');
	},
	
	searchJobCleanse: function() {
		if (!$('#search-job').val().length) {
			
			this.collection.reset();
			$('#search-job-list').empty();
		}
	},
	
	filterJob: function() {
		this.collection.reset(dataJobs, {silent: true});
		var filterJob = this.searchJob,
			filtered = _.filter(this.collection.models, function(item) {
				return item.get('occupation').toLowerCase().indexOf(filterJob.toLowerCase()) !== -1;	
			});
		this.collection.reset(filtered);
	}
});

app.views.WorkerItem = Backbone.View.extend({
	tagName: 'div',
	
	className: 'uk-width-medium-1-5 uk-text-center uk-row-first',
	
	template: _.template($('#template-worker-item').html()),
	
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

app.views.WorkerList = Backbone.View.extend({
	el: '#worker-list',
	
	initialize: function(options) {
		this.collection = options.collection;
		this.render();
	},
	
	render: function() {
		var self = this;
		$('#worker-list').empty();
		
		_.each(this.collection.models, function(worker) {
			self.addWorkers(worker);
		}, this);
	},
	
	addWorkers: function(worker) {
		var view = new app.views.WorkerItem({
			model: worker
		});
		$('#worker-list').append(view.render().el);
	}
});

app.init();